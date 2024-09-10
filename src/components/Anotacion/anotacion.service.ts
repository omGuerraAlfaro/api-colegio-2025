import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';
import { AnotacionesEstudiante } from 'src/models/AnotacionesEstudiantes.entity';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnotacionService {
    constructor(
        @InjectRepository(Anotacion)
        private readonly anotacionRepository: Repository<Anotacion>,
        @InjectRepository(AnotacionesEstudiante)
        private readonly anotacionEstudianteRepository: Repository<AnotacionesEstudiante>,
        @InjectRepository(Asignatura)
        private readonly asignaturaRepository: Repository<Asignatura>,
    ) { }

    async getAnotacionesByEstudianteId(estudianteId: number): Promise<AnotacionDto[]> {
        const anotacionesEstudiantes = await this.anotacionEstudianteRepository.find({
            where: { estudiante_id: estudianteId },
            relations: ['anotacion', 'anotacion.asignatura'],
        });

        return anotacionesEstudiantes.map(ae => ae.anotacion);
    }

    async createAnotacionForStudent(
        estudianteId: number,
        anotacionData: Partial<Anotacion>,
        asignaturaId: number | null
    ): Promise<Anotacion> {
        let asignatura: Asignatura | null = null;

        // Si asignaturaId no es nulo, buscar la asignatura por ID
        if (asignaturaId !== null && asignaturaId !== undefined) {
            asignatura = await this.asignaturaRepository.findOne({ where: { id: asignaturaId } });
            if (!asignatura) {
                throw new NotFoundException('Asignatura not found');
            }
        }

        // Crear la anotación
        const newAnotacion = this.anotacionRepository.create({
            ...anotacionData,
            asignatura: asignatura ?? null, // Asignar null si no hay asignatura
        });

        const savedAnotacion = await this.anotacionRepository.save(newAnotacion);

        // Crear la relación en la tabla intermedia
        const anotacionesEstudiante = this.anotacionEstudianteRepository.create({
            estudiante_id: estudianteId,
            anotacion: savedAnotacion,
        });

        await this.anotacionEstudianteRepository.save(anotacionesEstudiante);

        return savedAnotacion;
    }


}
