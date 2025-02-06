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
import { UsuarioService } from '../User/user.service';

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
    private readonly userService: UsuarioService,

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
      apoderado.primer_nombre_apoderado = apoderado.primer_nombre_apoderado.toUpperCase();
      apoderado.segundo_nombre_apoderado = apoderado.segundo_nombre_apoderado ? apoderado.segundo_nombre_apoderado.toUpperCase() : apoderado.segundo_nombre_apoderado;       
      apoderado.primer_apellido_apoderado = apoderado.primer_apellido_apoderado.toUpperCase();
      apoderado.segundo_apellido_apoderado = apoderado.segundo_apellido_apoderado.toUpperCase();
      apoderado.direccion = apoderado.direccion.toUpperCase();
      apoderado.rut =  apoderado.rut.replace(/\./g, '');
      const savedApoderado = await this.apoderadoRepository.save(apoderado);
      
      const apoderadoSuplente = this.apoderadoSuplenteRepository.create(inscripcionMatricula);
      apoderadoSuplente.primer_nombre_apoderado_suplente = apoderadoSuplente.primer_nombre_apoderado_suplente.toUpperCase();
      apoderadoSuplente.segundo_nombre_apoderado_suplente = apoderadoSuplente.segundo_nombre_apoderado_suplente ? apoderadoSuplente.segundo_nombre_apoderado_suplente.toUpperCase() : apoderadoSuplente.segundo_nombre_apoderado_suplente;  
      apoderadoSuplente.primer_apellido_apoderado_suplente = apoderadoSuplente.primer_apellido_apoderado_suplente.toUpperCase();
      apoderadoSuplente.segundo_apellido_apoderado_suplente = apoderadoSuplente.segundo_apellido_apoderado_suplente.toUpperCase();
      apoderadoSuplente.rut_apoderado_suplente = apoderadoSuplente.rut_apoderado_suplente.replace(/\./g, '');
      apoderadoSuplente.direccion_suplente = apoderadoSuplente.direccion_suplente.toUpperCase();
      const savedApoderadoSuplente = await this.apoderadoSuplenteRepository.save(apoderadoSuplente);

      const savedEstudiantes = [];
      for (const estudianteData of inscripcionMatricula.estudiantes) {
        const estudiante = this.estudianteRepository.create(estudianteData);
        estudiante.primer_nombre_alumno = estudiante.primer_nombre_alumno.toUpperCase();
        estudiante.segundo_nombre_alumno = estudiante.segundo_nombre_alumno ? estudiante.segundo_nombre_alumno.toUpperCase() : estudiante.segundo_nombre_alumno;      
        estudiante.primer_apellido_alumno = estudiante.primer_apellido_alumno.toUpperCase();
        estudiante.segundo_apellido_alumno = estudiante.segundo_apellido_alumno.toUpperCase();
        estudiante.rut = estudiante.rut.replace(/\./g, '');
        estudiante.fecha_matricula = new Date();
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

      const savedUser = await this.userService.createUserForApoderadoByRut(apoderado.rut);

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
              .highlight-box .label {
                font-size: 16px;
                color: #333;
                font-weight: bold;
              }
              .highlight-box .value {
                font-size: 18px;
                font-weight: bold;
                color: #000;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
              .download-links {
                margin: 20px 0;
                text-align: center;
              }
              .download-links a {
                display: inline-block;
                margin: 0 10px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s;
              }
              .download-links a:hover {
                background-color: #0056b3;
              }
              .normal-text {
                font-size: 14px;
                color: #333;
                line-height: 1.6;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Confirmación de Matricula y Creación de Usuario</h1>
              </div>
              <p>Estimado(a) apoderado(a),</p>
              <p>Nos complace confirmar la matrícula de ${inscripcionMatricula.estudiantes.length > 1 ? 'los siguientes estudiantes' : 'el siguiente estudiante'} en nuestro colegio para el año 2025:</p>
              <ul>
                ${savedEstudiantes.map(estudiante => `<li>${estudiante.primer_nombre_alumno} ${estudiante.primer_apellido_alumno}</li>`).join('')}
              </ul>
              <p>Estos son los datos de ingreso para nuestra app:</p>
              <div class="highlight-box">
                <p class="label">Usuario:</p>
                <p class="value">${savedUser.map(user => user.username).join(', ')}</p>
                <p class="label">Contraseña inicial:</p>
                <p class="value">andeschile2025</p>
                <p>Puede cambiar su contraseña directamente desde la aplicación Móvil Colegio Andes Chile App.</p>
              </div>
              <p>Pueden descargar la app en los siguientes enlaces para ambas plataformas:</p>
              <div class="download-links normal-text">
                <a href="https://play.google.com/store/apps/details?id=colegio.andes.chile.app&hl=es_CR&pli=1" target="_blank">Descargar para Android</a>
                <a href="https://apps.apple.com/cl/app/colegio-andes-chile/id6497167780" target="_blank">Descargar para iOS</a>
              </div>
              <p>Durante el año 2025, la app tendrá muchas sorpresas y actualizaciones. ¡Únete y conéctate con nuestra comunidad online!</p>
              <p>¡Bienvenidos a nuestra comunidad CACH!</p>
              <div class="footer normal-text">
                <img class="logo" src="https://www.colegioandeschile.cl/img/LOGOCOLEGIO.png" alt="Andes Chile Colegio">
                <p>Colegio Andes Chile - Educando con Amor ❤️</p>
              </div>
            </div>
          </body>
        </html>
      `;


      const mailOptionsAdm = {
        from: 'contacto@colegioandeschile.cl',
        to: savedApoderado.correo_apoderado,
        subject: 'Confirmación Inscripción Matricula',
        html: correoHtml,
      };

      try {
        await this.correoService.enviarCorreo(mailOptionsAdm);
        console.log('Correo enviado con éxito');
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }

      return {
        usuario: savedUser,
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

