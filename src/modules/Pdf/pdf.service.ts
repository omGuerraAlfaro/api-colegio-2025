import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';
import { MatriculaDto } from 'src/dto/matricula.dto';
import { AlumnoRegularDto } from 'src/dto/alumno-regular.dto';
import * as QRCode from 'qrcode';
import { PdfValidadorService } from '../Pdf-Validador/pdf-validador.service';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { log } from 'console';
import { CorreoService } from '../Correo/correo.service';
import { NotasService } from '../Notas/notas.service';
import { findNotasAlumnoDto } from 'src/dto/notas.dto';
import { EstudianteService } from '../Estudiante/estudiante.service';
import { CursoService } from '../Curso/curso.service';
import { AsignaturaService } from '../Asignatura/asignatura.service';
import { Semestre } from 'src/models/Semestre.entity';
import { AsistenciaService } from '../Asistencia/asistencia.service';
import { CierreSemestreService } from '../CierreSemestre/cierreSemestre.service';
import * as archiver from 'archiver';
import * as stream from 'stream';

@Injectable()
export class PdfService {
  constructor(
    private readonly pdfValidadorService: PdfValidadorService,
    private readonly notasService: NotasService,
    private readonly asistenciaService: AsistenciaService,
    private readonly estudianteService: EstudianteService,
    private readonly cursoService: CursoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly cierreSemestreService: CierreSemestreService,
  ) { }

  async generatePdfContratoMatricula(templateName: string, data: MatriculaDto): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      // Usar `process.cwd()` para asegurarse de que se busque en el directorio de trabajo actual
      const templatePath = path.join(process.cwd(), 'src', 'modules', 'templates', `${templateName}.hbs`);

      // Verifica si el archivo de la plantilla existe
      if (!fs.existsSync(templatePath)) {
        console.error('Template not found:', templatePath);
        throw new Error('Template file does not exist.');
      }

      handlebars.registerHelper('formatRut', function (rut) {
        const rutStr = rut.toString();
        return rutStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      });

      handlebars.registerHelper('getCursoName', function (cursoId) {
        const id = parseInt(cursoId, 10);
        switch (id) {
          case 1: return "Pre - Kinder";
          case 2: return "Kinder";
          case 3: return "Primero Básico";
          case 4: return "Segundo Básico";
          case 5: return "Tercero Básico";
          case 6: return "Cuarto Básico";
          case 7: return "Quinto Básico";
          case 8: return "Sexto Básico";
          case 9: return "Séptimo Básico";
          case 10: return "Octavo Básico";
          default: return "Curso Desconocido";
        }
      });

      handlebars.registerHelper('getGeneroName', function (genero) {
        switch (genero) {
          case 'F': return "Femenino";
          case 'M': return "Masculino";
          default: return "Desconocido";
        }
      });

      handlebars.registerHelper('calcularValorAnual', function (valor_mensualidad) {
        const valorMensual = parseFloat(valor_mensualidad);
        const valorAnual = valorMensual * 10;
        return valorAnual.toLocaleString('es-CL');
      });

      handlebars.registerHelper('formatearValor', function (valor_mensualidad) {
        const valorMensual = parseFloat(valor_mensualidad);
        return valorMensual.toLocaleString('es-CL');
      });

      // Leer y compilar la plantilla de Handlebars
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(htmlTemplate);

      // Pasar los datos a la plantilla
      const html = template({ ...data }); // Wrap in an object if needed

      // Lanzar Puppeteer para generar el PDF
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();
      await page.setContent(html);

