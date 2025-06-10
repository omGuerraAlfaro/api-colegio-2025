import { Controller, Get, Res, Query, InternalServerErrorException, Body, Post, Header } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { MatriculaDto } from 'src/dto/matricula.dto';
import { AlumnoRegularDto } from 'src/dto/alumno-regular.dto';
import { findNotasAlumnoDto } from 'src/dto/notas.dto';

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

  @Post('generate/alumno-regular/app')
  async pdfAlumnoRegular(
    @Body() dataAlumno: AlumnoRegularDto | null,
    @Query('validationCode') validationCode: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const pdf = await this.pdfService.generatePdfAlumnoRegular(
        'pdf-alumno-regular',
        dataAlumno,
        validationCode
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="certificado.pdf"');
      res.end(pdf, 'binary'); // Enviar binario directamente
    } catch (error) {
      res.status(500).send('Error al generar PDF');
    }
  }

  @Post('generate/alumno-notas')
  async generatePdfAlumnoNotas(@Res() res: Response, @Body() datosNotas: findNotasAlumnoDto) {

    const pdf = await this.pdfService.generatePdfAlumnoNotas('pdf-alumno-notas', datosNotas);

    // Establece la cabecera y envía el PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
    });

    return res.send(pdf);
  }


}
