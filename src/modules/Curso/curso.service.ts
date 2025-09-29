import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/models/Curso.entity';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { CierreSemestreService } from '../CierreSemestre/cierreSemestre.service';
import { Semestre } from 'src/models/Semestre.entity';

@Injectable()
export class CursoService {

  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Semestre)
    private readonly semestreRepository: Repository<Semestre>,

  ) { }

  async findOne(id: number) {
    return await this.cursoRepository.findOne({ where: { id: id } });
  }

  async findAll() {
    return await this.cursoRepository.find()
  }

  async findAllCursosPreBasica() {
    return await this.cursoRepository.find({
      where: { id: LessThanOrEqual(2) },
    });
  }

  async findAllCursosBasica() {
    return await this.cursoRepository.find({
      where: { id: MoreThan(2) },
    });
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
      .where('estudiante.estado_estudiante = :estado', { estado: true })
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

  async findCursoByRutEstudiante(rut: string) {
    const curso = await this.cursoRepository
      .createQueryBuilder("curso")
      .leftJoin("curso.cursoConnection", "cursoEstudiante")
      .leftJoin("cursoEstudiante.estudiante", "estudiante")
      .where("estudiante.rut = :rut", { rut })
      .getOne();

    if (!curso) {
      throw new Error(`No course found for student with RUT: ${rut}`);
    }

    return curso;
  }

  async findCursoIdByEstudianteId(estudianteId: number): Promise<number | null> {
    const result = await this.cursoRepository
      .createQueryBuilder('curso')
      .leftJoin('curso.cursoConnection', 'cursoEstudiante')
      .leftJoin('cursoEstudiante.estudiante', 'estudiante')
      .where('estudiante.id = :estudianteId', { estudianteId })
      .select('curso.id', 'id') // solo selecciona el ID del curso
      .getRawOne();

    return result?.id ?? null;
  }

  async cerrarObservacionCurso(cursoId: number): Promise<void> {
    await this.cursoRepository.update(cursoId, { observacionCerrada: true });

    // Verificar si ya no queda ningún curso con observación abierta
    const cursosAbiertos = await this.cursoRepository.count({
      where: { observacionCerrada: false },
    });

    if (cursosAbiertos === 0) {
      this.semestreRepository.update({ id_semestre: 3 }, { semestreCerrado: true });
    }
  }



}




