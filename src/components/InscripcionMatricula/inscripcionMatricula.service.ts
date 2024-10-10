import { Get, Injectable, InternalServerErrorException, Logger, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InscripcionMatricula } from 'src/models/InscripcionMatricula.entity';
import { CorreoService } from '../Correo/correo.service';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoService } from '../Apoderado/apoderado.service';
import { ApoderadoDTO } from 'src/dto/apoderado.dto';
import { InscripcionDto } from 'src/dto/matricula.dto';
import { Estudiante } from 'src/models/Estudiante.entity';
import { ApoderadoEstudiante } from 'src/models/ApoderadoEstudiante.entity';
import { EstudianteCurso } from 'src/models/CursoEstudiante.entity';
import { ApoderadoSuplente } from 'src/models/ApoderadoSuplente.entity';
import { ApoderadoSuplenteEstudiante } from 'src/models/ApoderadoSuplenteEstudiante.entity';

@Injectable()
export class InscripcionMatriculaService {
  private readonly logger = new Logger(InscripcionMatriculaService.name);

  constructor(
    @InjectRepository(InscripcionMatricula)
    private readonly inscripcionMatriculaRepository: Repository<InscripcionMatricula>,
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    @InjectRepository(ApoderadoSuplente)
    private readonly apoderadoSuplenteRepository: Repository<ApoderadoSuplente>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(ApoderadoEstudiante)
    private readonly apoderadoEstudianteRepository: Repository<ApoderadoEstudiante>,
    @InjectRepository(ApoderadoSuplenteEstudiante)
    private readonly apoderadoSuplenteEstudianteRepository: Repository<ApoderadoSuplenteEstudiante>,
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>,
    private readonly correoService: CorreoService,

  ) { }

  async findAll(): Promise<InscripcionMatricula[]> {
    return this.inscripcionMatriculaRepository.find();
  }

  async findOne(id_inscripcion: string): Promise<InscripcionMatricula> {
    return this.inscripcionMatriculaRepository.findOne({ where: { id_inscripcion } });
  }

