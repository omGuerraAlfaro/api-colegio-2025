import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';
import { AnotacionesEstudiante } from 'src/models/AnotacionesEstudiantes.entity';
import { Asignatura } from 'src/models/Asignatura.entity';
import { AsignaturaPreBasica } from 'src/models/AsignaturaPreBasica.entity';
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
        @InjectRepository(AsignaturaPreBasica)
        private readonly asignaturaPreBasicaRepository: Repository<AsignaturaPreBasica>,
    ) { }

    async getAnotacionesByEstudianteId(estudianteId: number): Promise<AnotacionDto[]> {
        const anotacionesEstudiantes = await this.anotacionEstudianteRepository.find({
            where: { estudiante_id: estudianteId },
            relations: [
                'anotacion',
                'anotacion.asignatura',
                'anotacion.asignaturaPreBasica',
            ],
        });

        return anotacionesEstudiantes.map((anotacionEstudiante) => {
            const { anotacion, ...rest } = anotacionEstudiante;
            return {
                ...rest,
                ...anotacion,
                asignatura: anotacion.asignatura ? anotacion.asignatura : null,
                asignaturaPreBasica: anotacion.asignaturaPreBasica ? anotacion.asignaturaPreBasica : null,
            };
        });
    }

    async createAnotacionForStudent(
        estudianteId: number,
        anotacionData: Partial<Anotacion>,
        asignaturaId?: number,
        asignaturaPreBasicaId?: number,
    ): Promise<Anotacion> {
        console.log('asignaturaId', asignaturaId);
        console.log('asignaturaPreBasicaId', asignaturaPreBasicaId);
        
        let asignatura: Asignatura | null = null;
        let asignaturaPreBasica: AsignaturaPreBasica | null = null;

        // Validación: solo uno debe estar presente
        if (asignaturaId && asignaturaPreBasicaId) {
            throw new BadRequestException('Solo puede asignar una asignatura o una asignatura pre básica, no ambas.');
        }

        // Buscar asignatura si se pasó el ID
        if (asignaturaId) {
            asignatura = await this.asignaturaRepository.findOne({ where: { id: asignaturaId } });
            if (!asignatura) {
                throw new NotFoundException('Asignatura no encontrada');
            }
        }

        // Buscar asignatura pre básica si se pasó el ID
        if (asignaturaPreBasicaId) {
            asignaturaPreBasica = await this.asignaturaPreBasicaRepository.findOne({ where: { id: asignaturaPreBasicaId } });
            if (!asignaturaPreBasica) {
                throw new NotFoundException('Asignatura PreBásica no encontrada');
            }
        }

        // Crear la anotación
        const newAnotacion = this.anotacionRepository.create({
            ...anotacionData,
            asignatura: asignatura ?? null,
            asignaturaPreBasica: asignaturaPreBasica ?? null,
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


    async deleteAnotacionForStudent(estudianteId: number, anotacionId: number): Promise<void> {
        const anotacionEstudiante = await this.anotacionEstudianteRepository.findOne({
            where: { estudiante_id: estudianteId, anotacion: { id: anotacionId } },
            relations: ['anotacion'],
        });

        if (!anotacionEstudiante) {
            throw new NotFoundException('La anotación no fue encontrada para este estudiante');
        }

        await this.anotacionEstudianteRepository.remove(anotacionEstudiante);

        const relacionesRestantes = await this.anotacionEstudianteRepository.find({
            where: { anotacion: { id: anotacionId } },
        });

        if (relacionesRestantes.length === 0) {
            await this.anotacionRepository.delete(anotacionId);
        }
    }


    async updateAnotacion(
        anotacionId: number,
        anotacionData: Partial<Anotacion>,
        asignaturaId?: number | null,
        asignaturaPreBasicaId?: number | null
    ): Promise<Anotacion> {
        // Validar que solo se envíe uno
        if (asignaturaId && asignaturaPreBasicaId) {
            throw new BadRequestException('Solo puede actualizar a una asignatura o una asignatura pre básica, no ambas');
        }

        // Buscar la anotación
        let anotacion = await this.anotacionRepository.findOne({
            where: { id: anotacionId },
            relations: ['asignatura', 'asignaturaPreBasica'],
        });

        if (!anotacion) {
            throw new NotFoundException('Anotación no encontrada');
        }

        // Actualizar asignatura si se proporciona
        if (asignaturaId !== undefined) {
            if (asignaturaId !== null) {
                const asignatura = await this.asignaturaRepository.findOne({ where: { id: asignaturaId } });
                if (!asignatura) {
                    throw new NotFoundException('Asignatura no encontrada');
                }
                anotacion.asignatura = asignatura;
                anotacion.asignaturaPreBasica = null;
            } else {
                anotacion.asignatura = null;
            }
        }

        // Actualizar asignatura pre básica si se proporciona
        if (asignaturaPreBasicaId !== undefined) {
            if (asignaturaPreBasicaId !== null) {
                const prebasica = await this.asignaturaPreBasicaRepository.findOne({ where: { id: asignaturaPreBasicaId } });
                if (!prebasica) {
                    throw new NotFoundException('Asignatura PreBásica no encontrada');
                }
                anotacion.asignaturaPreBasica = prebasica;
                anotacion.asignatura = null;
            } else {
                anotacion.asignaturaPreBasica = null;
            }
        }

        // Actualizar otros campos
        anotacion = { ...anotacion, ...anotacionData };

        return await this.anotacionRepository.save(anotacion);
    }

}
