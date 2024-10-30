import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApoderadoAloneDTO, ApoderadoDTO } from 'src/dto/apoderado.dto';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoEstudiante } from 'src/models/ApoderadoEstudiante.entity';
import { ApoderadoSuplente } from 'src/models/ApoderadoSuplente.entity';
import { EstudianteCurso } from 'src/models/CursoEstudiante.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApoderadoService {
  constructor(
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    @InjectRepository(ApoderadoSuplente)
    private readonly apoderadoSuplenteRepository: Repository<ApoderadoSuplente>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(ApoderadoEstudiante)
    private readonly apoderadoEstudianteRepository: Repository<ApoderadoEstudiante>,
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>

  ) { }


  async createApoderadoWithEstudiantes(apoderadoData: ApoderadoDTO): Promise<any> {
    const apoderado = this.apoderadoRepository.create(apoderadoData);
    const savedApoderado = await this.apoderadoRepository.save(apoderado);

    const savedEstudiantes = [];
    for (const estudianteData of apoderadoData.estudiantes) {
      const estudiante = this.estudianteRepository.create(estudianteData);
      const savedEstudiante = await this.estudianteRepository.save(estudiante);
      savedEstudiantes.push(savedEstudiante);

      const apoderadoEstudiante = new ApoderadoEstudiante();
      apoderadoEstudiante.apoderado_id = savedApoderado.id;
      apoderadoEstudiante.estudiante_id = savedEstudiante.id;
      await this.apoderadoEstudianteRepository.save(apoderadoEstudiante);

      const estudianteCurso = new EstudianteCurso();
      estudianteCurso.curso_id = estudianteData.cursoId;
      estudianteCurso.estudiante_id = savedEstudiante.id;
      await this.estudianteCursoRepository.save(estudianteCurso);
    }

    return {
      apoderado: savedApoderado,
      estudiantes: savedEstudiantes
    };
  }

  async findApoderadoByRut(rut: string): Promise<Apoderado> {
    try {
      const apoderado = await this.apoderadoRepository.findOne({ where: { rut } });
      if (!apoderado) {
        throw new InternalServerErrorException('Apoderado no encontrado');
      }
      return apoderado;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el apoderado');
    }
  }

  async findAll() {
    return await this.apoderadoRepository.find();
  }

  async findAllRut() {
    return await this.apoderadoRepository.find({ select: ['rut'] });
  }

  async findOne(id: number) {
    return await this.apoderadoRepository.findOne({ where: { id: id } });
  }

  async findStudentsWithApoderadoId(apoderadoRut: string) {
    const result = await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .leftJoinAndSelect("apoderado.estudiantesConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.estudiante", "estudiante")
      .where("apoderado.rut = :apoderadoRut", { apoderadoRut })
      .getOne();

    if (result) {
      const { estudiantesConnection, ...apoderadoData } = result;
      return {
        ...apoderadoData,
        estudiantes: estudiantesConnection.map(conn => conn.estudiante)
      };
    }
    return null;
  }

  async findAddressWithApoderadoId(apoderadoId: number) {
    const result = await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .leftJoinAndSelect("apoderado.estudiantesConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.estudiante", "estudiante")
      .leftJoinAndSelect("apoderado.direccionConnection", "apoderadoDireccion")
      .leftJoinAndSelect("apoderadoDireccion.direccion", "direccion")
      .leftJoinAndSelect("direccion.ciudad", "ciudad")
      .leftJoinAndSelect("ciudad.region", "region")
      .where("apoderado.id = :apoderadoId", { apoderadoId })
      .getOne();

    if (result) {
      const { estudiantesConnection, direccionConnection, ...otherData } = result;

      return {
        ...otherData,
        estudiantes: estudiantesConnection.map(conn => conn.estudiante),
        direccion: direccionConnection.map(conn => conn.direccion)
      };
    }
    return null;
  }


  /* ************************************************************ */

  async createApoderadoWithEstudiantes2(apoderadoData: ApoderadoDTO): Promise<any> {
    const apoderado = this.apoderadoRepository.create(apoderadoData);
    const savedApoderado = await this.apoderadoRepository.save(apoderado);

    const savedEstudiantes = [];
    for (const estudianteData of apoderadoData.estudiantes) {
      const estudiante = this.estudianteRepository.create(estudianteData);
      const savedEstudiante = await this.estudianteRepository.save(estudiante);
      savedEstudiantes.push(savedEstudiante);

      const apoderadoEstudiante = new ApoderadoEstudiante();
      apoderadoEstudiante.apoderado_id = savedApoderado.id;
      apoderadoEstudiante.estudiante_id = savedEstudiante.id;
      await this.apoderadoEstudianteRepository.save(apoderadoEstudiante);

      const estudianteCurso = new EstudianteCurso();
      estudianteCurso.curso_id = estudianteData.cursoId;
      estudianteCurso.estudiante_id = savedEstudiante.id;
      await this.estudianteCursoRepository.save(estudianteCurso);
    }

    return {
      apoderado: savedApoderado,
      estudiantes: savedEstudiantes
    };
  }

  async saveAllApoderadosWithEstudiantes(data: { apoderados: ApoderadoDTO[] }): Promise<any[]> {
    const results = [];

    for (const apoderadoData of data.apoderados) {
      const result = await this.createApoderadoWithEstudiantes2(apoderadoData);
      results.push(result);
    }

    return results;
  }

  /* ************************************************************ */


  async updateApoderado(id: number, apoderadoData: ApoderadoAloneDTO): Promise<Apoderado> {
    try {
      const apoderado = await this.apoderadoRepository.findOne({ where: { id } });
      if (!apoderado) {
        throw new NotFoundException('Apoderado no encontrado');
      }

      Object.assign(apoderado, apoderadoData);
      return await this.apoderadoRepository.save(apoderado);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el apoderado');
    }
  }

  async findApoderadoSuplenteByRutEstudiante(rut: string): Promise<ApoderadoSuplente | null> {
    const result = await this.apoderadoSuplenteRepository
      .createQueryBuilder("apoderadoSuplente")
      .innerJoinAndSelect("apoderadoSuplente.estudiantesConnection", "apoderadoSuplenteEstudiante")
      .innerJoinAndSelect("apoderadoSuplenteEstudiante.estudiante", "estudiante")
      .where("estudiante.rut = :rut", { rut })
      .getOne();

    return result || null; // Return the found Apoderado Suplente or null
  }

}

