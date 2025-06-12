import { Controller, Get, Param } from '@nestjs/common';
import { SemestreService } from './semestre.service';

@Controller('semestres')
export class SemestreController {
    constructor(private readonly semestreService: SemestreService) { }

    @Get('buscar/:fecha')
    async obtenerSemestre(@Param('fecha') fecha: string): Promise<{ id_semestre: number }> {
        const id_semestre = await this.semestreService.obtenerSemestrePorFecha(fecha);
        return { id_semestre };
    }

    @Get('estado')
    async getEstadosSemestres() {
        return this.semestreService.obtenerEstadosDeSemestres();
    }

}
