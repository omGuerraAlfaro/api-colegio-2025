import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';
import { Curso } from 'src/models/Curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curso,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [CursoController],
  providers: [CursoService],
})
export class CursoModule { }
