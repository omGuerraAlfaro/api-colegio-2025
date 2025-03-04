import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionMatriculaController } from './inscripcionMatricula.controller';
import { InscripcionMatriculaService } from './inscripcionMatricula.service';
import { InscripcionMatricula } from 'src/models/InscripcionMatricula.entity';
import { CorreoModule } from '../Correo/correo.module';
import { ApoderadoModule } from '../Apoderado/apoderado.module';
import { Estudiante } from 'src/models/Estudiante.entity';
import { ApoderadoSuplente } from 'src/models/ApoderadoSuplente.entity';
import { ApoderadoSuplenteEstudiante } from 'src/models/ApoderadoSuplenteEstudiante.entity';
import { UsuarioModule } from '../User/user.module';
import { Asistencia } from 'src/models/Asistencia.entity';
import { CalendarioAsistencia } from 'src/models/CalendarioAsistencia';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InscripcionMatricula,ApoderadoSuplente,ApoderadoSuplenteEstudiante,Asistencia,CalendarioAsistencia
    ]),
    CorreoModule,
    UsuarioModule,
    ApoderadoModule,
    Estudiante
  ],
  controllers: [InscripcionMatriculaController],
  providers: [InscripcionMatriculaService],
  exports: [TypeOrmModule],
})
export class InscripcionMatriculaModule {}
