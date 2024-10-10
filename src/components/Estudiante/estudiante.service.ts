import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from 'src/models/Curso.entity';
import { Estudiante } from 'src/models/Estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) { }

 
  async findAll() {
    return await this.estudianteRepository.find({ relations: ["infoPae"] });
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
  

}

