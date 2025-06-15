import { Controller, Get, Res, Query, InternalServerErrorException, Body, Post, Header, BadRequestException } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { MatriculaDto } from 'src/dto/matricula.dto';
import { AlumnoRegularDto } from 'src/dto/alumno-regular.dto';
import { findNotasAlumnoDto } from 'src/dto/notas.dto';
import { CursoService } from '../Curso/curso.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService,
    private readonly cursoService: CursoService
  ) { }

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

  @Post('generate/alumno-notas-parcial')
  async generatePdfAlumnoNotas(@Res() res: Response, @Body() datosNotas: findNotasAlumnoDto) {

    const pdf = await this.pdfService.generatePdfAlumnoNotas('pdf-alumno-notas', datosNotas, 'parcial');

    // Establece la cabecera y envía el PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
    });

    return res.send(pdf);
  }


  @Get('curso-notas-parcial/pdf-zip')
  async descargarZipPorCurso(
    @Query('cursoId') cursoId: string,
    @Query('semestreId') semestreId: string,
    @Res() res: Response
  ) {
    try {
      const cursoIdNum = parseInt(cursoId, 10);
      const semestreIdNum = parseInt(semestreId, 10);

      if (isNaN(cursoIdNum) || isNaN(semestreIdNum)) {
        throw new BadRequestException('Parámetros cursoId y semestreId inválidos');
      }

      console.log('→ Solicitando ZIP Final:', { cursoIdNum, semestreIdNum });

      const zipBuffer = await this.pdfService.exportCursoNotasZip(
        cursoIdNum,
        semestreIdNum,
        'parcial'
      );

      if (!zipBuffer || zipBuffer.length === 0) {
        console.error('✖ ZIP generado vacío o nulo');
        throw new InternalServerErrorException('Error al generar el ZIP de notas del curso');
      }

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="notas_curso_${cursoIdNum}.zip"`,
        'Content-Length': zipBuffer.length,
      });

      console.log('✔ ZIP generado correctamente:', zipBuffer.length, 'bytes');
      res.end(zipBuffer); // usa .end en vez de .send para binarios

    } catch (error) {
      console.error('✖ Error en generación de ZIP:', error);
      res.status(500).send('Error al generar ZIP');
    }
  }

  @Post('generate/alumno-notas-final')
  async generatePdfAlumnoNotasFinal(@Res() res: Response, @Body() datosNotas: findNotasAlumnoDto) {

    const pdf = await this.pdfService.generatePdfAlumnoNotas('pdf-alumno-notas', datosNotas, 'final');

    // Establece la cabecera y envía el PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
    });

    return res.send(pdf);
  }


  @Get('curso-notas-final/pdf-zip')
  async descargarZipPorCursoFinal(
    @Query('cursoId') cursoId: string,
    @Query('semestreId') semestreId: string,
    @Res() res: Response
  ) {
    try {
      const cursoIdNum = parseInt(cursoId, 10);
      const semestreIdNum = parseInt(semestreId, 10);

      if (isNaN(cursoIdNum) || isNaN(semestreIdNum)) {
        throw new BadRequestException('Parámetros cursoId y semestreId inválidos');
      }

      console.log('→ Solicitando ZIP Final:', { cursoIdNum, semestreIdNum });

      const zipBuffer = await this.pdfService.exportCursoNotasZip(
        cursoIdNum,
        semestreIdNum,
        'final'
      );

      if (!zipBuffer || zipBuffer.length === 0) {
        console.error('✖ ZIP generado vacío o nulo');
        throw new InternalServerErrorException('Error al generar el ZIP de notas del curso');
      }

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="notas_curso_${cursoIdNum}.zip"`,
        'Content-Length': zipBuffer.length,
      });

      console.log('✔ ZIP generado correctamente:', zipBuffer.length, 'bytes');
      res.end(zipBuffer); // usa .end en vez de .send para binarios

    } catch (error) {
      console.error('✖ Error en generación de ZIP:', error);
      res.status(500).send('Error al generar ZIP');
    }
  }


}
