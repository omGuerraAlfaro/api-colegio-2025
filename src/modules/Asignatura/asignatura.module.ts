import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from 'src/models/Asignatura.entity';
import { AsignaturaService } from './asignatura.service';
import { AsignaturaController } from './asignatura.controller';
import { AsignaturaPreBasica } from 'src/models/AsignaturaPreBasica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asignatura, AsignaturaPreBasica
    ]),
  ],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
  exports: [TypeOrmModule, AsignaturaService],
})
export class AsignaturaModule {}
