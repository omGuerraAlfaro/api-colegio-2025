import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionMatriculaController } from './inscripcionMatricula.controller';
import { InscripcionMatriculaService } from './inscripcionMatricula.service';
import { InscripcionMatricula } from 'src/models/InscripcionMatricula.entity';
import { CorreoModule } from '../Correo/correo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InscripcionMatricula
    ]),
    CorreoModule
  ],
  controllers: [InscripcionMatriculaController],
  providers: [InscripcionMatriculaService],
  exports: [TypeOrmModule],
})
export class InscripcionMatriculaModule {}
