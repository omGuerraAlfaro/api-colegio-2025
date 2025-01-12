import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluacion } from 'src/models/Evaluacion.entity';
import { Nota } from 'src/models/Notas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotasService {
    constructor(
        @InjectRepository(Nota)
        private readonly notaRepository: Repository<Nota>,
        @InjectRepository(Evaluacion)
        private readonly evaluacionRepository: Repository<Evaluacion>,
    ) { }

   

}
