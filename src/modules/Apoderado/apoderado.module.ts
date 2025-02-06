import { Module } from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoController } from './apoderado.controller';
import { Estudiante } from 'src/models/Estudiante.entity';
import { ApoderadoEstudiante } from 'src/models/ApoderadoEstudiante.entity';
import { EstudianteCurso } from 'src/models/CursoEstudiante.entity';
import { ApoderadoSuplente } from 'src/models/ApoderadoSuplente.entity';
import { ApoderadoSuplenteEstudiante } from 'src/models/ApoderadoSuplenteEstudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apoderado,
      ApoderadoSuplente,
      Estudiante,
      ApoderadoEstudiante,
      ApoderadoSuplenteEstudiante,
      EstudianteCurso
    ]),
  ],
  controllers: [ApoderadoController],
  providers: [ApoderadoService],
  exports: [TypeOrmModule, ApoderadoService],
})
export class ApoderadoModule {}
