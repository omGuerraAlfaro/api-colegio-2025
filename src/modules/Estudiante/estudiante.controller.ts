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
  Put,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateEstudianteDto } from 'src/dto/estudiante.dto';

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

  @Put(':id')
  async updateEstudiante(
    @Param('id') id: number,
    @Body() updateData: UpdateEstudianteDto,
  ) {
    const updatedEstudiante = await this.estudianteService.updateEstudiante(id, updateData);

    if (!updatedEstudiante) {
      return { message: 'Estudiante not found' };
    }

    return updatedEstudiante;
  }
}

