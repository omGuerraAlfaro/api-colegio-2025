import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesor } from 'src/models/Profesor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesorService {

  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>
  ) { }

  async findAll() {
    return await this.profesorRepository.find();
  }

  async findOne(id: number) {
    return await this.profesorRepository.findOne({ where: { id: id } });
  }

  async findOneByRut(rut: string) {
    return await this.profesorRepository.findOne({ where: { rut: rut } });
  }

}




