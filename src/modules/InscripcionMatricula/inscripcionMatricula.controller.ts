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
import { ApiTags } from '@nestjs/swagger';
import { InscripcionMatriculaService } from './inscripcionMatricula.service';
import { InscripcionMatricula } from 'src/models/InscripcionMatricula.entity';
import { InscripcionDto, NuevoEstudianteDto } from 'src/dto/matricula.dto';

@ApiTags('inscripcion-matricula')
@Controller('inscripcion-matricula')
export class InscripcionMatriculaController {
  constructor(private readonly inscripcionMatriculaService: InscripcionMatriculaService) { }

  @Get()
  findAll() {
    return this.inscripcionMatriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionMatriculaService.findOne(id);
  }

  @Post()
  create(@Body() inscripcionMatricula: InscripcionMatricula) {
    return this.inscripcionMatriculaService.create(inscripcionMatricula);
  }

  @Post('crear-matricula')
  createMatricula(@Body() inscripcionMatricula: InscripcionDto) {
    return this.inscripcionMatriculaService.createMatricula(inscripcionMatricula);
  }

  @Post('crear-matricula/agregar-estudiante')
  agregarEstudiante(@Body() inscripcionMatricula: NuevoEstudianteDto) {
    return this.inscripcionMatriculaService.agregarEstudiantes(inscripcionMatricula);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.inscripcionMatriculaService.remove(id);
  }

}

