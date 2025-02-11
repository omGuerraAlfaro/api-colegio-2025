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

@Injectable()
export class PdfService {
  constructor(private readonly pdfValidadorService: PdfValidadorService) { }

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

  async generatePdfAlumnoRegular(templateName: string, data: AlumnoRegularDto): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      // Usar process.cwd() para buscar en el directorio de trabajo actual
      const templatePath = path.join(process.cwd(), 'src', 'modules', 'templates', `${templateName}.hbs`);

      // Verifica si el archivo de la plantilla existe
      if (!fs.existsSync(templatePath)) {
        console.error('Template not found:', templatePath);
        throw new Error('Template file does not exist.');
      }

      // 1. Generar un identificador único para la validación del certificado
      const newValidationId = uuidv4();

      // 2. Persistir el registro en la base de datos usando el PdfValidadorService  
      // Puedes ajustar los campos según tu entidad y la información disponible en data
      await this.pdfValidadorService.create({
        validationCode: newValidationId,
        certificateType: 'Alumno Regular',
        certificateNumber: (data as any).numero_matricula || null, // Asegúrate de que 'numero_matricula' esté en tu DTO
        // isValid se setea por defecto a false en la entidad
      });

      // 3. Construir la URL de validación incluyendo el id generado
      const validationUrl = `https://www.colegioandeschile.cl/validar-certificado?id=${newValidationId}`;
      // 4. Generar el código QR con la URL de validación
      const qrCodeDataUrl = await QRCode.toDataURL(validationUrl);

      // Configurar los helpers de Handlebars
      handlebars.registerHelper('formatRut', function (rut) {
        const rutStr = rut.toString();
        return rutStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      });

      handlebars.registerHelper('getCursoName', function (cursoId) {
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

      handlebars.registerHelper('getCursoNameType', function (cursoId) {
        const id = parseInt(cursoId, 10);
        return id <= 2 ? "Educación Parvularia" : "Educación Básica";
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
      // Se pasa además la imagen del QR (ya con la URL de validación) a la plantilla
      const template = handlebars.compile(htmlTemplate);
      const html = template({ ...data, qrCode: qrCodeDataUrl, newValidationId: newValidationId });

      // Lanzar Puppeteer para generar el PDF
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();
      await page.setContent(html);

      // Generar el PDF y convertirlo a Buffer
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
      // Asegurar que los recursos de Puppeteer se cierren siempre
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
