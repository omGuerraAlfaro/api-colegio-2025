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
import { EstudianteService } from './estudiante.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estudiantes')
@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) { }

  @Get()
  async getEstudiantes() {
    return await this.estudianteService.findAll();
  }

  @Get('/rut/:rut')
  async getByRut(@Param('rut') rut: string) {
    return await this.estudianteService.findByRut(rut);
  }

  @Get('count-by-genero')
  async getCountByGender() {
    return this.estudianteService.getCountByGender();
  }
}

