import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionTallerController } from './inscripcionTaller.controller';
import { InscripcionTallerService } from './inscripcionTaller.service';
import { CorreoModule } from '../Correo/correo.module';
import { Estudiante } from 'src/models/Estudiante.entity';
import { InscripcionTaller } from 'src/models/InscripcionTaller.entity';
import { TipoTaller } from 'src/models/TipoTaller.entity';
import { Curso } from 'src/models/Curso.entity';
import { CursoService } from '../Curso/curso.service';
import { CursoModule } from '../Curso/curso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InscripcionTaller, Estudiante, TipoTaller
    ]),
    CorreoModule,
    CursoModule
  ],
  controllers: [InscripcionTallerController],
  providers: [InscripcionTallerService],
  exports: [TypeOrmModule],
})
export class InscripcionTallerModule {}
