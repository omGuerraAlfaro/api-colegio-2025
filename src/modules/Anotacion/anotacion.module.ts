import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/models/Estudiante.entity';
import { AnotacionesEstudiante } from 'src/models/AnotacionesEstudiantes.entity';
import { AnotacionService } from './anotacion.service';
import { AnotacionController } from './anotacion.controller';
import { Anotacion } from 'src/models/Anotaciones.entity';
import { Asignatura } from 'src/models/Asignatura.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Anotacion,
      AnotacionesEstudiante,
      Asignatura
    ]),
  ],
  controllers: [AnotacionController],
  providers: [AnotacionService],
  exports: [TypeOrmModule, AnotacionService],
})
export class AnotacionModule {}
