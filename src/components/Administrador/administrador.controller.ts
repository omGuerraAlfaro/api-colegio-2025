import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/dto/administrador.dto';
@ApiBearerAuth()
@ApiTags('Administrador')
@Controller('administrador')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) { }

  @Get()
  async getAdministradores() {
    return await this.administradorService.findAll();
  }

  @Get(':rut')
  async getAdministrador(@Param('rut') rut: string) {
    const administrador = await this.administradorService.findOne(rut);
    if (!administrador) throw new BadRequestException('Administrador no encontrado');
    return administrador;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const administrador = await this.administradorService.createAdministrador(createAdminDto);
    return administrador;
  }
}

