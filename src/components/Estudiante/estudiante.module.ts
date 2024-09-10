import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from 'src/models/Estudiante.entity';
import { Curso } from 'src/models/Curso.entity';
import { CursoModule } from '../Curso/curso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estudiante
    ]),
    CursoModule,
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [TypeOrmModule, EstudianteService],
})
export class EstudianteModule {}
