import { Controller, Post, Get, Param } from '@nestjs/common';
import { CierreSemestreService } from './cierreSemestre.service';

@Controller('cierre-semestre')
export class CierreSemestreController {
  constructor(private readonly cierreService: CierreSemestreService) {}
  
  // Genera el cierre anual (semestreId = 3 por defecto)
  @Post('anual')
  crearCierreAnual() {
    console.log('Crear cierre anual');
    return this.cierreService.crearCierreAnual({});
  }

  // Cierra un semestre (1 o 2)
  @Post(':semestreId')
  crear(@Param('semestreId') semestreId: number) {
    return this.cierreService.crear(semestreId);
  }

  // Devuelve todos los cierres de un estudiante (cualquier semestre)
  @Get(':estudianteId')
  obtenerPorEstudiante(@Param('estudianteId') estudianteId: number) {
    return this.cierreService.obtenerPorEstudiante(estudianteId);
  }

  // Devuelve los cierres de un estudiante en un semestre específico (incluye 3 = anual)
  @Get(':estudianteId/semestre/:semestreId')
  obtenerPorEstudianteySemestre(
    @Param('estudianteId') estudianteId: number,
    @Param('semestreId') semestreId: number,
  ) {
    return this.cierreService.obtenerPorEstudianteySemestre(estudianteId, semestreId);
  }

  // Devuelve el cierre anual (semestreId = 3) de un estudiante
  @Get(':estudianteId/anual')
  obtenerCierreAnualPorEstudiante(@Param('estudianteId') estudianteId: number) {
    return this.cierreService.obtenerCierreAnualPorEstudiante(estudianteId);
  }
}
