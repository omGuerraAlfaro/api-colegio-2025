import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/models/Curso.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { Nota } from 'src/models/Notas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>,
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) { }

  async getNotasPorEstudianteAsignaturaSemestre(
    estudianteId: number,
    asignaturaId: number,
    semestreId: number
  ): Promise<any[]> {
    const notas = await this.notaRepository
      .createQueryBuilder('nota')
      .innerJoinAndSelect('nota.evaluacion', 'evaluacion')
      .innerJoin('nota.estudiante', 'estudiante')
      .innerJoin('nota.asignatura', 'asignatura')
      .innerJoin('nota.semestre', 'semestre')
      .where('estudiante.id = :estudianteId', { estudianteId })
      .andWhere('asignatura.id = :asignaturaId', { asignaturaId })
      .andWhere('semestre.id_semestre = :semestreId', { semestreId })
      .select([
        'nota.id_nota AS notaId',
        'evaluacion.tipo_evaluacion AS tipoEvaluacion',
        'evaluacion.nombre_evaluacion AS nombreEvaluacion',
        'nota.nota AS nota',
        'nota.fecha AS fecha',
      ])
      .orderBy('nota.fecha', 'ASC')
      .getRawMany();

    return notas;
  }

  async getPromedioPorEstudianteAsignaturaSemestre(
    estudianteId: number,
    asignaturaId: number,
    semestreId: number
  ): Promise<number> {
    const promedio = await this.notaRepository
      .createQueryBuilder('nota')
      .innerJoin('nota.estudiante', 'estudiante')
      .innerJoin('nota.asignatura', 'asignatura')
      .innerJoin('nota.semestre', 'semestre')
      .where('estudiante.id = :estudianteId', { estudianteId })
      .andWhere('asignatura.id = :asignaturaId', { asignaturaId })
      .andWhere('semestre.id_semestre = :semestreId', { semestreId })
      .select('AVG(nota.nota)', 'promedio')
      .getRawOne();

    return parseFloat(promedio.promedio || 0);
  }

  async createNotas(data: {
    estudianteId: number;
    evaluacionId: number;
    nota: number;
    fecha: Date;
  }[]): Promise<Nota[]> {
    const nuevasNotas = data.map(nota => this.notaRepository.create({
      estudiante: { id: nota.estudianteId },
      evaluacion: { id_evaluacion: nota.evaluacionId },
      nota: nota.nota,
      fecha: nota.fecha,
    }));

    return await this.notaRepository.save(nuevasNotas); // Inserción en lote
  }



  async updateNota(
    notaId: number,
    data: { nota: number; evaluacionId?: number; fecha?: Date }
  ): Promise<Nota> {
    const nota = await this.notaRepository.findOne({ where: { id_nota: notaId } });

    if (!nota) {
      throw new Error(`Nota con ID ${notaId} no encontrada.`);
    }

    if (data.nota !== undefined) {
      nota.nota = data.nota;
    }
    if (data.evaluacionId !== undefined) {
      nota.evaluacion = { id_evaluacion: data.evaluacionId } as Evaluacion;
    }
    if (data.fecha !== undefined) {
      nota.fecha = data.fecha;
    }

    return await this.notaRepository.save(nota);
  }

  async getNotasResumenPorEstudianteSemestre(estudianteId: number, semestreId: number): Promise<any[]> {
    const resumen = await this.notaRepository
      .createQueryBuilder('nota')
      .innerJoin('nota.estudiante', 'estudiante')
      .innerJoin('nota.semestre', 'semestre')
      .innerJoinAndSelect('nota.asignatura', 'asignatura')
      .where('estudiante.id = :estudianteId', { estudianteId })
      .andWhere('semestre.id_semestre = :semestreId', { semestreId })
      .select([
        'asignatura.id AS asignaturaId',
        'asignatura.nombre_asignatura AS asignaturaNombre',
        'AVG(nota.nota) AS promedio',
      ])
      .groupBy('asignatura.id')
      .orderBy('asignatura.nombre_asignatura', 'ASC')
      .getRawMany();

    return resumen.map((r) => ({
      asignaturaId: r.asignaturaId,
      asignaturaNombre: r.asignaturaNombre,
      promedio: parseFloat(r.promedio),
    }));
  }

  async getNotasPorEvaluacion(evaluacionId: number): Promise<any[]> {
    const notas = await this.notaRepository
      .createQueryBuilder('nota')
      .innerJoin('nota.evaluacion', 'evaluacion')
      .innerJoinAndSelect('nota.estudiante', 'estudiante')
      .where('evaluacion.id_evaluacion = :evaluacionId', { evaluacionId })
      .select([
        'nota.id_nota AS notaId',
        'estudiante.id AS estudianteId',
        `CONCAT(estudiante.primer_nombre, ' ', estudiante.primer_apellido) AS nombreEstudiante`,
        'nota.nota AS nota',
      ])
      .orderBy('estudiante.primer_apellido', 'ASC')
      .getRawMany();

    return notas;
  }

  //VERIFICADO
  async getNotasPorCursoAsignatura(
    cursoId: number,
    asignaturaId: number,
    semestreId: number,
  ): Promise<any[]> {
    try {
      const rawData = await this.cursoRepository
        .createQueryBuilder('curso')
        .leftJoin('curso.cursoConnection', 'cursoEstudiante')
        .leftJoin('cursoEstudiante.estudiante', 'estudiante')
        .leftJoin(
          subQuery => {
            return subQuery
              .select('evaluacion.id_evaluacion', 'idEvaluacion')
              .addSelect('evaluacion.nombre_evaluacion', 'nombre_evaluacion')
              .addSelect('evaluacion.id_tipo_evaluacion', 'id_tipo_evaluacion')
              .from('evaluaciones', 'evaluacion')
              .where('evaluacion.id_asignatura = :asignaturaId', { asignaturaId })
              .andWhere('evaluacion.id_semestre = :semestreId', { semestreId })
              .andWhere('evaluacion.id_curso = :cursoId', { cursoId });
          },
          'evaluacion',
          '1=1'
        )
        .leftJoin(
          'notas',
          'nota',
          'nota.id_estudiante = estudiante.id AND nota.id_evaluacion = evaluacion.idEvaluacion'
        )
        .leftJoin(
          'tipo_evaluacion',
          'tipoEvaluacion',
          'tipoEvaluacion.id_evaluacion = evaluacion.id_tipo_evaluacion'
        )
        .where('curso.id = :cursoId', { cursoId })
        .select([
          'estudiante.id AS estudianteId',
          "CONCAT(estudiante.primer_nombre_alumno, ' ', estudiante.primer_apellido_alumno, ' ', estudiante.segundo_apellido_alumno) AS estudiante",
          'estudiante.primer_apellido_alumno AS primerApellido',
          'evaluacion.idEvaluacion AS idEvaluacion', // Agregado ID de evaluación
          'evaluacion.nombre_evaluacion AS nombreEvaluacion',
          'nota.nota AS nota',
          'nota.fecha AS fecha',
          'tipoEvaluacion.id_evaluacion AS tipoEvaluacionId',
          'tipoEvaluacion.tipo_evaluacion AS tipoEvaluacionDescripcion'
        ])
        .orderBy('estudiante.primer_apellido_alumno', 'ASC')
        .addOrderBy('evaluacion.nombre_evaluacion', 'ASC')
        .getRawMany();

      if (!rawData || rawData.length === 0) {
        return [];
      }

      const hayEvaluacionesReales = rawData.some(row => row.nombreEvaluacion != null);
      if (!hayEvaluacionesReales) {
        return [];
      }

      const estudiantesMap: { [key: number]: any } = {};

      rawData.forEach((row) => {
        if (!estudiantesMap[row.estudianteId]) {
          estudiantesMap[row.estudianteId] = {
            id_estudiante: row.estudianteId,
            estudiante: row.estudiante,
            evaluaciones: []
          };
        }

        if (row.nombreEvaluacion) {
          estudiantesMap[row.estudianteId].evaluaciones.push({
            id_evaluacion: row.idEvaluacion, // Ahora tenemos el ID de la evaluación
            nombre_evaluacion: row.nombreEvaluacion,
            nota: row.nota,
            fecha: row.fecha,
            tipoEvaluacion: {
              id: row.tipoEvaluacionId,
              tipo_evaluacion: row.tipoEvaluacionDescripcion,
            }
          });
        }
      });

      let resultado = Object.values(estudiantesMap);

      resultado = resultado.filter((alumno: any) => alumno.evaluaciones.length > 0);

      if (resultado.length === 0) {
        return [];
      }

      return resultado;
    } catch (error) {
      console.error('Error en getNotasPorCursoAsignatura:', error);
      throw error;
    }
  }





}
