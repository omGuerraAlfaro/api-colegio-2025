import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEvaluacionDto, UpdateEvaluacionDto } from 'src/dto/evaluacion.dto';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Curso } from 'src/models/Curso.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { EvaluacionPreBasica } from 'src/models/EvaluacionPreBasica.entity';
import { Nota } from 'src/models/Notas.entity';
import { NotaPreBasica } from 'src/models/NotasPreBasica.entity';
import { Semestre } from 'src/models/Semestre.entity';
import { TipoEvaluacion } from 'src/models/TipoEvaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
    constructor(
        @InjectRepository(Evaluacion)
        private readonly evaluacionRepository: Repository<Evaluacion>,
        @InjectRepository(Nota)
        private readonly notaRepository: Repository<Nota>,
        @InjectRepository(NotaPreBasica)
        private readonly notaPreBasicaRepository: Repository<NotaPreBasica>,
        @InjectRepository(EvaluacionPreBasica)
        private readonly evaluacionPreBasicaRepository: Repository<EvaluacionPreBasica>,
    ) { }


    async createPreBasica(createEvaluacionDto: CreateEvaluacionDto): Promise<EvaluacionPreBasica> {
        try {
            const nuevaEvaluacion = this.evaluacionPreBasicaRepository.create({
                nombre_evaluacion: createEvaluacionDto.nombreEvaluacion,
                asignatura: { id: createEvaluacionDto.asignaturaId },
                semestre: { id_semestre: createEvaluacionDto.semestreId },
                id_tipo_evaluacion: { id_evaluacion: createEvaluacionDto.tipoEvaluacionId },
                curso: { id: createEvaluacionDto.cursoId },
            });
            return await this.evaluacionPreBasicaRepository.save(nuevaEvaluacion);
        } catch (error) {
            throw new InternalServerErrorException(`Error al crear evaluación pre básica: ${error.message}`);
        }
    }

    async createBasica(createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
        try {
            const nuevaEvaluacion = this.evaluacionRepository.create({
                nombre_evaluacion: createEvaluacionDto.nombreEvaluacion,
                asignatura: { id: createEvaluacionDto.asignaturaId },
                semestre: { id_semestre: createEvaluacionDto.semestreId },
                id_tipo_evaluacion: { id_evaluacion: createEvaluacionDto.tipoEvaluacionId },
                curso: { id: createEvaluacionDto.cursoId },
            });
            return await this.evaluacionRepository.save(nuevaEvaluacion);
        } catch (error) {
            throw new InternalServerErrorException(`Error al crear evaluación básica: ${error.message}`);
        }
    }

    async findAll(): Promise<Evaluacion[]> {
        return await this.evaluacionRepository.find({
            relations: ['curso', 'asignatura', 'semestre', 'id_tipo_evaluacion', 'notas'],
        });
    }

    async findOne(id: number): Promise<Evaluacion> {
        const evaluacion = await this.evaluacionRepository.findOne({
            where: { id_evaluacion: id },
            relations: ['curso', 'asignatura', 'semestre', 'id_tipo_evaluacion', 'notas'],
        });
        if (!evaluacion) {
            throw new NotFoundException(`Evaluación con id ${id} no encontrada.`);
        }
        return evaluacion;
    }

    async updatePreBasica(id: number, updateEvaluacionDto: UpdateEvaluacionDto): Promise<EvaluacionPreBasica> {
        const evaluacion = await this.evaluacionPreBasicaRepository.findOne({
            where: { id_evaluacion: id }
        });

        if (updateEvaluacionDto.nombreEvaluacion !== undefined) {
            evaluacion.nombre_evaluacion = updateEvaluacionDto.nombreEvaluacion;
        }

        return await this.evaluacionPreBasicaRepository.save(evaluacion);
    }

    async updateBasica(id: number, updateEvaluacionDto: UpdateEvaluacionDto): Promise<Evaluacion> {
        const evaluacion = await this.findOne(id);

        if (updateEvaluacionDto.nombreEvaluacion !== undefined) {
            evaluacion.nombre_evaluacion = updateEvaluacionDto.nombreEvaluacion;
        }

        return await this.evaluacionRepository.save(evaluacion);
    }

    async removePreBasica(id: number): Promise<void> {
        // Se obtiene la evaluación, o se lanza NotFoundException si no existe
        const evaluacion = await this.evaluacionPreBasicaRepository.findOne({
            where: { id_evaluacion: id }
        });

        await this.notaPreBasicaRepository.delete({
            evaluacion: { id_evaluacion: evaluacion.id_evaluacion }
        });

        // Se elimina la evaluación
        await this.evaluacionPreBasicaRepository.remove(evaluacion);
    }

    async removeBasica(id: number): Promise<void> {
        // Se obtiene la evaluación, o se lanza NotFoundException si no existe
        const evaluacion = await this.evaluacionRepository.findOne({
            where: { id_evaluacion: id }
        });

        await this.notaRepository.delete({
            evaluacion: { id_evaluacion: evaluacion.id_evaluacion }
        });

        // Se elimina la evaluación
        await this.evaluacionRepository.remove(evaluacion);
    }


}
