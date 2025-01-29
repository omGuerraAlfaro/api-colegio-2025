import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/dto/administrador.dto';
import { Administrador } from 'src/models/Administrador.entity';
import { Apoderado } from 'src/models/Apoderado.entity';
import { SubAdministrador } from 'src/models/SubAdministrador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
    @InjectRepository(SubAdministrador)
    private readonly subAdministradorRepository: Repository<SubAdministrador>,
  ) { }

  async findAll() {
    return await this.administradorRepository.find();
  }

  async findOneAdm(rut: string) {
    return await this.administradorRepository.findOne({ where: { rut: rut } });
  }

  async findOneSubAdm(rut: string) {
    return await this.subAdministradorRepository.findOne({ where: { rut: rut } });
  }

  async createAdministrador(createAdminDto: CreateAdminDto): Promise<Administrador> {
    try {
      const administrador = this.administradorRepository.create(createAdminDto);
      return await this.administradorRepository.save(administrador);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el administrador');
    }
  }


}

