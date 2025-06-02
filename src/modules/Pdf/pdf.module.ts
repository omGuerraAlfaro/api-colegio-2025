import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PdfValidadorModule } from '../Pdf-Validador/pdf-validador.module';
import { NotasModule } from '../Notas/notas.module';
import { EstudianteModule } from '../Estudiante/estudiante.module';
import { CursoModule } from '../Curso/curso.module';
import { AsignaturaModule } from '../Asignatura/asignatura.module';

@Module({
  imports: [PdfValidadorModule, NotasModule, EstudianteModule, CursoModule, AsignaturaModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule { }
