import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CierreSemestreDto, CierreSemestrePreBasicaDto } from 'src/dto/evaluacion.dto';
import { CreateNotasDto } from 'src/dto/notas.dto';
import { Curso } from 'src/models/Curso.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { EvaluacionPreBasica } from 'src/models/EvaluacionPreBasica.entity';
import { Nota } from 'src/models/Notas.entity';
import { NotaPreBasica } from 'src/models/NotasPreBasica.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>,
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(NotaPreBasica)
    private readonly notaPreBasicaRepository: Repository<NotaPreBasica>,
    @InjectRepository(EvaluacionPreBasica)
    private readonly evaluacionPreBasicaRepository: Repository<EvaluacionPreBasica>,
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

  async createNotas(dto: CreateNotasDto): Promise<void> {
    // Se extiende el DTO para incluir asignaturaId (y semestreId si se requiere)
    const { cursoId, notas, asignaturaId, semestreId } = dto;
    // Selección del repositorio según el curso (en este ejemplo, pre-básica usa un repositorio distinto)
    const notaRepo = (cursoId === 1 || cursoId === 2
      ? this.notaPreBasicaRepository
      : this.notaRepository) as Repository<any>;

    // Lógica especial para la asignatura 3 (por ejemplo, para inglés en prebasica a 4to básico)
    if (asignaturaId === 3) {
      // Se busca la evaluación de "Nota Inglés" (se asume que está asociada a asignatura 4, de lenguaje)
      const englishEvaluacion = await this.evaluacionRepository.findOne({
        where: {
          nombre_evaluacion: 'Nota Inglés',
          asignatura: { id: 4 }, // se usa la asignatura 4 para "Nota Inglés"
          semestre: { id_semestre: semestreId },
          id_tipo_evaluacion: { id_evaluacion: 1 },
          curso: { id: cursoId },
        },
      });

      if (englishEvaluacion) {
        // Para cada nota, se actualiza o crea la nota en la evaluación de "Nota Inglés"
        for (const notaData of notas) {
          // Por ejemplo, si deseas replicar la misma nota en la evaluación de inglés:
          if (notaData.nota === null) {
            await notaRepo.delete({
              estudiante: { id: notaData.estudianteId },
              evaluacion: { id_evaluacion: englishEvaluacion.id_evaluacion },
            });
          } else {
            const notaInglesExistente = await notaRepo.findOne({
              where: {
                estudiante: { id: notaData.estudianteId },
                evaluacion: { id_evaluacion: englishEvaluacion.id_evaluacion },
              },
            });

            if (notaInglesExistente) {
              notaInglesExistente.nota = notaData.nota;
              notaInglesExistente.fecha = notaData.fecha;
              await notaRepo.save(notaInglesExistente);
            } else {
              const nuevaNotaIngles = notaRepo.create({
                estudiante: { id: notaData.estudianteId },
                evaluacion: { id_evaluacion: englishEvaluacion.id_evaluacion },
                nota: notaData.nota,
                fecha: notaData.fecha,
              });
              await notaRepo.save(nuevaNotaIngles);
            }
          }
        }
      }
    }

    // Lógica general para crear o actualizar las notas (ya sea para asignatura 3 o para otras)
    try {
      for (const notaData of notas) {
        if (notaData.nota === null) {
          // Eliminar la nota si es null
          await notaRepo.delete({
            estudiante: { id: notaData.estudianteId },
            evaluacion: { id_evaluacion: notaData.evaluacionId },
          });
        } else {
          // Buscar si ya existe la nota
          const notaExistente = await notaRepo.findOne({
            where: {
              estudiante: { id: notaData.estudianteId },
              evaluacion: { id_evaluacion: notaData.evaluacionId },
            },
          });

          if (notaExistente) {
            // Actualizar la nota existente
            notaExistente.nota = notaData.nota;
            notaExistente.fecha = notaData.fecha;
            await notaRepo.save(notaExistente);
          } else {
            // Crear una nueva nota
            const nuevaNota = notaRepo.create({
              estudiante: { id: notaData.estudianteId },
              evaluacion: { id_evaluacion: notaData.evaluacionId },
              nota: notaData.nota,
              fecha: notaData.fecha,
            });
            await notaRepo.save(nuevaNota);
          }
        }
      }
    } catch (error) {
      console.error('Error al crear o actualizar notas:', error);
      throw new Error('Ocurrió un error al procesar las notas');
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

  //Endpoint para app movil
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
  //Endpoint para app movil
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
      const evaluacionesTable = (cursoId === 1 || cursoId === 2) ? 'evaluaciones_prebasica' : 'evaluaciones';
      const notasTable = (cursoId === 1 || cursoId === 2) ? 'notas_prebasica' : 'notas';
      const tipoEvaluacionTable = (cursoId === 1 || cursoId === 2) ? 'tipo_evaluacion_prebasica' : 'tipo_evaluacion';

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
              .from(evaluacionesTable, 'evaluacion')
              .where('evaluacion.id_asignatura = :asignaturaId', { asignaturaId })
              .andWhere('evaluacion.id_semestre = :semestreId', { semestreId })
              .andWhere('evaluacion.id_curso = :cursoId', { cursoId });
          },
          'evaluacion',
          '1=1'
        )
        .leftJoin(
          notasTable,
          'nota',
          'nota.id_estudiante = estudiante.id AND nota.id_evaluacion = evaluacion.idEvaluacion'
        )
        .leftJoin(
          tipoEvaluacionTable,
          'tipoEvaluacion',
          'tipoEvaluacion.id_evaluacion = evaluacion.id_tipo_evaluacion'
        )
        .where('curso.id = :cursoId', { cursoId })
        .andWhere('estudiante.estado_estudiante = :estado', { estado: true })
        .select([
          'estudiante.id AS estudianteId',
          "CONCAT(estudiante.primer_nombre_alumno, ' ', estudiante.primer_apellido_alumno, ' ', estudiante.segundo_apellido_alumno) AS estudiante",
          'estudiante.primer_apellido_alumno AS primerApellido',
          'evaluacion.idEvaluacion AS idEvaluacion',
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

      // Verificamos si al menos hay evaluaciones con nombre
      const hayEvaluacionesReales = rawData.some(row => row.nombreEvaluacion != null);
      if (!hayEvaluacionesReales) {
        return [];
      }

      // Usamos un Map para agrupar a los estudiantes en O(1)
      const estudiantesMap = new Map<number, any>();

      for (const row of rawData) {
        // Obtenemos o creamos el objeto del estudiante
        let estudianteObj = estudiantesMap.get(row.estudianteId);
        if (!estudianteObj) {
          estudianteObj = {
            id_estudiante: row.estudianteId,
            estudiante: row.estudiante,
            primerApellido: row.primerApellido,
            evaluaciones: []
          };
          estudiantesMap.set(row.estudianteId, estudianteObj);
        }

        // Si la fila tiene una evaluación con nombre, la agregamos
        if (row.nombreEvaluacion) {
          estudianteObj.evaluaciones.push({
            id_evaluacion: row.idEvaluacion,
            nombre_evaluacion: row.nombreEvaluacion,
            nota: row.nota,
            fecha: row.fecha,
            tipoEvaluacion: {
              id: row.tipoEvaluacionId,
              tipo_evaluacion: row.tipoEvaluacionDescripcion,
            }
          });
        }
      }

      // Convertimos el Map a array y filtramos solo los que tengan evaluaciones
      let resultado = Array.from(estudiantesMap.values()).filter(e => e.evaluaciones.length > 0);

      if (resultado.length === 0) {
        return [];
      }

      // Ordenamos por primerApellido para asegurar el orden final
      resultado.sort((a, b) => {
        const apellidoA = (a.primerApellido || '').trim().toLowerCase();
        const apellidoB = (b.primerApellido || '').trim().toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      });

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
  async cierreSemestreBasica(dto: CierreSemestreDto): Promise<void> {
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
          nombre_evaluacion: 'Nota Tareas',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 1 },
          curso: { id: dto.cursoId },
        },
      });
      if (!finalTareaEval) {
        finalTareaEval = this.evaluacionRepository.create({
          nombre_evaluacion: 'Nota Tareas',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 1 },
          curso: { id: dto.cursoId },
        });
        await this.evaluacionRepository.save(finalTareaEval);
      }

      let finalEval;
      if (dto.cursoId <= 6 && dto.asignaturaId === 3) { //solo desde prebasica a 4to basico - asignatura de ingles
        finalEval = await this.evaluacionRepository.findOne({
          where: {
            nombre_evaluacion: 'Nota Inglés',
            asignatura: { id: 4 }, //lenguaje
            semestre: { id_semestre: dto.semestreId },
            id_tipo_evaluacion: { id_evaluacion: 1 },
            curso: { id: dto.cursoId },
          },
        });
        if (!finalEval) {
          finalEval = this.evaluacionRepository.create({
            nombre_evaluacion: 'Nota Inglés',
            asignatura: { id: 4 }, //lenguaje
            semestre: { id_semestre: dto.semestreId },
            id_tipo_evaluacion: { id_evaluacion: 1 },
            curso: { id: dto.cursoId },
          });
          await this.evaluacionRepository.save(finalEval);
        }

        finalEval = await this.evaluacionRepository.findOne({
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
      } else {
        finalEval = await this.evaluacionRepository.findOne({
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

      const createNotasDto = {
        cursoId: dto.cursoId,
        asignaturaId: dto.asignaturaId,
        semestreId: dto.semestreId,
        notas: notasAInsertar,
      };

      // 3. Guardar (o actualizar) las notas que no son null
      if (notasAInsertar.length > 0) {
        await this.createNotas(createNotasDto);
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

  async cierreSemestrePreBasica(dto: CierreSemestrePreBasicaDto): Promise<void> {
    console.log(dto);
    try {
      // 1. Verificar o crear las evaluaciones (tipoEvaluacionId = 3, 4 y 5)
      let finalConceptoEval = await this.evaluacionPreBasicaRepository.findOne({
        where: {
          nombre_evaluacion: 'Concepto Final',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 6 },
          curso: { id: dto.cursoId },
        },
      });
      if (!finalConceptoEval) {
        finalConceptoEval = this.evaluacionPreBasicaRepository.create({
          nombre_evaluacion: 'Concepto Final',
          asignatura: { id: dto.asignaturaId },
          semestre: { id_semestre: dto.semestreId },
          id_tipo_evaluacion: { id_evaluacion: 6 },
          curso: { id: dto.cursoId },
        });
        await this.evaluacionPreBasicaRepository.save(finalConceptoEval);
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
        if (est.conceptoFinalParcial !== null) {
          notasAInsertar.push({
            estudianteId: est.estudianteId,
            evaluacionId: finalConceptoEval.id_evaluacion,
            nota: est.conceptoFinalParcial,
            fecha: hoy,
          });
        }
      }

      const createNotasDto = {
        cursoId: dto.cursoId,
        asignaturaId: dto.asignaturaId,
        semestreId: dto.semestreId,
        notas: notasAInsertar,
      };

      // 3. Guardar (o actualizar) las notas que no son null
      if (notasAInsertar.length > 0) {
        await this.createNotas(createNotasDto);
      }

      // 4. Eliminar la evaluación si no hay notas (o el usuario la "quitó" por completo)

      // -- Final Parcial --
      if (finalConceptoEval) {
        // ¿Alguna nota en notasAInsertar pertenece a esta evaluación?
        const existeNotaParcial = notasAInsertar.some(
          (n) => n.evaluacionId === finalConceptoEval.id_evaluacion,
        );

        // Si no hay notas, se elimina evaluación y sus notas (si existieran)
        if (!existeNotaParcial) {
          await this.notaRepository.delete({
            evaluacion: { id_evaluacion: finalConceptoEval.id_evaluacion },
          });
          await this.evaluacionPreBasicaRepository.remove(finalConceptoEval);
        }
      }

    } catch (error) {
      console.error('Error en cierreSemestrePreBasica:', error);
      throw new InternalServerErrorException('Ocurrió un error al cerrar el semestre.');
    }
  }


}
