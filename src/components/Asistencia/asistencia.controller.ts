import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto, UpdateAsistenciaDto, UpdateMultipleAsistenciaDto } from 'src/dto/asistencia.dto';

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

    // Crear nueva asistencia
    @Post()
    async createAsistencia(@Body() createAsistenciaDto: CreateAsistenciaDto) {
        try {
            const nuevaAsistencia = await this.asistenciaService.createAsistencia(createAsistenciaDto);
            return {
                message: 'Asistencia creada exitosamente',
                data: nuevaAsistencia,
            };
        } catch (error) {
            return {
                message: 'Error al crear la asistencia',
                error: error.message,
            };
        }
    }

    @Put()
    async updateAsistencias(
        @Body() updateMultipleAsistenciaDto: UpdateMultipleAsistenciaDto
    ) {
        try {
            // updateMultipleAsistenciaDto.asistencias es un array de UpdateAsistenciaDto
            const asistenciasActualizadas = await this.asistenciaService.updateAsistencias(
                updateMultipleAsistenciaDto.asistencias,
            );

            return {
                message: 'Asistencias actualizadas exitosamente',
                data: asistenciasActualizadas,
            };
        } catch (error) {
            return {
                message: 'Error al actualizar las asistencias',
                error: error.message,
            };
        }
    }


    @Post('create-all/:semestreId')
    async createAsistenciasForAll(@Param('semestreId') semestreId: number): Promise<string> {
        return await this.asistenciaService.createAsistenciasForAllStudents(semestreId);
    }

}
