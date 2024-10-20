import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';
import { MatriculaDto } from 'src/dto/matricula.dto';

@Injectable()
export class PdfService {
  
  async generatePdf(templateName: string, data: MatriculaDto): Promise<Buffer> {
    try {
      // Usar `process.cwd()` para asegurarse de que se busque en el directorio de trabajo actual
      const templatePath = path.join(process.cwd(), 'src', 'components', 'templates', `${templateName}.hbs`);

      // Verifica si el archivo de la plantilla existe
      if (!fs.existsSync(templatePath)) {
        console.error('Template not found:', templatePath);
        throw new Error('Template file does not exist.');
      }

      // Leer y compilar la plantilla de Handlebars
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(htmlTemplate);

      // Pasar los datos a la plantilla
      const html = template({ ...data }); // Wrap in an object if needed

      //console.log('Generated HTML:', html);  // Registrar el HTML generado para verificar si es correcto

      // Lanzar Puppeteer para generar el PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Asegurar que Puppeteer puede ejecutarse en entornos de servidor
      });
      const page = await browser.newPage();
      await page.setContent(html);

      // Generar el PDF y convertir a Buffer
      const pdfBuffer = Buffer.from(await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '80px',
          bottom: '80px',
          left: '20mm',
          right: '20mm'
        },
        displayHeaderFooter: true,
        headerTemplate: `<p></p>`,
        footerTemplate: `
          <div style="font-size:10px; width:100%; text-align:center;">
            Página <span class="pageNumber"></span> de <span class="totalPages"></span>
          </div>
        `,
      }));
      
      

      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to generate PDF.');
    }
  }
}
