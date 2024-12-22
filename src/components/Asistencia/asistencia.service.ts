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
            return await this.asistenciaRepository
                .createQueryBuilder('asistencia')
                .innerJoinAndSelect('asistencia.estudiante', 'estudiante')
                .innerJoinAndSelect('asistencia.curso', 'curso')
                .innerJoinAndSelect('asistencia.semestre', 'semestre')
                .innerJoinAndSelect('asistencia.calendario', 'calendario')
                .where('curso.id = :cursoId', { cursoId })
                .andWhere('semestre.id_semestre = :semestreId', { semestreId })
                .select([
                    'curso.id',
                    'semestre.id_semestre',
                    'estudiante.id',
                    'estudiante.primer_nombre_alumno',
                    'calendario.fecha',
                    'asistencia.estado',
                ])
                .orderBy('calendario.fecha', 'ASC')
                .getRawMany();
        } catch (error) {
            console.error('Error fetching asistencia data:', error);
    
            // Throw a custom error or handle it as needed
            throw new Error('Unable to fetch asistencia data. Please check the input parameters and try again.');
        }
    }
    
    
}
