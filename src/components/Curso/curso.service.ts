import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/models/Curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CursoService {

  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>
  ) { }

  async findOne(id: number) {
    return await this.cursoRepository.findOne({ where: { id: id } });
  }

  async findAll(){
    return await this.cursoRepository.find()
  }

  async findAllWithTeacher(): Promise<Curso[]> {
    return this.cursoRepository.find({ relations: ['profesorConnection'] });
  }

  async findOneWithCurse(id: number): Promise<Curso> {
    return this.cursoRepository.findOne({ relations: ['profesorConnection'], where: { id: id } });
  }


  async findStudentsWithCursoId(cursoId: number) {
    const result = await this.cursoRepository
      .createQueryBuilder("curso")
      .leftJoinAndSelect("curso.cursoConnection", "cursoEstudiante")
      .leftJoinAndSelect("cursoEstudiante.estudiante", "estudiante")
      .where("curso.id = :cursoId", { cursoId })
      .getOne();

    if (result) {
      const { cursoConnection, ...cursoData } = result;
      return {
        ...cursoData,
        estudiantes: cursoConnection.map(conn => conn.estudiante)
      };
    }
    return null;
  }

  async findCursoWithApoderadoAndEstudiante(cursoId: number) {
    const result = await this.cursoRepository
      .createQueryBuilder("curso")
      .leftJoinAndSelect("curso.cursoConnection", "cursoEstudiante")
      .leftJoinAndSelect("cursoEstudiante.estudiante", "estudiante")
      .leftJoinAndSelect("estudiante.apoderadosConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.apoderado", "apoderado")
      .where("curso.id = :cursoId", { cursoId })
      .getOne();

    if (result) {
      const { cursoConnection, ...cursoData } = result;

      const apoderadosMap = new Map();
      cursoConnection.forEach(conn => {
        conn.estudiante.apoderadosConnection.forEach(ae => {
          if (!apoderadosMap.has(ae.apoderado.id)) {
            apoderadosMap.set(ae.apoderado.id, {
              ...ae.apoderado,
              estudiantes: []
            });
          }
          apoderadosMap.get(ae.apoderado.id).estudiantes.push({
            ...conn.estudiante,
            apoderadosConnection: undefined
          });
        });
      });

      return {
        ...cursoData,
        apoderadoWithEstudiantes: Array.from(apoderadosMap.values())
      };
    }
    return null;
  }

  async findAllCursosWithApoderadosAndEstudiantes() {
    const cursos = await this.cursoRepository
      .createQueryBuilder("curso")
      .leftJoinAndSelect("curso.cursoConnection", "cursoEstudiante")
      .leftJoinAndSelect("cursoEstudiante.estudiante", "estudiante")
      .leftJoinAndSelect("estudiante.apoderadosConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.apoderado", "apoderado")
      .getMany();
  
    return cursos.map(curso => {
      const { cursoConnection, ...cursoData } = curso;
      const apoderadosMap = new Map();
  
      cursoConnection.forEach(conn => {
        conn.estudiante.apoderadosConnection.forEach(ae => {
          if (!apoderadosMap.has(ae.apoderado.id)) {
            apoderadosMap.set(ae.apoderado.id, {
              ...ae.apoderado,
              estudiantes: []
            });
          }
          const estudianteWithoutApoderados = { ...conn.estudiante, apoderadosConnection: undefined };
          if (!apoderadosMap.get(ae.apoderado.id).estudiantes.some(e => e.id === estudianteWithoutApoderados.id)) {
            apoderadosMap.get(ae.apoderado.id).estudiantes.push(estudianteWithoutApoderados);
          }
        });
      });
  
      return {
        ...cursoData,
        apoderadoWithEstudiantes: Array.from(apoderadosMap.values())
      };
    });
  }
  
  async findAllCursosWithEstudiantes() {
    const cursos = await this.cursoRepository
      .createQueryBuilder("curso")
      .leftJoinAndSelect("curso.cursoConnection", "cursoEstudiante")
      .leftJoinAndSelect("cursoEstudiante.estudiante", "estudiante")
      .getMany();
  
    return cursos.map(curso => {
      const { cursoConnection, ...cursoData } = curso;
  
      const estudiantes = cursoConnection.map(conn => ({
        ...conn.estudiante
      }));
  
      return {
        ...cursoData,
        estudiantes
      };
    });
  }
  
  



}




