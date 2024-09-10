import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './user.controller';
import { UsuarioService } from './user.service';
import { Usuarios } from 'src/models/User.entity';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Profesor } from 'src/models/Profesor.entity';
import { Administrador } from 'src/models/Administrador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuarios,
      Apoderado,
      Profesor,
      Administrador
    ]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule { }
