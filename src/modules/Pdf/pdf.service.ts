import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class PdfService {
  constructor(
    private readonly pdfValidadorService: PdfValidadorService,
    private readonly notasService: NotasService,
    private readonly estudianteService: EstudianteService,
    private readonly cursoService: CursoService,
    private readonly asignaturaService: AsignaturaService,
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
    data: findNotasAlumnoDto
  ): Promise<Buffer> {
    // 1) Obtener todas las asignaturas según el curso
    let asignaturas: any[] = [];
    if (data.cursoId === 1 || data.cursoId === 2) {
      asignaturas = await this.asignaturaService.getAllAsignaturasPreBasica();
    } else {
      asignaturas = await this.asignaturaService.getAllAsignaturasBasica();
    }
    console.log('Asignaturas obtenidas:', asignaturas);

    // 2) Obtener todas las notas del estudiante en el semestre
    const notas = await this.notasService.getTodasNotasPorEstudianteSemestre(
      data.estudianteId,
      data.semestreId,
      data.cursoId
    );
    console.log('Notas obtenidas:', JSON.stringify(notas, null, 2));

    // 3) Obtener información del estudiante y del curso
    const estudiante = await this.estudianteService.findById(data.estudianteId);
    console.log('Estudiante encontrado:', estudiante);

    const curso = await this.cursoService.findOneWithCurse(data.cursoId);
    console.log('Curso encontrado:', curso);

    // 4) Construir un mapa de notas: { asignaturaId: [ …notas… ] }
    const notasMap: Record<number, any[]> = {};
    notas.forEach((n) => {
      notasMap[n.asignaturaId] = n.notas;
    });
    console.log('notasMap generado:', notasMap);

    // 5) Construir "asignaturasConValores": cada asignatura con un array de 14 valores (string o null)
    interface AsignaturaValores {
      nombre: string;
      valores: (string | null)[];
      promedio: string | null;
    }

    const asignaturasConValores: AsignaturaValores[] = asignaturas.map((a) => {
      const arregloNotas = notasMap[a.id] ?? []; // si no hay notas, vacío
      const valores: (string | null)[] = Array(10).fill(null);

      arregloNotas.forEach((objNota, idx) => {
        if (idx < 10) {
          valores[idx] = objNota.nota; // usamos la propiedad "nota" del objeto
        }
      });

      return {
        nombre: a.nombre_asignatura,
        valores,
        promedio: null, // por defecto null → se mostrará "**" en la plantilla
      };
    });
    console.log('asignaturasConValores:', JSON.stringify(asignaturasConValores, null, 2));

    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      // 6) Ubicar el archivo .hbs de la plantilla
      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'templates',
        `${templateName}.hbs`
      );
      if (!fs.existsSync(templatePath)) {
        console.error('Template not found:', templatePath);
        throw new Error('Template file does not exist.');
      }

      // 7) Registrar helpers en Handlebars
      handlebars.unregisterHelper('eq');
      handlebars.unregisterHelper('anyMatch');
      handlebars.unregisterHelper('times');
      handlebars.unregisterHelper('inc');

      // Helper “inc”: convierte 0→'1', 1→'2', …
      handlebars.registerHelper('inc', (value: number) => {
        return (+value + 1).toString();
      });

      // Helper “times”: repite un bloque n veces, exponiendo “this” como 0..n-1
      handlebars.registerHelper('times', function (n: number, block) {
        let accum = '';
        for (let i = 0; i < n; i++) {
          accum += block.fn(i);
        }
        return accum;
      });

      // 1) Desregistrar el helper si ya existía
      handlebars.unregisterHelper('formatRutMiles');

      // 2) Registrar el nuevo helper que recibe RUT y DV por separado
      handlebars.registerHelper('formatRutMiles', (rutNumerico: string) => {
        // Si alguno de los dos valores es nulo/undefined, devolvemos cadena vacía
        if (!rutNumerico) {
          return '';
        }
        // Insertar puntos de miles: cada 3 dígitos desde la derecha
        // Ejemplo: "26201034" → "26.201.034"
        const numeroFormateado = rutNumerico.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Concatenamos: "26.201.034-1"
        return `${numeroFormateado}`;
      });


      // igualdad estricta
      handlebars.registerHelper('eq', (a: any, b: any) => a === b);

      // anyMatch (no usado en esta plantilla, pero queda registrado por si)
      handlebars.registerHelper(
        'anyMatch',
        (notasArray: any[], laId: number) => {
          if (!Array.isArray(notasArray)) return false;
          return notasArray.some((item) => item.asignaturaId === laId);
        }
      );

      // 8) Leer y compilar la plantilla Handlebars
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(htmlTemplate);
      asignaturasConValores.pop(); // Eliminar el último elemento que es un objeto vacío

      // 9) Construir el contexto EXACTO que necesita la plantilla
      const context = {
        asignaturasConValores,
        estudiante,
        curso,
      };
      console.log('Contexto para la plantilla:', JSON.stringify(context, null, 2));

      // 10) Generar el HTML pasándole el contexto
      const html = template(context);

      // 11) Lanzar Puppeteer para generar el PDF
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      page = await browser.newPage();
      await page.setContent(html);

      // 12) Crear el PDF y devolverlo como Buffer
      const pdfBuffer = Buffer.from(
        await page.pdf({
          width: '21.5cm',
          height: '33cm',
          landscape: true,
          printBackground: true,
          margin: {
            top: '20px',
            bottom: '20px',
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
      console.error('Error generating PDF:', error);
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



}
