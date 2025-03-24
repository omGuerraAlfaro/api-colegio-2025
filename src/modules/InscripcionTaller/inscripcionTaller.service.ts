import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorreoService } from '../Correo/correo.service';
import { Estudiante } from 'src/models/Estudiante.entity';
import { InscripcionTaller } from 'src/models/InscripcionTaller.entity';
import { TipoTaller } from 'src/models/TipoTaller.entity';
import { CursoService } from '../Curso/curso.service';
import { Curso } from 'src/models/Curso.entity';

@Injectable()
export class InscripcionTallerService {
  private readonly logger = new Logger(InscripcionTallerService.name);

  constructor(
    @InjectRepository(InscripcionTaller)
    private readonly inscripcionTallerRepository: Repository<InscripcionTaller>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,

    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,

    @InjectRepository(TipoTaller)
    private readonly tipoTallerRepository: Repository<TipoTaller>,

    private readonly correoService: CorreoService,

    private readonly cursoService: CursoService,
  ) { }

  async createInscripcionTaller(id_alumno: number, id_taller: number, correo: string): Promise<InscripcionTaller> {
    try {
      const estudiante = await this.estudianteRepository.findOne({
        where: { id: id_alumno },
      });
      if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id_alumno} no encontrado`);

      const idCurso = await this.cursoService.findCursoIdByEstudianteId(id_alumno);
      const curso = await this.cursoRepository.findOne({ where: { id: idCurso } });

      const tipoTaller = await this.tipoTallerRepository.findOne({ where: { id_taller } });
      if (!tipoTaller) throw new NotFoundException(`Taller con ID ${id_taller} no encontrado`);

      const yaInscrito = await this.inscripcionTallerRepository.findOne({
        where: {
          estudiante: { id: id_alumno },
          tipo_taller: { id_taller },
        },
      });

      if (yaInscrito) {
        throw new InternalServerErrorException('El estudiante ya está inscrito en este taller');
      }

      const nuevaInscripcion = this.inscripcionTallerRepository.create({
        estudiante,
        curso,
        tipo_taller: tipoTaller,
        fecha_matricula_inscripcion: new Date(),
      });

      const saved = await this.inscripcionTallerRepository.save(nuevaInscripcion);

      this.logger.log(`Inscripción creada: Estudiante ID ${id_alumno} - Curso ID ${idCurso} - Taller ID ${id_taller}`);

      const correoHtmlApoderado = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #2c3e50;">Confirmación de Inscripción Taller 2025</h2>
          <p>Estimado/a apoderado/a,</p>
          <p>Se ha registrado correctamente la inscripción del estudiante:</p>
          <ul>
            <li><strong>Nombre:</strong> ${estudiante.primer_nombre_alumno ?? ''} ${estudiante.segundo_nombre_alumno ?? ''} ${estudiante.primer_apellido_alumno ?? ''} ${estudiante.segundo_apellido_alumno ?? ''}</li>
            <li><strong>Curso:</strong> ${curso?.nombre}</li>
            <li><strong>Taller inscrito:</strong> ${tipoTaller.descripcion_taller}</li>
          </ul>
          <p>Ante cualquier duda, puede comunicarse con nosotros.</p>
          <br>
          <p style="color: #7f8c8d;">Atentamente,<br>Equipo Colegio Andes Chile</p>
        </div>
      `;

      const correoHtmlColegio = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #2c3e50;">Confirmación de Inscripción Taller 2025</h2>
          <p>Estimado/a</p>
          <p>Se ha registrado correctamente la inscripción del estudiante:</p>
          <ul>
            <li><strong>Nombre:</strong> ${estudiante.primer_nombre_alumno ?? ''} ${estudiante.segundo_nombre_alumno ?? ''} ${estudiante.primer_apellido_alumno ?? ''} ${estudiante.segundo_apellido_alumno ?? ''}</li>
            <li><strong>Curso:</strong> ${curso?.nombre}</li>
            <li><strong>Taller inscrito:</strong> ${tipoTaller.descripcion_taller}</li>
          </ul>
          <p>Correo Automático.</p>
          <br>
          <p style="color: #7f8c8d;">Atentamente,<br>Sistemas Colegio Andes Chile</p>
        </div>
      `;

      const mailOptionsApoderado = {
        from: 'contacto@colegioandeschile.cl',
        to: [correo],
        subject: 'Confirmación Inscripción Taller 2025',
        html: correoHtmlApoderado,
      };
      const mailOptionsAdm = {
        from: 'contacto@colegioandeschile.cl',
        to: ['omar.guerra@outlook.cl'],
        subject: 'Confirmación Inscripción Taller 2025',
        html: correoHtmlColegio,
      };

      try {
        await this.correoService.enviarCorreo(mailOptionsApoderado);
        await this.correoService.enviarCorreo(mailOptionsAdm);
        console.log('Correo enviado con éxito');
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }

      return saved;
    } catch (error) {
      this.logger.error(`Error al crear inscripción: ${error.message}`);
      throw new InternalServerErrorException(error.message || 'No se pudo registrar la inscripción');
    }
  }


  async findAll(): Promise<InscripcionTaller[]> {
    return this.inscripcionTallerRepository.find({
      relations: ['estudiante', 'tipo_taller', 'curso'],
    });
  }

  async findOne(id: number): Promise<InscripcionTaller> {
    const inscripcion = await this.inscripcionTallerRepository.findOne({
      where: { id_inscripcion: id },
      relations: ['estudiante', 'tipo_taller', 'curso'],
    });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    return inscripcion;
  }

  async remove(id: number): Promise<void> {
    const result = await this.inscripcionTallerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró inscripción con ID ${id} para eliminar`);
    }
    this.logger.log(`Inscripción con ID ${id} eliminada`);
  }
}
