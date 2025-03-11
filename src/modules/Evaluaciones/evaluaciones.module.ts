import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionController } from './evaluaciones.controller';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { EvaluacionService } from './evaluaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluacion]),
  ],
  controllers: [EvaluacionController],
  providers: [EvaluacionService],
  exports: [TypeOrmModule],
})
export class EvaluacionModule { }
