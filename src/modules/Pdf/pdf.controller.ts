import { Controller, Get, Res, Query, InternalServerErrorException, Body, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { MatriculaDto } from 'src/dto/matricula.dto';
import { AlumnoRegularDto } from 'src/dto/alumno-regular.dto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) { }

  @Post('generate')
  async generatePdf(@Res() res: Response, @Body() datosMatricula: MatriculaDto) {
    try {
      // Llama al servicio para generar el PDF
      const pdf = await this.pdfService.generatePdfContratoMatricula('pdf-contrato', datosMatricula);

      // Establece la cabecera y envía el PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=example.pdf',
      });

      return res.send(pdf);
    } catch (error) {
      console.error('Error in controller:', error);
      throw new InternalServerErrorException('Failed to generate PDF.');
    }
  }

  @Post('generate/alumno-regular')
  async generatePdfAlumnoRegular(
    @Res() res: Response,
    @Body() datosAlumno: AlumnoRegularDto | null, // Permite que sea null
    @Query('validationCode') validationCode?: string
  ) {
    try {
      const pdf = await this.pdfService.generatePdfAlumnoRegular('pdf-alumno-regular', datosAlumno, validationCode);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=certificado.pdf',
      });

      return res.send(pdf);
    } catch (error) {
      console.error('Error in controller:', error);
      throw new InternalServerErrorException('Failed to generate PDF.');
    }
  }

}
