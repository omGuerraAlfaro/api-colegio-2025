import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BoletaModule } from '../Boleta/boleta.module';
import { CorreoModule } from '../Correo/correo.module';
import { ApoderadoModule } from '../Apoderado/apoderado.module';
import { EstudianteModule } from '../Estudiante/estudiante.module';
import { Transacciones } from 'src/models/Transacciones.entity';
import { PdfValidadorModule } from '../Pdf-Validador/pdf-validador.module';

@Module({
  imports: [EstudianteModule, ApoderadoModule, BoletaModule, CorreoModule, PdfValidadorModule, TypeOrmModule.forFeature([TransactionEntity, Transacciones])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
