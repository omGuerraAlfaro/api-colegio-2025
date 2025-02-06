import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignatura } from 'src/models/Asignatura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsignaturaService {
    constructor(
        @InjectRepository(Asignatura)
        private readonly asignaturaRepository: Repository<Asignatura>,
    ) { }

    async getAllAsignaturas(): Promise<Asignatura[]> {
        const asignaturas = await this.asignaturaRepository.find();
        return asignaturas;
    }
    
}
