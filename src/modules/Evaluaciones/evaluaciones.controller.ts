import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { EvaluacionService } from './evaluaciones.service';
import { CreateEvaluacionDto, UpdateEvaluacionDto } from 'src/dto/evaluacion.dto';

@Controller('evaluaciones')
export class EvaluacionController {
    constructor(private readonly evaluacionService: EvaluacionService) { }

    @Post()
    async create(@Body() createEvaluacionDto: CreateEvaluacionDto) {
        if (createEvaluacionDto.cursoId == 1 || createEvaluacionDto.cursoId == 2) {
            return await this.evaluacionService.createPreBasica(createEvaluacionDto);
        } else {
            return await this.evaluacionService.createBasica(createEvaluacionDto);
        }
    }

    @Get()
    async findAll() {
        return await this.evaluacionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.evaluacionService.findOne(id);
    }

    @Put('modificar/:id')
    async update(
        @Param('id') id: number,
        @Body() updateEvaluacionDto: UpdateEvaluacionDto,
    ) {
        return await this.evaluacionService.update(id, updateEvaluacionDto);
    }

    @Delete('eliminar/:id')
    async remove(@Param('id') id: number) {
        await this.evaluacionService.remove(id);
        return { message: 'Evaluación eliminada correctamente' };
    }

    // @Get('curso/:idCurso/asignatura/:idAsignatura')
    // async getEvaluacionesConNotas(@Param('idCurso') idCurso: number, @Param('idAsignatura') idAsignatura: number) {
    //     return await this.evaluacionService.getEvaluacionesConNotas(idCurso,idAsignatura);
    // }
}
