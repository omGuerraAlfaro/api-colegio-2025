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
import { InscripcionTallerService } from './inscripcionTaller.service';
import { CreateInscripcionTallerDto } from 'src/dto/create-inscripcion-taller.dto';
import { InscripcionTaller } from 'src/models/InscripcionTaller.entity';

@ApiTags('inscripcion-taller')
@Controller('inscripcion-taller')
export class InscripcionTallerController {
  constructor(private readonly inscripcionTallerService: InscripcionTallerService) { }

  @Post()
  async create(@Body() dto: CreateInscripcionTallerDto): Promise<InscripcionTaller> {
    const { id_alumno, id_taller, correo } = dto;
    return this.inscripcionTallerService.createInscripcionTaller(id_alumno, id_taller, correo);
  }

  @Get()
  async findAll(): Promise<InscripcionTaller[]> {
    return this.inscripcionTallerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<InscripcionTaller> {
    return this.inscripcionTallerService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.inscripcionTallerService.remove(id);
  }


}

