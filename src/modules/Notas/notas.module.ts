import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Nota } from 'src/models/Notas.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { Curso } from 'src/models/Curso.entity';
import { NotaPreBasica } from 'src/models/NotasPreBasica.entity';
import { EvaluacionPreBasica } from 'src/models/EvaluacionPreBasica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nota, NotaPreBasica, Evaluacion, EvaluacionPreBasica, Curso
    ]),
  ],
  controllers: [NotasController],
  providers: [NotasService],
  exports: [TypeOrmModule, NotasService],
})
export class NotasModule {}
