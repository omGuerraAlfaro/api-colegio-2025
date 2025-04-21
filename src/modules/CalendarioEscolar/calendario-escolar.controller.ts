import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CalendarioEscolar } from 'src/models/CalendarioEscolar.entity';
import { CalendarioEscolarService } from './calendario-escolar.service';

@Controller('calendario-escolar')
export class CalendarioEscolarController {
    constructor(private readonly calendarioService: CalendarioEscolarService) {}

    @Get()
    async getAll(): Promise<CalendarioEscolar[]> {
        return await this.calendarioService.getAll();
    }

    @Get('proximas')
    async getProximasFechas(): Promise<CalendarioEscolar[]>{
        return await this.calendarioService.getUpcomingDates(10);
    }

    @Get(':id')
    async getById(@Param('id') id: number): Promise<CalendarioEscolar> {
        return await this.calendarioService.getById(id);
    }

    @Post()
    async create(@Body() calendario: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        return await this.calendarioService.create(calendario);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        return await this.calendarioService.update(id, updateData);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.calendarioService.delete(id);
    }
}
