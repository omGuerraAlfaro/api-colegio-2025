import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/dto/administrador.dto';
import { Administrador } from 'src/models/Administrador.entity';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
  ) { }

  async findAll() {
    return await this.administradorRepository.find();
  }

  async findOne(rut: string) {
    return await this.administradorRepository.findOne({ where: { rut: rut } });
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