  async create(inscripcionMatricula: InscripcionMatricula): Promise<InscripcionMatricula> {
    try {
      inscripcionMatricula.fecha_matricula_inscripcion = new Date();

      const idUnico = await this.generateUniqueId(5);
      const nombreAlumno = inscripcionMatricula.primer_nombre_alumno.toUpperCase();

      inscripcionMatricula.id_inscripcion = idUnico.concat("-" + nombreAlumno);

      const correoHtml = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f0f0;
        }
        .container {
          background-color: #fff;
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #ccc;
        }
        .header {
          text-align: center;
        }
        .header h1 {
          color: #333;
          font-size: 20px;
          margin: 0;
        }
        .logo {
          width: 120px;
          display: block;
          margin: 20px auto 10px;
        }
        p {
          color: #333;
          font-size: 14px;
          line-height: 1.6;
        }
        .highlight-box {
          background-color: #e0e0e0;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
        .highlight-box .id-inscripcion {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
          }
          .highlight-box .label-inscripcion {
            font-weight: bold;
            font-size: 16px;
            color: #333;
        }
        .highlight-box .fecha-inscripcion {
          font-size: 16px;
          color: #000;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmación de Inscripción Matrícula</h1>
        </div>
        <p>Estimado(a) apoderado(a),</p>
        <p>Nos complace confirmar la inscripción de su hijo(a) <b>${inscripcionMatricula.primer_nombre_alumno} ${inscripcionMatricula.primer_apellido_alumno}</b> en nuestro colegio para el año 2025.</p>
        
        <div class="highlight-box">
          <p class="label-inscripcion">ID de Inscripción:</p>
          <p class="id-inscripcion">${inscripcionMatricula.id_inscripcion}</p>
        <div class="fecha-inscripcion"><strong>Fecha de Inscripción:</strong> ${inscripcionMatricula.fecha_matricula_inscripcion.toLocaleDateString()}</div>
        </div>
        
        <p>Recuerde que la matrícula se llevará a cabo en las siguientes fechas:</p>
        <ul>
          <li>Lunes 2 de diciembre (Prekinder a 2° básico)</li>
          <li>Martes 3 de diciembre (3° a 5° básico)</li>
          <li>Miércoles 4 de diciembre (6° a 8° básico)</li>
        </ul>
        
        <p>Es importante llevar su carnet y/o cédula de identidad el día de la matrícula.</p>
        <p>¡Bienvenidos a nuestra comunidad CACH!</p>

        <div class="footer">
          <img class="logo" src="https://www.colegioandeschile.cl/img/LOGOCOLEGIO.png" alt="Andes Chile Colegio">
          <p>Colegio Andes Chile - Educando con Amor ❤️</p>
        </div>
      </div>
    </body>
  </html>
`;

      const mailOptionsAdm = {
        from: 'contacto@colegioandeschile.cl',
        to: inscripcionMatricula.correo_apoderado,
        subject: 'Confirmación Inscripción Matricula',
        html: correoHtml,
      };

      try {
        await this.correoService.enviarCorreo(mailOptionsAdm);
        console.log('Correo enviado con éxito');
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }

      return await this.inscripcionMatriculaRepository.save(inscripcionMatricula);
    } catch (error) {
      this.logger.error(`Error creating InscripcionMatricula: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating the inscripcion matricula.',
        details: error.message,
        stack: error.stack,
      });
    }
  }

  async generateUniqueId(length: number): Promise<string> {
    let id: string;
    let exists: boolean;

    do {
      id = this.generateRandomId(length);
      exists = await this.inscripcionMatriculaRepository.findOne({ where: { id_inscripcion: id } }) ? true : false;
    } while (exists);

    return id;
  }

  generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async createMatricula(inscripcionMatricula: InscripcionDto): Promise<any> {
    try {

      const apoderado = this.apoderadoRepository.create(inscripcionMatricula);
      const savedApoderado = await this.apoderadoRepository.save(apoderado);
      const apoderadoSuplente = this.apoderadoSuplenteRepository.create(inscripcionMatricula);
      const savedApoderadoSuplente = await this.apoderadoSuplenteRepository.save(apoderadoSuplente);
  
      const savedEstudiantes = [];
      for (const estudianteData of inscripcionMatricula.estudiantes) {
        const estudiante = this.estudianteRepository.create(estudianteData);
        const savedEstudiante = await this.estudianteRepository.save(estudiante);
        savedEstudiantes.push(savedEstudiante);
  
        const apoderadoEstudiante = new ApoderadoEstudiante();
        apoderadoEstudiante.apoderado_id = savedApoderado.id;
        apoderadoEstudiante.estudiante_id = savedEstudiante.id;
        await this.apoderadoEstudianteRepository.save(apoderadoEstudiante);

        const apoderadoSuplenteEstudiante = new ApoderadoSuplenteEstudiante();
        apoderadoSuplenteEstudiante.apoderado_suplente_id = savedApoderadoSuplente.id;
        apoderadoSuplenteEstudiante.estudiante_id = savedEstudiante.id;
        await this.apoderadoSuplenteEstudianteRepository.save(apoderadoSuplenteEstudiante);
  
        const estudianteCurso = new EstudianteCurso();
        estudianteCurso.curso_id = estudianteData.cursoId;
        estudianteCurso.estudiante_id = savedEstudiante.id;
        await this.estudianteCursoRepository.save(estudianteCurso);
      }
  
      return {
        apoderado: savedApoderado,
        apoderadoSuplente: savedApoderadoSuplente,
        estudiantes: savedEstudiantes
      };

    } catch (error) {
      this.logger.error(`Error creating InscripcionMatricula: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating the inscripcion matricula.',
        details: error.message,
        stack: error.stack,
      });
    }
  }

  async remove(id: number): Promise<void> {
    await this.inscripcionMatriculaRepository.delete(id);
  }

}

