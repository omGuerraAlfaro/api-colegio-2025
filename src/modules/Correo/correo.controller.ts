import { Controller, Post, Body, UsePipes, ValidationPipe, Inject, Get, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CorreoService } from './correo.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostulacionDto } from 'src/dto/CreatePostulacionDto';

@Controller('correo')
export class CorreoController {

  constructor(private readonly correoSmtp: CorreoService) { }

  @Get('/smtp-info')
  async getInfoSmtp() {
    try {
      const smtpInfo = await this.correoSmtp.getCorreoSmtp();
      return smtpInfo;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('enviar-postulacion')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async enviarCorreo(@Body() formData: CreatePostulacionDto): Promise<any> {
    try {
      // Obtiene la configuración SMTP desde tu servicio
      const smtpInfo = await this.correoSmtp.getCorreoSmtp();
      const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

      // Configuración del transporte Nodemailer
      const transporter = nodemailer.createTransport({
        host: host_smtp,
        port: port_smtp,
        secure: true,
        auth: {
          user: user_smtp,
          pass: pass_smtp,
        },
      });

      // Desestructuramos formData
      const {
        apoderado,
        rut,
        direccion,
        comuna,
        telefono,
        email,
        pupilo,
        edad,
        cursoPostula,
        colegioOrigen,
        motivosCambio,
        expectativas,
        comentarios,
        consentimiento
      } = formData;

      // Construimos el HTML completo del correo, siempre listando todas las opciones
      const correoHtml = `
      <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Formulario de Postulación 2026</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f4f4f4;
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #fff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: #C1272D;
              padding: 20px;
              text-align: center;
            }
            .header img {
              max-height: 60px;
            }
            .header h2 {
              margin: 8px 0 0;
              color: #fff;
              font-size: 18px;
            }
            .content {
              padding: 20px;
              color: #333;
              font-size: 14px;
              line-height: 1.6;
              border: 1px solid #eee;
            }
            .content ul {
              padding-left: 20px;
            }
            .content li {
              margin-bottom: 8px;
            }
            .section {
              margin: 20px 0;
            }
            .section strong {
              color: #00285C;
            }
            .footer {
              background: #eee;
              padding: 15px 20px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .footer a {
              color: #C1272D;
              text-decoration: none;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <img src="https://www.colegioandeschile.cl/img/LOGOCOLEGIO.png" alt="Logo Colegio Andes Chile" />
              <h2>Formulario de Postulación 2026</h2>
              <h2>Colegio Andes Chile</h2>
            </div>

            <div class="content">
              <!-- Información del Apoderado -->
              <div class="section">
                <h5><strong>Información del Apoderado</strong></h5>
                <ul>
                  <li><strong>Nombre apoderado:</strong> ${apoderado}</li>
                  <li><strong>RUT:</strong> ${rut}</li>
                  <li><strong>Dirección:</strong> ${direccion}</li>
                  <li><strong>Comuna:</strong> ${comuna}</li>
                  <li><strong>Teléfono:</strong> ${telefono}</li>
                  <li><strong>Email:</strong> ${email}</li>
                </ul>
              </div>

              <!-- Información del Estudiante -->
              <div class="section">
                <h5><strong>Información del Estudiante</strong></h5>
                <ul>
                  <li><strong>Nombre estudiante:</strong> ${pupilo}</li>
                  <li><strong>Edad:</strong> ${edad}</li>
                  <li><strong>Curso al que postula:</strong> ${cursoPostula}</li>
                  <li><strong>Colegio de procedencia:</strong> ${colegioOrigen}</li>
                </ul>
              </div>

              <!-- Motivos del Cambio de Colegio -->
              <div class="section">
                <h5><strong>Motivos del Cambio de Colegio</strong></h5>
                <ul>
                  <li>Proyecto educativo&nbsp;&nbsp;${motivosCambio.proyecto ? '✓' : ''}</li>
                  <li>Dificultades de disciplina&nbsp;&nbsp;${motivosCambio.disciplina ? '✓' : ''}</li>
                  <li>Dificultades académicas&nbsp;&nbsp;${motivosCambio.academicas ? '✓' : ''}</li>
                  <li>Cambio de domicilio&nbsp;&nbsp;${motivosCambio.domicilio ? '✓' : ''}</li>
                  <li>
                    Otro: ${motivosCambio.otroText ?? '—'}&nbsp;&nbsp;
                    ${motivosCambio.otro && motivosCambio.otroText ? '✓' : ''}
                  </li>
                </ul>
              </div>

              <!-- Expectativas del Proyecto Educativo -->
              <div class="section">
                <h5><strong>Expectativas del Proyecto Educativo</strong></h5>
                <ul>
                  <li>Formación académica de calidad&nbsp;&nbsp;${expectativas.academica ? '✓' : ''}</li>
                  <li>Educación en valores y principios&nbsp;&nbsp;${expectativas.valores ? '✓' : ''}</li>
                  <li>Desarrollo socioemocional&nbsp;&nbsp;${expectativas.socioemocional ? '✓' : ''}</li>
                  <li>Espacios para potenciar talentos&nbsp;&nbsp;${expectativas.talentos ? '✓' : ''}</li>
                  <li>
                    Otro: ${expectativas.otroExpText ?? '—'}&nbsp;&nbsp;
                    ${expectativas.otroExp && expectativas.otroExpText ? '✓' : ''}
                  </li>
                </ul>
              </div>

              <!-- Comentarios Adicionales -->
              <div class="section">
                <h5><strong>Comentarios adicionales</strong></h5>
                <p>${comentarios ?? '—'}</p>
              </div>

              <!-- Declaración y autorización -->
              <div class="section">
                <h5><strong>Declaración y autorización</strong></h5>
                <p>${consentimiento ? '✓ Autorizado' : '✗ No autorizado'}</p>
              </div>
            </div>

            <div class="footer">
              Colegio Andes Chile – <em>Educando con Amor ❤️</em>
            </div>
          </div>
        </body>
        </html>
      `;

      // Opciones del correo
      const mailOptions = {
        from: user_smtp,
        to: 'omar.guerra@outlook.cl',
        subject: 'Nueva postulación - Colegio Andes de Chile',
        html: correoHtml,
      };

      // Envía el correo
      const result = await transporter.sendMail(mailOptions);

      return {
        message: 'Correo enviado con éxito',
        result,
      };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
    }
  }


  // @Post('/enviar')
  // @UsePipes(new ValidationPipe())
  // async enviarCorreo(@Body() formData: any): Promise<any> {
  //   try {
  //     const smtpInfo = await this.correoSmtp.getCorreoSmtp();
  //     const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

  //     // Configuración del transporte de correo usando Nodemailer
  //     const transporter = nodemailer.createTransport({
  //       host: host_smtp,
  //       port: port_smtp,
  //       secure: true,
  //       auth: {
  //         user: user_smtp,
  //         pass: pass_smtp
  //       }
  //     });

  //     // Construye el cuerpo del correo con los datos del formulario
  //     const correoHtml = `
  //       <h4><strong>Formulario Admisión 2024</strong></h4>
  //       <p><strong>Nombre completo del postulante:</strong> ${formData.pupilo}</p>
  //       <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
  //       <p><strong>Curso al que postula:</strong> ${formData.cursoPostula}</p>
  //       <p><strong>Teléfono:</strong> ${formData.telefono}</p>
  //       <p><strong>Email:</strong> ${formData.email}</p>
  //       <p><strong>Colegio o Jardín de procedencia:</strong> ${formData.colegio}</p>
  //       <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
  //     `;

  //     // Opciones del correo
  //     const mailOptions = {
  //       from: user_smtp,
  //       to: 'omar.guerra@outlook.cl',
  //       subject: 'Postulación Colegio Andes de Chile',
  //       html: correoHtml,
  //     };

  //     // Envía el correo
  //     const result = await transporter.sendMail(mailOptions);

  //     // Devuelve una respuesta de éxito
  //     return { message: 'Correo enviado con éxito', result };
  //   } catch (error) {
  //     console.error('Error al enviar el correo:', error);
  //     throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
  //   }
  // }
  @Post('/enviar/verano')
  @UsePipes(new ValidationPipe())
  async enviarCorreoVerano(@Body() formData: any): Promise<any> {
    try {
      const smtpInfo = await this.correoSmtp.getCorreoSmtp();
      const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

      // Configuración del transporte de correo usando Nodemailer
      const transporter = nodemailer.createTransport({
        host: host_smtp,
        port: port_smtp,
        secure: true,
        auth: {
          user: user_smtp,
          pass: pass_smtp
        }
      });

      // Construye el cuerpo del correo con los datos del formulario
      const correoHtml = `
        <h4><strong>Formulario Escuela de Verano</strong></h4>
        <p><strong>Nombre completo del postulante:</strong> ${formData.pupilo}</p>
        <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
        <p><strong>Dirección:</strong> ${formData.direccion}</p>
        <p><strong>Teléfono:</strong> ${formData.telefono}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
      `;

      // Opciones del correo
      const mailOptions = {
        from: user_smtp,
        to: 'omar.guerra@outlook.cl',
        subject: 'Postulación Escuela de Verano Colegio Andes de Chile',
        html: correoHtml,
      };

      // Envía el correo
      const result = await transporter.sendMail(mailOptions);

      // Devuelve una respuesta de éxito
      return { message: 'Correo enviado con éxito', result };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
    }
  }

  @Post('/enviar/taller')
  @UsePipes(new ValidationPipe())
  async enviarCorreoTaller(@Body() formData: any): Promise<any> {
    try {
      const smtpInfo = await this.correoSmtp.getCorreoSmtp();
      const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

      // Configuración del transporte de correo usando Nodemailer
      const transporter = nodemailer.createTransport({
        host: host_smtp,
        port: port_smtp,
        secure: true,
        auth: {
          user: user_smtp,
          pass: pass_smtp
        }
      });

      // Construye el cuerpo del correo con los datos del formulario
      const correoHtml = `
        <h4><strong>Formulario inscripción Talleres 2024</strong></h4>
        <p><strong>Nombre completo del alumno/a:</strong> ${formData.pupilo}</p>
        <p><strong>Curso al que postula:</strong> ${formData.cursoPostula}</p>
        <p><strong>Taller al que postula:</strong> ${formData.tallerPostula}</p>
        <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
        <p><strong>Teléfono:</strong> ${formData.telefono}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
      `;

      // Opciones del correo
      const mailOptions = {
        from: user_smtp,
        to: 'omar.guerra@outlook.cl',
        subject: 'Inscripción Talleres 2024 Colegio Andes de Chile',
        html: correoHtml,
      };

      // Envía el correo
      const result = await transporter.sendMail(mailOptions);

      // Devuelve una respuesta de éxito
      return { message: 'Correo enviado con éxito', result };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
    }
  }
}
