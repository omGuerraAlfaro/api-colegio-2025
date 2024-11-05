import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorController } from './administrador.controller';
import { Administrador } from 'src/models/Administrador.entity';
import { SubAdministrador } from 'src/models/SubAdministrador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administrador, SubAdministrador
    ]),
  ],
  controllers: [AdministradorController],
  providers: [AdministradorService],
  exports: [TypeOrmModule, AdministradorService],
})
export class AdministradorModule {}
