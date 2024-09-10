import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from 'src/models/Asignatura.entity';
import { AsignaturaService } from './asignatura.service';
import { AsignaturaController } from './asignatura.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asignatura
    ]),
  ],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
  exports: [TypeOrmModule],
})
export class AsignaturaModule {}
