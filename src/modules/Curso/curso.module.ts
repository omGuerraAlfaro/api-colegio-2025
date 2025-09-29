import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { Curso } from 'src/models/Curso.entity';
import { Semestre } from 'src/models/Semestre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curso, Semestre
    ]),
  ],
  exports: [TypeOrmModule, CursoService],
  controllers: [CursoController],
  providers: [CursoService],
})
export class CursoModule { }
