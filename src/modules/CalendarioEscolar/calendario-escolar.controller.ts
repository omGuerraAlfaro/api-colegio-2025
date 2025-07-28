import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CalendarioEscolar } from 'src/models/CalendarioEscolar.entity';
import { CalendarioEscolarService } from './calendario-escolar.service';
import { Curso } from 'src/models/Curso.entity';

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

    @Get('proximas-curso/:id')
    async getProximasFechasPorCurso(@Param('id') id: number): Promise<CalendarioEscolar[]>{
        return await this.calendarioService.getUpcomingDatesForCourse(id, 10);
    }

    @Get('curso/:id/asignatura/:idAsignatura')
    async getFechasPorCursoYAsignatura(@Param('id') id: number, @Param('idAsignatura') idAsignatura: number): Promise<CalendarioEscolar[]> {
        return await this.calendarioService.getDatesForCourseAndSubject(id, idAsignatura);
    }

    @Get('curso/:id')
    async getFechasPorCurso(@Param('id') id: number): Promise<CalendarioEscolar[]> {
        return await this.calendarioService.getDatesForCourse(id);
    }

    @Get(':id')
    async getById(@Param('id') id: number): Promise<CalendarioEscolar> {
        return await this.calendarioService.getById(id);
    }

    @Post()
    async create(@Body() calendario: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        return await this.calendarioService.create(calendario);
    }

    @Post('curso/:id')
    async createForCourse(@Param('id') id: number, @Body() calendario: Partial<CalendarioEscolar>): Promise<CalendarioEscolar> {
        calendario.curso = { id } as Curso;
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
