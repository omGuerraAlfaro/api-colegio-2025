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
        return await this.asistenciaRepository
            .createQueryBuilder('asistencia')
            .innerJoinAndSelect('asistencia.estudiante', 'estudiante')
            .innerJoinAndSelect('asistencia.curso', 'curso')
            .innerJoinAndSelect('asistencia.semestre', 'semestre')
            .innerJoinAndSelect('asistencia.calendario', 'calendario')
            .where('curso.id_curso = :cursoId', { cursoId })
            .andWhere('semestre.id_semestre = :semestreId', { semestreId })
            .select([
                'curso.id_curso',
                'semestre.id_semestre',
                'estudiante.id_estudiante',
                'estudiante.nombre',
                'calendario.fecha',
                'asistencia.estado',
            ])
            .orderBy('calendario.fecha', 'ASC')
            .getRawMany();
    }
    
}
