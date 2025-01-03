import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto, UpdateAsistenciaDto } from 'src/dto/asistencia.dto';

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

    // Actualizar asistencia existente
    @Put(':id')
    async updateAsistencia(
        @Param('id') asistenciaId: number,
        @Body() updateAsistenciaDto: UpdateAsistenciaDto,
    ) {
        try {
            const asistenciaActualizada = await this.asistenciaService.updateAsistencia({
                asistenciaId,
                ...updateAsistenciaDto,
            });
            return {
                message: 'Asistencia actualizada exitosamente',
                data: asistenciaActualizada,
            };
        } catch (error) {
            return {
                message: 'Error al actualizar la asistencia',
                error: error.message,
            };
        }
    }

    @Post('create-all/:semestreId')
    async createAsistenciasForAll(@Param('semestreId') semestreId: number): Promise<string> {
        return await this.asistenciaService.createAsistenciasForAllStudents(semestreId);
    }

}
