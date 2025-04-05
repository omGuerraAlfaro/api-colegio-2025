import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { NotasService } from './notas.service';
import { Nota } from 'src/models/Notas.entity';
import { CierreSemestreDto, CierreSemestrePreBasicaDto } from 'src/dto/evaluacion.dto';
import { CreateNotasDto } from 'src/dto/notas.dto';

@Controller('notas')
export class NotasController {
    constructor(private readonly notasService: NotasService) { }

    // Obtener todas las notas por estudiante, asignatura y semestre
    @Get('/estudiante/:estudianteId/asignatura/:asignaturaId/semestre/:semestreId')
    async getNotasPorEstudianteAsignaturaSemestre(
        @Param('estudianteId') estudianteId: number,
        @Param('asignaturaId') asignaturaId: number,
        @Param('semestreId') semestreId: number
    ): Promise<any[]> {
        return await this.notasService.getNotasPorEstudianteAsignaturaSemestre(
            estudianteId,
            asignaturaId,
            semestreId
        );
    }

    // Obtener el promedio de notas por estudiante, asignatura y semestre
    @Get('/promedio/estudiante/:estudianteId/asignatura/:asignaturaId/semestre/:semestreId')
    async getPromedioPorEstudianteAsignaturaSemestre(
        @Param('estudianteId') estudianteId: number,
        @Param('asignaturaId') asignaturaId: number,
        @Param('semestreId') semestreId: number
    ): Promise<number> {
        return await this.notasService.getPromedioPorEstudianteAsignaturaSemestre(
            estudianteId,
            asignaturaId,
            semestreId
        );
    }

    // Crear una nueva nota
    @Post('nuevas-notas')
    async createNotas(@Body() data: CreateNotasDto): Promise<void> {
        await this.notasService.createNotas(data);
    }


    // Actualizar una nota existente
    @Put('/:notaId')
    async updateNota(
        @Param('notaId') notaId: number,
        @Body() data: { nota: number; evaluacionId?: number; fecha?: Date }
    ): Promise<Nota> {
        return await this.notasService.updateNota(notaId, data);
    }

    // Obtener resumen de notas por estudiante y semestre
    @Get('/resumen/estudiante/:estudianteId/semestre/:semestreId')
    async getNotasResumenPorEstudianteSemestre(
        @Param('estudianteId') estudianteId: number,
        @Param('semestreId') semestreId: number
    ): Promise<any[]> {
        return await this.notasService.getNotasResumenPorEstudianteSemestre(
            estudianteId,
            semestreId
        );
    }

    // Obtener notas por evaluación
    @Get('/evaluacion/:evaluacionId')
    async getNotasPorEvaluacion(
        @Param('evaluacionId') evaluacionId: number
    ): Promise<any[]> {
        return await this.notasService.getNotasPorEvaluacion(evaluacionId);
    }

    @Get('/curso/:cursoId/asignatura/:asignaturaId/semestre/:semestreId')
    async getNotasPorCursoAsignatura(
        @Param('cursoId') cursoId: number,
        @Param('asignaturaId') asignaturaId: number,
        @Param('semestreId') semestreId: number
    ): Promise<any[]> {
        return await this.notasService.getNotasPorCursoAsignatura(
            cursoId,
            asignaturaId,
            semestreId
        );
    }

    @Post('cierre-semestre-prebasica')
    async cierreSemestrePreBasica(@Body() dto: CierreSemestrePreBasicaDto): Promise<void> {
        await this.notasService.cierreSemestrePreBasica(dto);
    }

    @Post('cierre-semestre-basica')
    async cierreSemestreBasica(@Body() dto: CierreSemestreDto): Promise<void> {
        await this.notasService.cierreSemestreBasica(dto);
    }
}
