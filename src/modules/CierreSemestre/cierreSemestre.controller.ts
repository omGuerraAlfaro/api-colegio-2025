import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CierreSemestreService } from './cierreSemestre.service';
import { CreateCierreSemestreDto, CreateCierreSemestreDto2 } from 'src/dto/CreateCierreSemestreDto';

@Controller('cierre-semestre')
export class CierreSemestreController {
  constructor(private readonly cierreService: CierreSemestreService) {}

  @Post(':semestreId')
  crear(@Param('semestreId') semestreId: number) {
    return this.cierreService.crear(semestreId);
  }

  @Get(':estudianteId')
  obtenerPorEstudiante(@Param('estudianteId') estudianteId: number) {
    return this.cierreService.obtenerPorEstudiante(estudianteId);
  }
}