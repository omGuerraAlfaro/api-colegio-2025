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
    const estudiantes = await this.estudianteRepository.createQueryBuilder("estudiante")
      .leftJoinAndSelect("estudiante.cursoConnection", "cursoConnection")
      .leftJoinAndSelect("cursoConnection.curso", "curso")
      .getMany();

    // Mapear el resultado para incluir solo el curso y toda la data del estudiante
    return estudiantes.map(estudiante => ({
      id: estudiante.id,
      primer_nombre_alumno: estudiante.primer_nombre_alumno,
      segundo_nombre_alumno: estudiante.segundo_nombre_alumno,
      primer_apellido_alumno: estudiante.primer_apellido_alumno,
      segundo_apellido_alumno: estudiante.segundo_apellido_alumno,
      fecha_nacimiento_alumno: estudiante.fecha_nacimiento_alumno,
      fecha_matricula: estudiante.fecha_matricula,
      rut: estudiante.rut+'-'+estudiante.dv,
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
      curso: estudiante.cursoConnection.map(cc => cc.curso)
    }));
  }


  async findByRut(rut: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { rut: rut },
      relations: ['cursoConnection', 'cursoConnection.curso'],
    });

    if (estudiante) {
      // Rename cursoConnection to curso
      const { cursoConnection, ...rest } = estudiante;
      return {
        ...rest,
        curso: cursoConnection.map(conn => conn.curso),
      };
    }
    return null;
  }

  async getCountByGender(): Promise<{ masculinoCount: number; femeninoCount: number }> {
    const maleCount = await this.estudianteRepository.count({ where: { genero_alumno: 'M' } });
    const femaleCount = await this.estudianteRepository.count({ where: { genero_alumno: 'F' } });

    return { masculinoCount: maleCount, femeninoCount: femaleCount };
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


}

