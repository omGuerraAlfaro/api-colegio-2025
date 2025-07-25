import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CalendarioEscolar } from 'src/models/CalendarioEscolar.entity';

@Injectable()
export class CalendarioEscolarService {
    constructor(
        @InjectRepository(CalendarioEscolar)
        private readonly calendarioRepository: Repository<CalendarioEscolar>,
    ) { }

    async getAll(): Promise<CalendarioEscolar[]> {
        return await this.calendarioRepository.find({ where: { curso: IsNull() }, order: { fecha: 'ASC' } });
    }

    async getById(id: number): Promise<CalendarioEscolar> {
        return await this.calendarioRepository.findOneOrFail({ where: { id_dia: id } });
    }

    async create(calendario: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        const newCalendario = this.calendarioRepository.create(calendario);
        return await this.calendarioRepository.save(newCalendario);
    }

    async update(id: number, updateData: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        try {
            await this.calendarioRepository.update(id, updateData);
            return await this.calendarioRepository.findOneOrFail({ where: { id_dia: id } });
        } catch (error) {
            console.log('Error en update:', error);
            throw new InternalServerErrorException('No se pudo actualizar el evento');
        }
    }


    async delete(id: number): Promise<void> {
        await this.calendarioRepository.delete(id);
    }

    async getUpcomingDates(daysAhead: number): Promise<CalendarioEscolar[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + daysAhead);

        try {

            const results = await this.calendarioRepository.createQueryBuilder('calendario')
                .leftJoin('calendario.curso', 'curso')
                .where('calendario.fecha BETWEEN :today AND :futureDate', { today, futureDate })
                .andWhere('curso.id IS NULL')
                .orderBy('calendario.fecha', 'ASC')
                .getMany();

            return results;

        } catch (error) {
            console.error(`[getUpcomingDates] Error al obtener fechas:`, error);
            throw error;
        }
    }

    async getDatesForCourseAndSubject(courseId: number, subjectId: number): Promise<CalendarioEscolar[]> {
        try {

            const results = await this.calendarioRepository.createQueryBuilder('calendario')
                .leftJoin('calendario.curso', 'curso')
                .leftJoin('calendario.asignatura', 'asignatura')
                .where('asignatura.id = :subjectId', { subjectId })
                .andWhere('curso.id = :courseId', { courseId })
                .orderBy('calendario.fecha', 'ASC')
                .getMany();
            return results;

        } catch (error) {
            console.error(`[getUpcomingDatesForCourse] Error para curso ${courseId}:`, error);
            throw error;
        }
    }

    async getUpcomingDatesForCourse(courseId: number, daysAhead: number): Promise<CalendarioEscolar[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + daysAhead);

        try {

            const results = await this.calendarioRepository.createQueryBuilder('calendario')
                .leftJoin('calendario.curso', 'curso')
                .where('calendario.fecha BETWEEN :today AND :futureDate', { today, futureDate })
                .andWhere('curso.id = :courseId', { courseId })
                .orderBy('calendario.fecha', 'ASC')
                .getMany();
            return results;

        } catch (error) {
            console.error(`[getUpcomingDatesForCourse] Error para curso ${courseId}:`, error);
            throw error;
        }
    }

}
