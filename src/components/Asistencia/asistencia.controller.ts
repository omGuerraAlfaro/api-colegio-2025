import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';

@Controller('asistencia')
export class AsistenciaController {
    constructor(private readonly asignaturaService: AsistenciaService) {}

}
