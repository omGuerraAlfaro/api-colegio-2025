import { Get, Injectable, InternalServerErrorException, Logger, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InscripcionMatricula } from 'src/models/InscripcionMatricula.entity';
import { CorreoService } from '../Correo/correo.service';

@Injectable()
export class InscripcionMatriculaService {
  private readonly logger = new Logger(InscripcionMatriculaService.name);

  constructor(
    @InjectRepository(InscripcionMatricula)
    private readonly inscripcionMatriculaRepository: Repository<InscripcionMatricula>,
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
                                  margin: 20px;
                                  padding: 20px;
                                  border: 1px solid #ddd;
                                  border-radius: 5px;
                                  background-color: #f9f9f9;
                                }
                                h1 {
                                  color: #333;
                                }
                                p {
                                  line-height: 1.6;
                                }
                                .footer {
                                  margin-top: 20px;
                                  font-size: 12px;
                                  color: #777;
                                }
                              </style>
                            </head>
                            <body>
                              <h1>Confirmación de Inscripción Matrícula</h1>
                              <p>Estimado(a) apoderado(a),</p>
                              <p>Nos complace confirmar la inscripción de su hijo(a) <strong>${inscripcionMatricula.primer_nombre_alumno}</strong> en nuestro colegio para el año 2025.</p>
                              <p>Detalles de la inscripción:</p>
                              <ul>
                                <li><strong>ID de Inscripción:</strong> ${inscripcionMatricula.id_inscripcion}</li>
                                <li><strong>Fecha de Inscripción:</strong> ${inscripcionMatricula.fecha_matricula_inscripcion.toLocaleDateString()}</li>
                              </ul>
                              <p>Recuerde que la matrícula se llevará a cabo en las siguientes fechas:</p>
                              <ul>
                                <li>Lunes 2 de diciembre (Prekinder a 2° básico)</li>
                                <li>Martes 3 de diciembre (3° a 5° básico)</li>
                                <li>Miércoles 4 de diciembre (6° a 8° básico)</li>
                              </ul>
                              <p>Es importante llevar su carnet y/o cédula de identidad el día de la matrícula.</p>
                              <p>¡Esperamos contar con su presencia y la de su hijo(a) en nuestra comunidad CACH!</p>
                              <p>Atentamente,<br />
                              El equipo de administración del Colegio Andes</p>
                              <div class="footer">
                                <p>Este es un correo automático, por favor no responda.</p>
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

  async remove(id: number): Promise<void> {
    await this.inscripcionMatriculaRepository.delete(id);
  }

}

