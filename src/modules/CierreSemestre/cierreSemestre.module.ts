import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CierreSemestre } from 'src/models/CierreSemestre.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { CierreSemestreController } from './cierreSemestre.controller';
import { CierreSemestreService } from './cierreSemestre.service';
import { NotasModule } from '../Notas/notas.module';
import { Curso } from 'src/models/Curso.entity';
import { Semestre } from 'src/models/Semestre.entity';
import { AsistenciaModule } from '../Asistencia/asistencia.module';
import { CierreObservacionAlumno } from 'src/models/CierreObservacionAlumno';

@Module({
  imports: [
    NotasModule,
    AsistenciaModule,
    TypeOrmModule.forFeature([CierreSemestre, CierreObservacionAlumno, Estudiante, Curso, Semestre])
  ],
  controllers: [CierreSemestreController],
  providers: [CierreSemestreService],
  exports: [CierreSemestreService]
})
export class CierreSemestreModule { }
