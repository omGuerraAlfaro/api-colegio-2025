import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorController } from './administrador.controller';
import { Administrador } from 'src/models/Administrador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administrador,
    ]),
  ],
  controllers: [AdministradorController],
  providers: [AdministradorService],
  exports: [TypeOrmModule, AdministradorService],
})
export class AdministradorModule {}
