import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Nota } from 'src/models/Notas.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { Curso } from 'src/models/Curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nota, Evaluacion, Curso
    ]),
  ],
  controllers: [NotasController],
  providers: [NotasService],
  exports: [TypeOrmModule],
})
export class NotasModule {}
