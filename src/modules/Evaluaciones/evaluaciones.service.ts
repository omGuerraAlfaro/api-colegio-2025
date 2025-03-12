import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEvaluacionDto, UpdateEvaluacionDto } from 'src/dto/evaluacion.dto';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Curso } from 'src/models/Curso.entity';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { Semestre } from 'src/models/Semestre.entity';
import { TipoEvaluacion } from 'src/models/TipoEvaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
    constructor(
        @InjectRepository(Evaluacion)
        private readonly evaluacionRepository: Repository<Evaluacion>,
    ) { }

    async create(createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
        const nuevaEvaluacion = this.evaluacionRepository.create({
            nombre_evaluacion: createEvaluacionDto.nombreEvaluacion,
            asignatura: { id: createEvaluacionDto.asignaturaId },
            semestre: { id_semestre: createEvaluacionDto.semestreId },
            id_tipo_evaluacion: { id_evaluacion: createEvaluacionDto.tipoEvaluacionId },
            curso: { id: createEvaluacionDto.cursoId },
        });
        return await this.evaluacionRepository.save(nuevaEvaluacion);
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

    async update(id: number, updateEvaluacionDto: UpdateEvaluacionDto): Promise<Evaluacion> {
        const evaluacion = await this.findOne(id);

        if (updateEvaluacionDto.nombreEvaluacion !== undefined) {
            evaluacion.nombre_evaluacion = updateEvaluacionDto.nombreEvaluacion;
        }

        return await this.evaluacionRepository.save(evaluacion);
    }

    async remove(id: number): Promise<void> {
        const evaluacion = await this.findOne(id);
        await this.evaluacionRepository.remove(evaluacion);
    }

}
