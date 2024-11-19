import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaController } from './boleta.controller';
import { BoletaService } from './boleta.service';

import { Transacciones } from 'src/models/Transacciones.entity';
import { EstadoTransaccion } from 'src/models/EstadoTransaccion.entity';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Boleta } from 'src/models/Boleta.entity';
import { ApoderadoModule } from '../Apoderado/apoderado.module';

@Module({
  imports: [
    ApoderadoModule,
    TypeOrmModule.forFeature([
      Boleta, Apoderado, Transacciones
    ]),
  ],
  exports: [TypeOrmModule, BoletaService],
  controllers: [BoletaController],
  providers: [BoletaService],
})
export class BoletaModule { }
