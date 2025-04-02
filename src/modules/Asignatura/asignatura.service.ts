import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignatura } from 'src/models/Asignatura.entity';
import { AsignaturaPreBasica } from 'src/models/AsignaturaPreBasica.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsignaturaService {
    constructor(
        @InjectRepository(Asignatura)
        private readonly asignaturaRepository: Repository<Asignatura>,
        @InjectRepository(AsignaturaPreBasica)
        private readonly asignaturaPreBasicaRepository: Repository<AsignaturaPreBasica>,
    ) { }

    async getAllAsignaturasBasica(): Promise<Asignatura[]> {
        const asignaturas = await this.asignaturaRepository.find();
        return asignaturas;
    }

    async getAllAsignaturasPreBasica(): Promise<AsignaturaPreBasica[]> {
        const asignaturas = await this.asignaturaPreBasicaRepository.find();
        return asignaturas;
    }

    async getTodasLasAsignaturas(): Promise<any[]> {
        const [basica, preBasica] = await Promise.all([
            this.asignaturaRepository.find(),
            this.asignaturaPreBasicaRepository.find(),
        ]);

        return [...basica, ...preBasica];
    }


}
