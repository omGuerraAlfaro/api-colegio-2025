import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AnotacionDto, CreateAnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';
import { AsignaturaService } from './asignatura.service';
import { Asignatura } from 'src/models/Asignatura.entity';

@Controller('asignatura')
export class AsignaturaController {
    constructor(private readonly asignaturaService: AsignaturaService) { }

    @Get('all')
    async getAllAsignaturas(): Promise<Asignatura[]> {
        return await this.asignaturaService.getTodasLasAsignaturas();
    }
    @Get('all-basica')
    async getAllAsignaturasBasica(): Promise<Asignatura[]> {
        return await this.asignaturaService.getAllAsignaturasBasica();
    }
    @Get('all-prebasica')
    async getAllAsignaturasPreBasica(): Promise<any[]> {
        return await this.asignaturaService.getAllAsignaturasPreBasica();
    }
}
