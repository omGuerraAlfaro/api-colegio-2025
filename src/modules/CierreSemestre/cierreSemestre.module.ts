import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CierreSemestre } from 'src/models/CierreSemestre.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { CierreSemestreController } from './cierreSemestre.controller';
import { CierreSemestreService } from './cierreSemestre.service';
import { NotasModule } from '../Notas/notas.module';
import { Curso } from 'src/models/Curso.entity';
import { Semestre } from 'src/models/Semestre.entity';

@Module({
  imports: [
    NotasModule,
    TypeOrmModule.forFeature([CierreSemestre, Estudiante, Curso, Semestre])
  ],
  controllers: [CierreSemestreController],
  providers: [CierreSemestreService],
})
export class CierreSemestreModule { }
