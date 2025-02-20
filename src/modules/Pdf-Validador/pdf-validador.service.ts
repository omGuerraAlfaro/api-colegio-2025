import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePdfValidadorDto, UpdatePdfValidadorDto } from 'src/dto/pdf-validador.dto';
import { PdfValidador } from 'src/models/pdf-validador.entity';
import { Repository } from 'typeorm';
import { addDays, format, startOfDay } from 'date-fns';

@Injectable()
export class PdfValidadorService {
    constructor(
        @InjectRepository(PdfValidador)
        private readonly pdfValidadorRepository: Repository<PdfValidador>,
    ) { }

    async create(createPdfValidadorDto: CreatePdfValidadorDto): Promise<PdfValidador> {
        const newRecord = this.pdfValidadorRepository.create(createPdfValidadorDto);
        return await this.pdfValidadorRepository.save(newRecord);
    }

    async createArray(createPdfValidadorDto: CreatePdfValidadorDto[]): Promise<PdfValidador[]> {
        const newRecords = this.pdfValidadorRepository.create(createPdfValidadorDto);

        newRecords.forEach(record => {
            const expiration = addDays(new Date(record.createdAt), 30);
            record.expirationDate = new Date(expiration.getFullYear(), expiration.getMonth(), expiration.getDate());
        });

        return await this.pdfValidadorRepository.save(newRecords);
    }

    async findAll(): Promise<PdfValidador[]> {
        return await this.pdfValidadorRepository.find();
    }

    async findOne(id: string): Promise<PdfValidador> {
        const record = await this.pdfValidadorRepository.findOne({ where: { validationCode: id } });
        if (!record) {
            throw new NotFoundException(`Registro con id ${id} no encontrado`);
        }
        return record;
    }

    async findOneByRutApoderado(rut: string): Promise<PdfValidador[]> {
        const record = await this.pdfValidadorRepository.find({ where: { rutApoderado: rut, isPagada: true } });
        if (!record) {
            throw new NotFoundException(`Registro con id ${rut} no encontrado`);
        }
        return record;
    }

    async update(id: string, updatePdfValidadorDto: UpdatePdfValidadorDto): Promise<PdfValidador> {
        const record = await this.findOne(id);
        Object.assign(record, updatePdfValidadorDto);
        return await this.pdfValidadorRepository.save(record);
    }

    async updatePay(id: string, updatePdfValidadorDto: UpdatePdfValidadorDto): Promise<PdfValidador> {
        const record = await this.pdfValidadorRepository.findOne({ where: { uniqueIdPago: id } });
        Object.assign(record, updatePdfValidadorDto);
        return await this.pdfValidadorRepository.save(record);
    }

    async remove(id: string): Promise<void> {
        const record = await this.findOne(id);
        await this.pdfValidadorRepository.remove(record);
    }
}
