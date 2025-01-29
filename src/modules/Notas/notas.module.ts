import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Nota } from 'src/models/Notas.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nota, Evaluacion
    ]),
  ],
  controllers: [NotasController],
  providers: [NotasService],
  exports: [TypeOrmModule],
})
export class NotasModule {}
