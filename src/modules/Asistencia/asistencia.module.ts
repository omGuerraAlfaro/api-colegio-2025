import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { Asistencia } from 'src/models/Asistencia.entity';
import { CalendarioAsistencia } from 'src/models/CalendarioAsistencia';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asistencia, CalendarioAsistencia
    ]),
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [TypeOrmModule, AsistenciaService],
})
export class AsistenciaModule {}