      // Generar el PDF y convertir a Buffer
      const pdfBuffer = Buffer.from(
        await page.pdf({
          width: '21.5cm',
          height: '33cm',
          printBackground: true,
          margin: {
            top: '80px',
            bottom: '80px',
            left: '20mm',
            right: '20mm',
          },
          displayHeaderFooter: true,
          headerTemplate: `<p></p>`,
          footerTemplate: `
            <div style="font-size:10px; width:100%; text-align:center;">
              Página <span class="pageNumber"></span> de <span class="totalPages"></span>
            </div>
          `,
        })
      );

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to generate PDF.');
    } finally {
      // Asegurar que los recursos de Puppeteer se cierran siempre
      if (page) {
        try {
          await page.close();
        } catch (pageError) {
          console.error('Error closing Puppeteer page:', pageError);
        }
      }
      if (browser) {
        try {
          await browser.close();
        } catch (browserError) {
          console.error('Error closing Puppeteer browser:', browserError);
        }
      }
    }
  }

  async generatePdfAlumnoRegular(templateName: string, data: AlumnoRegularDto | null, validationCodeParam?: string): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      const templatePath = path.join(process.cwd(), 'src', 'modules', 'templates', `${templateName}.hbs`);
      if (!fs.existsSync(templatePath)) {
        console.error('Template not found:', templatePath);
        throw new Error('Template file does not exist.');
      }

      let newValidationId = '';
      let templateData: any;

      console.log(data);

      if (data && data.isErp) {
        newValidationId = uuidv4();

        const expirationDate = startOfDay(addDays(new Date(), 30));

        const newRecord = await this.pdfValidadorService.create({
          validationCode: newValidationId,
          certificateType: data.tipo_certificado,
          certificateNumber: data.numero_matricula.toString() || null,
          primerNombreAlumno: data.primer_nombre_alumno,
          segundoNombreAlumno: data.segundo_nombre_alumno,
          primerApellidoAlumno: data.primer_apellido_alumno,
          segundoApellidoAlumno: data.segundo_apellido_alumno,
          curso: Number(data.curso),
          rut: data.rut,
          dv: data.dv,
          isErp: data.isErp,
          rutApoderado: data.rutApoderado,
          expirationDate
        });

        templateData = {
          ...data,
          expirationDate,
          createdAt: newRecord.createdAt
        };
      } else {
        if (!validationCodeParam) {
          throw new Error('El validationCode es obligatorio cuando data es null o isErp es false.');
        }
        const dataPdf = await this.pdfValidadorService.findOne(validationCodeParam);
        console.log(dataPdf);

        if (!dataPdf) {
          throw new Error('No se encontró registro para el validationCode proporcionado.');
        }
        newValidationId = dataPdf.validationCode;
        templateData = { ...dataPdf };
      }

      const validationUrl = `https://www.colegioandeschile.cl/validar-certificado?id=${newValidationId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(validationUrl);

      templateData = { ...templateData, qrCode: qrCodeDataUrl, newValidationId };

      handlebars.registerHelper('formatRut', (rut) => {
        return rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      });
      handlebars.registerHelper('getCursoName', (cursoId) => {
        const id = parseInt(cursoId, 10);
        switch (id) {
          case 1: return "Pre-Kinder";
          case 2: return "Kinder";
          case 3: return "Primero";
          case 4: return "Segundo";
          case 5: return "Tercero";
          case 6: return "Cuarto";
          case 7: return "Quinto";
          case 8: return "Sexto";
          case 9: return "Séptimo";
          case 10: return "Octavo";
          default: return "Curso Desconocido";
        }
      });
      handlebars.registerHelper('getCursoNameType', (cursoId) => {
        const id = parseInt(cursoId, 10);
        return id <= 2 ? "Educación Parvularia" : "Educación Básica";
      });
      handlebars.registerHelper('getGeneroName', (genero) => {
        switch (genero) {
          case 'F': return "Femenino";
          case 'M': return "Masculino";
          default: return "Desconocido";
        }
      });
      handlebars.registerHelper('calcularValorAnual', (valor_mensualidad) => {
        const valorMensual = parseFloat(valor_mensualidad);
        const valorAnual = valorMensual * 10;
        return valorAnual.toLocaleString('es-CL');
      });
      handlebars.registerHelper('formatearValor', (valor_mensualidad) => {
        const valorMensual = parseFloat(valor_mensualidad);
        return valorMensual.toLocaleString('es-CL');
      });
      handlebars.registerHelper('formatDate', (date) => {
        console.log(date);

        if (!date) return 'Fecha inválida';
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
      });
      handlebars.registerHelper('formatDate2', (date) => {
        console.log(date);

        if (!date) return 'Fecha inválida';
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
      });

      // Leer y compilar el template
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(htmlTemplate);
      const html = template(templateData);

      // Iniciar Puppeteer para generar el PDF
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      page = await browser.newPage();
      await page.setContent(html);

      const pdfBuffer = await page.pdf({
        width: '21.5cm',
        height: '33cm',
        printBackground: true,
        margin: { top: '80px', bottom: '80px', left: '20mm', right: '20mm' },
        displayHeaderFooter: true,
        headerTemplate: `<p></p>`,
        footerTemplate: `<div style="font-size:10px; text-align:center;"> Página <span class="pageNumber"></span> de <span class="totalPages"></span> </div>`
      });

      return Buffer.from(pdfBuffer);

    } catch (error) {
      console.error('Error generating PDF:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to generate PDF.');
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (pageError) {
          console.error('Error closing Puppeteer page:', pageError);
        }
      }
      if (browser) {
        try {
          await browser.close();
        } catch (browserError) {
          console.error('Error closing Puppeteer browser:', browserError);
        }
      }
    }
  }

  async generatePdfAlumnoNotas(
    templateName: string,
    data: findNotasAlumnoDto,
    tipo: string
  ): Promise<Buffer> {
    const semestre = data.semestreId;
    const cursoId = data.cursoId;

    const asignaturas = (
      data.cursoId === 1 || data.cursoId === 2
        ? await this.asignaturaService.getAllAsignaturasPreBasica()
        : await this.asignaturaService.getAllAsignaturasBasica()
    ) as any[];

    let notas: any[] = [];

    try {
      notas = await this.notasService.getTodasNotasPorEstudianteSemestre(
        data.estudianteId,
        data.semestreId,
        data.cursoId
      );

      if (!notas || notas.length === 0) {
        throw new BadRequestException(
          'El estudiante no tiene notas registradas para el semestre seleccionado.'
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Error obteniendo notas del estudiante:', error);
      throw new InternalServerErrorException('Error al obtener las notas del estudiante.');
    }

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const estudiante = await this.estudianteService.findById(data.estudianteId);
    const curso = await this.cursoService.findOneWithCurse(data.cursoId);

    let porcentajeAsistencia: number | null = null;

    try {
      const asistencia = await this.asistenciaService.getAsistenciasResumenPorAlumnoToday(
        data.semestreId,
        data.estudianteId,
        todayStr
      );

      if (asistencia?.porcentajeAsistencia !== undefined) {
        porcentajeAsistencia = Math.round(asistencia.porcentajeAsistencia);
      }
    } catch (err) {
      console.warn(`No se pudo obtener asistencia del alumno ${data.estudianteId} en semestre ${data.semestreId}:`, err.message);
      porcentajeAsistencia = null
    }

    function convertToLetra(notaStr: string | undefined): string | null {
      const nota = parseFloat(notaStr ?? '');
      if (isNaN(nota)) return null;
      if (nota >= 6) return 'MB';
      if (nota >= 5) return 'B';
      if (nota >= 4) return 'S';
      return 'I';
    }

    const notasMap: Record<number, any[]> = {};
    const finalesMap: Record<number, any[]> = {};
    notas.forEach((n) => {
      notasMap[n.asignaturaId] = n.notas;
      finalesMap[n.asignaturaId] = n.finales ?? [];
    });

    const maxNotas = Math.max(...notas.map((n) => n.notas.length));

    const asignaturasConValores = asignaturas.map((a) => {
      const nombreAsignatura = a.nombre_asignatura?.toLowerCase().trim();
      const esCualitativa = ['religión', 'religion', 'orientación', 'orientacion'].includes(nombreAsignatura);
      const arregloNotas = notasMap[a.id] ?? [];
      const arregloFinales = finalesMap[a.id] ?? [];

      const valores: (string | null)[] = Array(maxNotas).fill(null);
      arregloNotas.forEach((objNota, idx) => {
        if (idx < maxNotas) valores[idx] = objNota.nota;
      });

      let promedio: string | null = null;

      if (tipo === 'final') {
        const notaFinal = arregloFinales.find(
          (f) => f.nombreEvaluacion?.toLowerCase().trim() === 'final'
        );
        promedio = esCualitativa
          ? convertToLetra(notaFinal?.nota)
          : notaFinal?.nota?.toString() ?? null;
      } else {
        // tipo === 'parcial'
        const notasNumericas = arregloNotas
          .map(n => parseFloat(n.nota))
          .filter(n => !isNaN(n));

        if (notasNumericas.length > 0) {
          const sumaNotas = notasNumericas.reduce((sum, n) => sum + n, 0);
          const promedioNumerico = (sumaNotas / notasNumericas.length).toFixed(1);

          promedio = esCualitativa
            ? convertToLetra(promedioNumerico)
            : promedioNumerico;
        }
      }

      return {
        nombre: nombreAsignatura,
        nombreOriginal: a.nombre_asignatura,
        valores,
        promedio,
      };
    });


    // ✅ Cálculo del promedio, excluyendo inglés si cursoId <= 5
    let suma = 0;
    let cantidad = 0;
    const excluidasDelPromedio: string[] = [];

    for (const [asignaturaId, finales] of Object.entries(finalesMap)) {
      const asignatura = asignaturas.find((a) => a.id === Number(asignaturaId));
      const nombre = asignatura?.nombre_asignatura?.toLowerCase().trim();
      if (!nombre) continue;

      const esCualitativa = ['religión', 'religion', 'orientación', 'orientacion'].includes(nombre);
      const esIngles = nombre === 'inglés' || nombre === 'ingles';

      const notaFinal = finales.find(
        (f) => f.nombreEvaluacion?.toLowerCase().trim() === 'final'
      );

      const valor = parseFloat(notaFinal?.nota ?? '');
      if (isNaN(valor) || esCualitativa) continue;

      if (cursoId <= 5 && esIngles) {
        excluidasDelPromedio.push('ingles');
        continue;
      }

      suma += valor;
      cantidad++;
    }

    let promedioParcial: string | null = null;
    let promedioFinal: string | null = null;

    if (tipo === 'final') {
      const auxPromedioFinal = await this.cierreSemestreService.obtenerPorEstudianteySemestre(data.estudianteId, semestre);
      promedioFinal = auxPromedioFinal[0]?.nota_final.toString() ?? null;
    } else {
      const promediosNumericos = asignaturasConValores
        .filter(a => {
          const nombre = a.nombre?.toLowerCase();
          if (cursoId <= 5 && (nombre === 'inglés' || nombre === 'ingles')) {
            excluidasDelPromedio.push('ingles');
            return false;
          }
          return true;
        })
        .map(a => parseFloat(a.promedio))
        .filter(n => !isNaN(n));

      if (promediosNumericos.length > 0) {
        const sumaPromedios = promediosNumericos.reduce((acc, val) => acc + val, 0);
        promedioParcial = (sumaPromedios / promediosNumericos.length).toFixed(1);
      }
    }

    const templatePath = path.join(process.cwd(), 'src', 'modules', 'templates', `${templateName}.hbs`);
    if (!fs.existsSync(templatePath)) throw new Error('Template file does not exist.');

    handlebars.unregisterHelper('eq');
    handlebars.unregisterHelper('anyMatch');
    handlebars.unregisterHelper('times');
    handlebars.unregisterHelper('inc');
    handlebars.unregisterHelper('formatRutMiles');

    handlebars.registerHelper('lte', function (a: number, b: number) {
      return a <= b;
    });

    handlebars.registerHelper('inc', (value: number) => (+value + 1).toString());
    handlebars.registerHelper('times', function (n: number, block) {
      let out = '';
      for (let i = 0; i < n; i++) out += block.fn(i);
      return out;
    });
    handlebars.registerHelper('formatRutMiles', (rut: string) => rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    handlebars.registerHelper('esPrimerSemestre', (semestre, options) => semestre === 1 ? options.fn(this) : options.inverse(this));
    handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    handlebars.registerHelper('anyMatch', (arr: any[], id: number) => arr?.some((x) => x.asignaturaId === id));
    handlebars.registerHelper('getCursoNameType', (cursoId) => parseInt(cursoId) <= 2 ? 'Educación Parvularia' : 'Educación Básica');
    handlebars.registerHelper('getCursoName', (cursoId) => {
      const id = parseInt(cursoId);
      return ['Pre-Kinder', 'Kinder', 'Primer Año', 'Segundo Año', 'Tercero Año', 'Cuarto Año', 'Quinto Año', 'Sexto Año', 'Séptimo Año', 'Octavo Año'][id - 1] || 'Curso Desconocido';
    });

    handlebars.registerHelper('includes', (arr: any[], value: any) => Array.isArray(arr) && arr.includes(value));
    handlebars.registerHelper('and', (a, b) => a && b);

    handlebars.registerHelper('evaluacionNotaIndividual', (nombreAsignatura: string, notaStr: string | null) => {
      const nombre = nombreAsignatura.toLowerCase();
      const nota = parseFloat(notaStr || '');
      const esCualitativa = ['religión', 'religion', 'orientación', 'orientacion'].includes(nombre);

      if (esCualitativa && !isNaN(nota)) {
        if (nota >= 6) return 'MB';
        if (nota >= 5) return 'B';
        if (nota >= 4) return 'S';
        return 'I';
      }

      if (!isNaN(nota)) {
        const notaFormateada = nota.toFixed(1);
        if (nota <= 3.9) {
          return new handlebars.SafeString(`<span style="color: red; font-weight: bold;">${notaFormateada}</span>`);
        } else {
          return notaFormateada;
        }
      }

      return new handlebars.SafeString('<span class="sin-notas">–</span>');
    });

    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(htmlTemplate);
      asignaturasConValores.pop(); // opcional

      const context = {
        asignaturasConValores,
        estudiante,
        curso,
        semestre,
        maxNotas,
        promedioFinal,
        promedioParcial,
        cursoId,
        porcentajeAsistencia,
        excluidasDelPromedio, // ✅ Para mostrar leyenda en plantilla
      };

      const html = template(context);

      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      page = await browser.newPage();
      await page.setContent(html);

      const pdfBuffer = Buffer.from(await page.pdf({
        width: '21.5cm',
        height: '33cm',
        landscape: true,
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20mm', right: '20mm' },
        displayHeaderFooter: true,
        headerTemplate: `<p></p>`,
        footerTemplate: `<div style="font-size:10px; width:100%; text-align:center;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>`,
      }));

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Failed to generate PDF.');
    } finally {
      try {
        if (page) await page.close();
        if (browser) await browser.close();
      } catch (closeErr) {
        console.error('Error closing Puppeteer:', closeErr);
      }
    }
  }


  async exportCursoNotasZip(
    cursoId: number,
    semestreId: number,
    tipo: string
  ): Promise<Buffer> {
    const pdfs = await this.generatePdfCursoNotas(cursoId, semestreId, tipo);

    if (!pdfs || pdfs.length === 0) {
      console.error('✖ No se pudo generar ningún PDF. ZIP abortado.');
      throw new InternalServerErrorException('No se pudo generar ningún certificado para este curso.');
    }

    return new Promise<Buffer>((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const zipStream = new stream.PassThrough();
      const chunks: Buffer[] = [];

      zipStream.on('data', (chunk) => chunks.push(chunk));
      zipStream.on('end', () => {
        const finalBuffer = Buffer.concat(chunks);
        console.log('✔ ZIP finalizado. Tamaño:', finalBuffer.length);
        resolve(finalBuffer);
      });

      zipStream.on('error', (err) => {
        console.error('✖ Error en stream del zip:', err);
        reject(err);
      });

      archive.pipe(zipStream);

      for (const { nombre, pdf } of pdfs) {
        const safeName = nombre.replace(/[^a-zA-Z0-9]/g, '_');
        console.log(`➕ Agregando PDF para ${nombre} al ZIP`);
        archive.append(pdf, { name: `${safeName}.pdf` });
      }

      archive.finalize().catch((err) => {
        console.error('✖ Error al finalizar el zip:', err);
        reject(err);
      });
    });
  }


  async generatePdfCursoNotas(
    cursoId: number,
    semestreId: number,
    tipo: string
  ): Promise<{ estudianteId: number; nombre: string; pdf: Buffer }[]> {
    const cursoConEstudiantes = await this.cursoService.findStudentsWithCursoId(cursoId);
    const estudiantes = cursoConEstudiantes.estudiantes;

    if (!estudiantes || estudiantes.length === 0) {
      throw new BadRequestException('No hay estudiantes registrados en el curso seleccionado.');
    }

    const resultados = await Promise.allSettled(
      estudiantes.map(async (estudiante) => {
        const data = {
          estudianteId: estudiante.id,
          cursoId,
          semestreId
        };

        const pdf = await this.generatePdfAlumnoNotas('pdf-alumno-notas', data, tipo);
        return {
          estudianteId: estudiante.id,
          nombre: `${estudiante.primer_nombre_alumno} ${estudiante.primer_apellido_alumno || ''} ${estudiante.segundo_apellido_alumno || ''}`.trim(),
          pdf
        };
      })
    );

    const pdfs = resultados
      .filter((r): r is PromiseFulfilledResult<{ estudianteId: number; nombre: string; pdf: Buffer }> => r.status === 'fulfilled')
      .map((r) => r.value);

    resultados
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .forEach((r, idx) => console.warn(`⚠️ Error generando PDF para estudiante ${estudiantes[idx]?.id}:`, r.reason?.message || r.reason));

    console.log(`✔ PDFs generados: ${pdfs.length} / ${estudiantes.length}`);
    return pdfs;
  }




}
