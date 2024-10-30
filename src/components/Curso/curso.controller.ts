import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { log } from 'console';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cursos')
@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  @Get()
  async getCursos() {
    return await this.cursoService.findAllWithTeacher();
  }

  @Get('all')
  async getAllCursos() {
    return await this.cursoService.findAll();
  }

  @Get('estudiantes')
  async getCursosConEstudiantes() {
    return await this.cursoService.findAllCursosWithEstudiantes();
  }

  @Get(':id')
  async getCursoId(@Param('id') id: number) {
    return await this.cursoService.findOneWithCurse(id);
  }
  
  @Get(':id/apoderados-estudiantes')
  async getCursoWithAE(@Param('id') id: number) {
    try {
      const result = await this.cursoService.findCursoWithApoderadoAndEstudiante(id);
      if (!result) {
        console.log('No se encontraron estudiantes para el curso con id: ' + id);
        
      }
      return result;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  @Get('curso-estudiante/:rut')
  async findCursoByRutEstudiante(@Param('rut') rut: string) {
    return await this.cursoService.findCursoByRutEstudiante(rut);
  }
  
}