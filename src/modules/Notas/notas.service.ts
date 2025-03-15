import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CierreSemestreDto } from 'src/dto/evaluacion.dto';
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
    nota: number | null;
    fecha: Date;
  }[]): Promise<void> {
    for (const notaData of data) {
      if (notaData.nota === null) {
        // Eliminar la nota si es null
        await this.notaRepository.delete({
          estudiante: { id: notaData.estudianteId },
          evaluacion: { id_evaluacion: notaData.evaluacionId },
        });
      } else {
        let notaExistente = await this.notaRepository.findOne({
          where: {
            estudiante: { id: notaData.estudianteId },
            evaluacion: { id_evaluacion: notaData.evaluacionId },
          },
        });

        if (notaExistente) {
          notaExistente.nota = notaData.nota;
          notaExistente.fecha = notaData.fecha;
          await this.notaRepository.save(notaExistente);
        } else {
          const nuevaNota = this.notaRepository.create({
            estudiante: { id: notaData.estudianteId },
            evaluacion: { id_evaluacion: notaData.evaluacionId },
            nota: notaData.nota,
            fecha: notaData.fecha,
          });
          await this.notaRepository.save(nuevaNota);
        }
      }
    }
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

  /**
    * Nuevo método para el "Cierre de Semestre".
    * - Crea 3 evaluaciones: tipo 3 (Final Parcial), 4 (Final Tarea) y 5 (Final).
    * - Genera las notas de cada estudiante para dichas evaluaciones.
    */
  async cierreSemestre(dto: CierreSemestreDto): Promise<void> {
    console.log(dto);
    try {
      // 1. Verificar o crear las evaluaciones (tipoEvaluacionId = 3, 4 y 5)
      let finalParcialEval = await this.evaluacionRepository.findOne({
        where: {
          nombre_evaluacion: 'Final Parcial',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 3 },
          curso: { id: dto.cursoId },
        },
      });
      if (!finalParcialEval) {
        finalParcialEval = this.evaluacionRepository.create({
          nombre_evaluacion: 'Final Parcial',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 3 },
          curso: { id: dto.cursoId },
        });
        await this.evaluacionRepository.save(finalParcialEval);
      }

      let finalTareaEval = await this.evaluacionRepository.findOne({
        where: {
          nombre_evaluacion: 'Final Tarea',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 4 },
          curso: { id: dto.cursoId },
        },
      });
      if (!finalTareaEval) {
        finalTareaEval = this.evaluacionRepository.create({
          nombre_evaluacion: 'Final Tarea',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 4 },
          curso: { id: dto.cursoId },
        });
        await this.evaluacionRepository.save(finalTareaEval);
      }

      let finalEval = await this.evaluacionRepository.findOne({
        where: {
          nombre_evaluacion: 'Final',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 5 },
          curso: { id: dto.cursoId },
        },
      });
      if (!finalEval) {
        finalEval = this.evaluacionRepository.create({
          nombre_evaluacion: 'Final',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 5 },
          curso: { id: dto.cursoId },
        });
        await this.evaluacionRepository.save(finalEval);
      }

      // 2. Construir array de notas para cada estudiante
      const hoy = new Date();
      const notasAInsertar: {
        estudianteId: number;
        evaluacionId: number;
        nota: number | null;
        fecha: Date;
      }[] = [];

      for (const est of dto.estudiantes) {
        // Final Parcial
        if (est.notaFinalParcial !== null) {
          notasAInsertar.push({
            estudianteId: est.estudianteId,
            evaluacionId: finalParcialEval.id_evaluacion,
            nota: est.notaFinalParcial,
            fecha: hoy,
          });
        }
        // Final Tarea
        if (est.notaFinalTarea !== null) {
          notasAInsertar.push({
            estudianteId: est.estudianteId,
            evaluacionId: finalTareaEval.id_evaluacion,
            nota: est.notaFinalTarea,
            fecha: hoy,
          });
        }
        // Final
        if (est.notaFinal !== null) {
          notasAInsertar.push({
            estudianteId: est.estudianteId,
            evaluacionId: finalEval.id_evaluacion,
            nota: est.notaFinal,
            fecha: hoy,
          });
        }
      }

      // 3. Guardar (o actualizar) las notas que no son null
      if (notasAInsertar.length > 0) {
        await this.createNotas(notasAInsertar);
      }

      // 4. Eliminar la evaluación si no hay notas (o el usuario la "quitó" por completo)

      // -- Final Parcial --
      if (finalParcialEval) {
        // ¿Alguna nota en notasAInsertar pertenece a esta evaluación?
        const existeNotaParcial = notasAInsertar.some(
          (n) => n.evaluacionId === finalParcialEval.id_evaluacion,
        );

        // Si no hay notas, se elimina evaluación y sus notas (si existieran)
        if (!existeNotaParcial) {
          await this.notaRepository.delete({
            evaluacion: { id_evaluacion: finalParcialEval.id_evaluacion },
          });
          await this.evaluacionRepository.remove(finalParcialEval);
        }
      }

      // -- Final Tarea --
      if (finalTareaEval) {
        const existeNotaTarea = notasAInsertar.some(
          (n) => n.evaluacionId === finalTareaEval.id_evaluacion,
        );
        if (!existeNotaTarea) {
          await this.notaRepository.delete({
            evaluacion: { id_evaluacion: finalTareaEval.id_evaluacion },
          });
          await this.evaluacionRepository.remove(finalTareaEval);
        }
      }

      // -- Final --
      if (finalEval) {
        const existeNotaFinal = notasAInsertar.some(
          (n) => n.evaluacionId === finalEval.id_evaluacion,
        );
        if (!existeNotaFinal) {
          await this.notaRepository.delete({
            evaluacion: { id_evaluacion: finalEval.id_evaluacion },
          });
          await this.evaluacionRepository.remove(finalEval);
        }
      }

    } catch (error) {
      console.error('Error en cierreSemestre:', error);
      throw new InternalServerErrorException('Ocurrió un error al cerrar el semestre.');
    }
  }



}
