import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Asistencia } from 'src/models/Asistencia.entity';
import { CalendarioAsistencia } from 'src/models/CalendarioAsistencia';
import { Repository } from 'typeorm';

@Injectable()
export class AsistenciaService {
    constructor(
        @InjectRepository(Asistencia)
        private readonly asistenciaRepository: Repository<Asistencia>,
        @InjectRepository(CalendarioAsistencia)
        private readonly calendarioAsistenciaRepository: Repository<CalendarioAsistencia>,
    ) { }

    async getAllFechasCalendarioAsistencia(): Promise<CalendarioAsistencia[]> {
        const fechas = await this.calendarioAsistenciaRepository.find();
        return fechas;
    }

    async getAsistenciaByCursoAndSemestre(cursoId: number, semestreId: number): Promise<any[]> {
        try {
            const resultados = await this.asistenciaRepository
                .createQueryBuilder('asistencia')
                .innerJoinAndSelect('asistencia.estudiante', 'estudiante')
                .innerJoinAndSelect('asistencia.curso', 'curso')
                .innerJoinAndSelect('asistencia.semestre', 'semestre')
                .innerJoinAndSelect('asistencia.calendario', 'calendario')
                .where('curso.id = :cursoId', { cursoId })
                .andWhere('semestre.id_semestre = :semestreId', { semestreId })
                .andWhere('estudiante.estado_estudiante = :estado', { estado: true })
                .select([
                    'estudiante.id AS estudianteId',
                    `CONCAT(estudiante.primer_nombre_alumno, ' ', estudiante.primer_apellido_alumno, ' ', estudiante.segundo_apellido_alumno) AS nombreCompleto`,
                    'JSON_ARRAYAGG(JSON_OBJECT("fecha", calendario.fecha, "estado", asistencia.estado)) AS asistencias',
                ])
                .groupBy('estudiante.id')
                .orderBy('estudiante.primer_nombre_alumno', 'ASC')
                .getRawMany();
    
            // Convertir asistencias (string) a objetos JSON
            return resultados.map((resultado) => ({
                estudianteId: resultado.estudianteId,
                nombreCompleto: resultado.nombreCompleto,
                asistencias: JSON.parse(resultado.asistencias), // Convertimos a objeto JSON
            }));
        } catch (error) {
            console.error('Error fetching asistencia data:', error);
            throw new Error('Unable to fetch asistencia data. Please check the input parameters and try again.');
        }
    }
    
    
}
