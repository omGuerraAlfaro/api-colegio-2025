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

    // Método DELETE: elimina la anotación para un estudiante específico
    async deleteAnotacionForStudent(estudianteId: number, anotacionId: number): Promise<void> {
        // Buscar la relación entre estudiante y anotación
        const anotacionEstudiante = await this.anotacionEstudianteRepository.findOne({
            where: { estudiante_id: estudianteId, anotacion: { id: anotacionId } },
            relations: ['anotacion']
        });
        if (!anotacionEstudiante) {
            throw new NotFoundException('La anotación no fue encontrada para este estudiante');
        }
        // Eliminar la relación
        await this.anotacionEstudianteRepository.remove(anotacionEstudiante);

        // Opcional: Si la anotación no está asociada a ningún otro estudiante, se elimina de la tabla de anotaciones
        const relacionesRestantes = await this.anotacionEstudianteRepository.find({
            where: { anotacion: { id: anotacionId } }
        });
        if (relacionesRestantes.length === 0) {
            await this.anotacionRepository.delete(anotacionId);
        }
    }

    // Método PUT: actualiza una anotación existente
    async updateAnotacion(
        anotacionId: number,
        anotacionData: Partial<Anotacion>,
        asignaturaId?: number | null
    ): Promise<Anotacion> {
        // Buscar la anotación existente
        let anotacion = await this.anotacionRepository.findOne({
            where: { id: anotacionId },
            relations: ['asignatura']
        });
        if (!anotacion) {
            throw new NotFoundException('Anotación no encontrada');
        }
        // Si se envía asignaturaId, actualizar la relación con la asignatura
        if (asignaturaId !== undefined) {
            if (asignaturaId !== null) {
                const asignatura = await this.asignaturaRepository.findOne({ where: { id: asignaturaId } });
                if (!asignatura) {
                    throw new NotFoundException('Asignatura not found');
                }
                anotacion.asignatura = asignatura;
            } else {
                // Permitir asignar null para remover la asignatura relacionada
                anotacion.asignatura = null;
            }
        }
        // Actualizar los demás campos de la anotación
        anotacion = { ...anotacion, ...anotacionData };

        return await this.anotacionRepository.save(anotacion);
    }
}
