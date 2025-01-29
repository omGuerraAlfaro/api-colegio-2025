import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarioEscolar } from 'src/models/CalendarioEscolar.entity';

@Injectable()
export class CalendarioEscolarService {
    constructor(
        @InjectRepository(CalendarioEscolar)
        private readonly calendarioRepository: Repository<CalendarioEscolar>,
    ) {}

    async getAll(): Promise<CalendarioEscolar[]> {
        return await this.calendarioRepository.find();
    }

    async getById(id: number): Promise<CalendarioEscolar> {
        return await this.calendarioRepository.findOneOrFail({ where: { id_dia: id } });
    }

    async create(calendario: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        const newCalendario = this.calendarioRepository.create(calendario);
        return await this.calendarioRepository.save(newCalendario);
    }

    async update(id: number, updateData: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        await this.calendarioRepository.update(id, updateData);
        return await this.calendarioRepository.findOneOrFail({ where: { id_dia: id } });
    }

    async delete(id: number): Promise<void> {
        await this.calendarioRepository.delete(id);
    }
}
