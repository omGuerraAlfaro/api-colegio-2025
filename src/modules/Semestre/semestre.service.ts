import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semestre } from 'src/models/Semestre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SemestreService {
  constructor(
    @InjectRepository(Semestre)
    private readonly semestreRepository: Repository<Semestre>,
  ) { }

  async obtenerSemestrePorFecha(fecha: string): Promise<number | null> {
    const fechaConsulta = new Date(fecha);

    const semestre = await this.semestreRepository
      .createQueryBuilder('semestre')
      .where(':fecha BETWEEN semestre.fecha_inicio AND semestre.fecha_fin', { fecha: fechaConsulta })
      .getOne();

    if (!semestre) {
      return 0;
      // throw new NotFoundException('No se encontró un semestre para la fecha proporcionada.');
    }

    return semestre.id_semestre;
  }
}
