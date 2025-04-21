import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from 'src/models/Curso.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { UpdateEstudianteDto } from 'src/dto/estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) { }


  async findAll() {
    const estudiantes = await this.estudianteRepository
      .createQueryBuilder("estudiante")
      .leftJoinAndSelect("estudiante.cursoConnection", "cursoConnection")
      .leftJoinAndSelect("cursoConnection.curso", "curso")
      // Agregas el orden aquí:
      .orderBy("estudiante.primer_apellido_alumno", "ASC")
      .getMany();

    // Mapeas el resultado para incluir solo el curso y toda la data del estudiante
    return estudiantes.map(estudiante => ({
      id: estudiante.id,
      primer_nombre_alumno: estudiante.primer_nombre_alumno,
      segundo_nombre_alumno: estudiante.segundo_nombre_alumno,
      primer_apellido_alumno: estudiante.primer_apellido_alumno,
      segundo_apellido_alumno: estudiante.segundo_apellido_alumno,
      fecha_nacimiento_alumno: estudiante.fecha_nacimiento_alumno,
      fecha_matricula: estudiante.fecha_matricula,
      rut: estudiante.rut + '-' + estudiante.dv,
      genero_alumno: estudiante.genero_alumno,
      alergia_alimento_alumno: estudiante.alergia_alimento_alumno,
      alergia_medicamento_alumno: estudiante.alergia_medicamento_alumno,
      vive_con: estudiante.vive_con,
      enfermedad_cronica_alumno: estudiante.enfermedad_cronica_alumno,
      prevision_alumno: estudiante.prevision_alumno,
      nacionalidad: estudiante.nacionalidad,
      es_pae: estudiante.es_pae,
      consultorio_clinica_alumno: estudiante.consultorio_clinica_alumno,
      autorizacion_fotografias: estudiante.autorizacion_fotografias,
      apto_educacion_fisica: estudiante.apto_educacion_fisica,
      observaciones_alumno: estudiante.observaciones_alumno,
      estado_estudiante: estudiante.estado_estudiante,
      curso: estudiante.cursoConnection.map(cc => cc.curso),
    }));
  }

  async findByRut(rut: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { rut: rut },
      relations: ['cursoConnection', 'cursoConnection.curso', 'cursoConnection.curso.profesorConnection'],
    });
  
    if (estudiante) {
      const { cursoConnection, ...rest } = estudiante;
  
      const cursosConProfesor = cursoConnection.map(conn => {
        return {
          ...conn.curso,
          profesor: conn.curso.profesorConnection,
          profesorConnection: undefined,
        };
      });
  
      return {
        ...rest,
        curso: cursosConProfesor,
      };
    }
  
    return null;
  }
  

  async getCountByGender(): Promise<{ masculinoCount: number; femeninoCount: number; out: number; masculinoCountOut: number; femeninoCountOut: number }> {
    const maleCount = await this.estudianteRepository.count({
      where: {
        genero_alumno: 'M',
        estado_estudiante: true
      }
    });
    const femaleCount = await this.estudianteRepository.count({
      where: {
        genero_alumno: 'F',
        estado_estudiante: true
      }
    });

    const out = await this.estudianteRepository.count({
      where: {
        estado_estudiante: false
      }
    });
    const maleCountOut = await this.estudianteRepository.count({
      where: {
        genero_alumno: 'M',
        estado_estudiante: false
      }
    });
    const femaleCountOut = await this.estudianteRepository.count({
      where: {
        genero_alumno: 'F',
        estado_estudiante: false
      }
    });

    return { masculinoCount: maleCount, femeninoCount: femaleCount, out: out, masculinoCountOut: maleCountOut, femeninoCountOut: femaleCountOut };
  }


  async updateEstudiante(id: number, updateData: UpdateEstudianteDto): Promise<Estudiante | null> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id } });

    if (!estudiante) {
      return null; // Estudiante no encontrado
    }

    // Actualizar los campos del estudiante con los datos proporcionados
    Object.assign(estudiante, updateData);

    // Guardar los cambios
    return await this.estudianteRepository.save(estudiante);
  }

  async findByRutWithApoderados(rut: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { rut },
      relations: [
        'apoderadosConnection',
        'apoderadosConnection.apoderado',
        'apoderadosSuplenteConnection',
        'apoderadosSuplenteConnection.apoderado'
      ],
    });

    if (estudiante) {
      const { apoderadosConnection, apoderadosSuplenteConnection, ...rest } = estudiante;
      return {
        ...rest,
        // Extraemos el detalle completo de cada apoderado
        apoderados: apoderadosConnection.map(conn => conn.apoderado),
        apoderadosSuplentes: apoderadosSuplenteConnection.map(conn => conn.apoderado),
      };
    }
    return null;
  }



}

