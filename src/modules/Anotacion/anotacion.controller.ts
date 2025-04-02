import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AnotacionService } from './anotacion.service';
import { AnotacionDto, CreateAnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';

@Controller('anotaciones')
export class AnotacionController {
    constructor(private readonly anotacionService: AnotacionService) { }

    @Get('estudiante/:id')
    async getAnotacionesByEstudianteId(@Param('id', ParseIntPipe) id: number): Promise<AnotacionDto[]> {
        return await this.anotacionService.getAnotacionesByEstudianteId(id);
    }

    @Post('crear/:estudianteId')
    async createAnotacion(
        @Param('estudianteId') estudianteId: number,
        @Body() createAnotacionDto: CreateAnotacionDto
    ) {
        const { anotacion_titulo, anotacion_descripcion, es_positiva, es_negativa, es_neutra, anotacion_estado, asignaturaId, asignaturaPreBasicaId } = createAnotacionDto;
        const anotacionData = {
            anotacion_titulo,
            anotacion_descripcion,
            es_positiva,
            es_negativa,
            es_neutra,
            anotacion_estado
        };
        return await this.anotacionService.createAnotacionForStudent(estudianteId, anotacionData, asignaturaId, asignaturaPreBasicaId);
    }

    // Endpoint para eliminar una anotación de un estudiante específico.
    // Ruta: DELETE /estudiantes/:estudianteId/anotaciones/:anotacionId
    @Delete('estudiantes/:estudianteId/anotaciones/:anotacionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAnotacion(
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Param('anotacionId', ParseIntPipe) anotacionId: number,
    ): Promise < void> {
        await this.anotacionService.deleteAnotacionForStudent(estudianteId, anotacionId);
    }
    
    // Endpoint para actualizar una anotación existente.
    // Ruta: PUT /anotaciones/:anotacionId
    // Se espera recibir en el body los campos a actualizar, incluyendo opcionalmente "asignaturaId"
    @Put('anotaciones/:anotacionId')
    async updateAnotacion(
        @Param('anotacionId', ParseIntPipe) anotacionId: number,
        @Body() anotacionData: Partial<Anotacion>
    ): Promise < Anotacion > {
        // Se extrae asignaturaId del body, en caso de que se quiera actualizar la relación
        const { id, ...rest } = anotacionData;
        return await this.anotacionService.updateAnotacion(anotacionId, rest, id);
    }
}

