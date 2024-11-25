import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { Asistencia } from 'src/models/Asistencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asistencia
    ]),
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [TypeOrmModule],
})
export class AsistenciaModule {}
