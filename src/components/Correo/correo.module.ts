import { Module } from '@nestjs/common';
import { CorreoController } from './correo.controller';
import { ConfigModule } from '@nestjs/config';
import { CorreoService } from './correo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Correo } from 'src/models/Correo.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Correo])],
  controllers: [CorreoController],
  providers: [CorreoService],
  exports: [CorreoService]
  
})

export class CorreoModule { }
