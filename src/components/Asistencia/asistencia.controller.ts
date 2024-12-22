import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';

@Controller('asistencia')
export class AsistenciaController {
    constructor(private readonly asistenciaService: AsistenciaService) { }

    @Get('calendario')
    async getAllFechasCalendarioAsistencia() {
        return await this.asistenciaService.getAllFechasCalendarioAsistencia();
    }

    @Post('buscar')
    async buscarAsistenciaPorCursoYSemestre(
        @Body() body: { cursoId: number; semestreId: number },
    ) {
        const { cursoId, semestreId } = body;
        return await this.asistenciaService.getAsistenciaByCursoAndSemestre(cursoId, semestreId);
    }

}
