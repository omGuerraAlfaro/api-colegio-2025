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

    @Put('modificarPreBasica/:id')
    async updatePreBasica(
        @Param('id') id: number,
        @Body() updateEvaluacionDto: UpdateEvaluacionDto,
    ) {
        return await this.evaluacionService.updatePreBasica(id, updateEvaluacionDto);
    }

    @Put('modificarBasica/:id')
    async updateBasica(
        @Param('id') id: number,
        @Body() updateEvaluacionDto: UpdateEvaluacionDto,
    ) {
        return await this.evaluacionService.updateBasica(id, updateEvaluacionDto);
    }

    @Delete('eliminarPreBasica/:id')
    async removePreBasica(@Param('id') id: number) {
        await this.evaluacionService.removePreBasica(id);
        return { message: 'Evaluación eliminada correctamente' };
    }
    
    @Delete('eliminarBasica/:id')
    async removeBasica(@Param('id') id: number) {
        await this.evaluacionService.removeBasica(id);
        return { message: 'Evaluación eliminada correctamente' };
    }

    // @Get('curso/:idCurso/asignatura/:idAsignatura')
    // async getEvaluacionesConNotas(@Param('idCurso') idCurso: number, @Param('idAsignatura') idAsignatura: number) {
    //     return await this.evaluacionService.getEvaluacionesConNotas(idCurso,idAsignatura);
    // }
}
