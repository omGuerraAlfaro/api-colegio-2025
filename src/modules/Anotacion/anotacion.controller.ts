import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AnotacionService } from './anotacion.service';
import { AnotacionDto, CreateAnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';

@Controller('anotaciones')
export class AnotacionController {
    constructor(private readonly anotacionService: AnotacionService) {}

    @Get('estudiante/:id')
    async getAnotacionesByEstudianteId(@Param('id', ParseIntPipe) id: number): Promise<AnotacionDto[]> {
        return await this.anotacionService.getAnotacionesByEstudianteId(id);
    }

    @Post('crear/:estudianteId')
    async createAnotacion(
        @Param('estudianteId') estudianteId: number,
        @Body() createAnotacionDto: CreateAnotacionDto
    ) {
        const { anotacion_titulo, anotacion_descripcion, es_positiva, es_negativa, es_neutra, anotacion_estado, asignaturaId } = createAnotacionDto;
        const anotacionData = {
            anotacion_titulo,
            anotacion_descripcion,
            es_positiva,
            es_negativa,
            es_neutra,
            anotacion_estado
        };
        return await this.anotacionService.createAnotacionForStudent(estudianteId, anotacionData, asignaturaId);
    }
}
