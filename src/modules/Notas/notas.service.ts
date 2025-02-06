import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async createNota(data: {
        estudianteId: number;
        cursoId: number;
        asignaturaId: number;
        evaluacionId: number;
        semestreId: number;
        nota: number;
        fecha: Date;
    }): Promise<Nota> {
        const nuevaNota = this.notaRepository.create({
            estudiante: { id: data.estudianteId },
            curso: { id: data.cursoId },
            asignatura: { id: data.asignaturaId },
            evaluacion: { id_evaluacion: data.evaluacionId },
            semestre: { id_semestre: data.semestreId },
            nota: data.nota,
            fecha: data.fecha,
        });

        return await this.notaRepository.save(nuevaNota);
    }

    async updateNota(
        notaId: number,
        data: { nota: number; evaluacionId?: number; fecha?: Date }
    ): Promise<Nota> {
        const nota = await this.notaRepository.findOne({ where: { id_nota: notaId } });

        if (!nota) {
            throw new Error(`Nota with ID ${notaId} not found.`);
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

    async getNotasPorCursoAsignatura(
        cursoId: number,
        asignaturaId: number,
        semestreId: number,
      ): Promise<any[]> {
        try {
          const notas = await this.notaRepository
            .createQueryBuilder('nota')
            .select([
              'estudiante.id AS estudianteId',
              'estudiante.primer_nombre_alumno AS primerNombre',
              'estudiante.primer_apellido_alumno AS primerApellido',
              'GROUP_CONCAT(nota.nota ORDER BY nota.fecha ASC SEPARATOR ", ") AS notas',
            ])
            .innerJoin('nota.estudiante', 'estudiante')
            .innerJoin('nota.curso', 'curso')
            .innerJoin('nota.asignatura', 'asignatura')
            .innerJoin('nota.semestre', 'semestre')
            .where('curso.id = :cursoId', { cursoId })
            .andWhere('asignatura.id = :asignaturaId', { asignaturaId })
            .andWhere('semestre.id_semestre = :semestreId', { semestreId })
            .groupBy('estudiante.id')
            .orderBy('estudiante.primer_apellido_alumno', 'ASC')
            .getRawMany();
      
          return notas;
        } catch (error) {
          console.error('Error en getNotasPorCursoAsignatura:', error);
          throw error;
        }
      }
      


}
