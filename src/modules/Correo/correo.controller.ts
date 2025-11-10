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

  // @Post('enviar-postulacion')
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  // async enviarCorreo(@Body() formData: CreatePostulacionDto): Promise<any> {
  //   try {
  //     // Obtiene la configuración SMTP desde tu servicio
  //     const smtpInfo = await this.correoSmtp.getCorreoSmtp();
  //     const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

  //     // Configuración del transporte Nodemailer
  //     const transporter = nodemailer.createTransport({
  //       host: host_smtp,
  //       port: port_smtp,
  //       secure: true,
  //       auth: {
  //         user: user_smtp,
  //         pass: pass_smtp,
  //       },
  //     });

  //     // Desestructuramos formData
  //     const {
  //       apoderado,
  //       rut,
  //       direccion,
  //       comuna,
  //       telefono,
  //       email,
  //       pupilo,
  //       edad,
  //       cursoPostula,
  //       colegioOrigen,
  //       motivosCambio,
  //       expectativas,
  //       comentarios,
  //       consentimiento
  //     } = formData;

  //     // Construimos el HTML completo del correo, siempre listando todas las opciones
  //     const correoHtml = `
  //     <!DOCTYPE html>
  //       <html lang="es">
  //       <head>
  //         <meta charset="UTF-8" />
  //         <title>Formulario de Postulación 2026</title>
  //         <style>
  //           body {
  //             margin: 0;
  //             padding: 0;
  //             background: #f4f4f4;
  //             font-family: Arial, sans-serif;
  //           }
  //           .container {
  //             max-width: 600px;
  //             margin: 20px auto;
  //             background: #fff;
  //             border-radius: 8px;
  //             overflow: hidden;
  //             box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  //           }
  //           .header {
  //             background: #C1272D;
  //             padding: 20px;
  //             text-align: center;
  //           }
  //           .header img {
  //             max-height: 60px;
  //           }
  //           .header h2 {
  //             margin: 8px 0 0;
  //             color: #fff;
  //             font-size: 18px;
  //           }
  //           .content {
  //             padding: 20px;
  //             color: #333;
  //             font-size: 14px;
  //             line-height: 1.6;
  //             border: 1px solid #eee;
  //           }
  //           .content ul {
  //             padding-left: 20px;
  //           }
  //           .content li {
  //             margin-bottom: 8px;
  //           }
  //           .section {
  //             margin: 20px 0;
  //           }
  //           .section strong {
  //             color: #00285C;
  //           }
  //           .footer {
  //             background: #eee;
  //             padding: 15px 20px;
  //             font-size: 12px;
  //             color: #666;
  //             text-align: center;
  //           }
  //           .footer a {
  //             color: #C1272D;
  //             text-decoration: none;
  //           }
  //         </style>
  //       </head>

  //       <body>
  //         <div class="container">
  //           <div class="header">
  //             <img src="https://www.colegioandeschile.cl/img/LOGOCOLEGIO.png" alt="Logo Colegio Andes Chile" />
  //             <h2>Formulario de Postulación 2026</h2>
  //             <h2>Colegio Andes Chile</h2>
  //           </div>

  //           <div class="content">
  //             <!-- Información del Apoderado -->
  //             <div class="section">
  //               <h5><strong>Información del Apoderado</strong></h5>
  //               <ul>
  //                 <li><strong>Nombre apoderado:</strong> ${apoderado}</li>
  //                 <li><strong>RUT:</strong> ${rut}</li>
  //                 <li><strong>Dirección:</strong> ${direccion}</li>
  //                 <li><strong>Comuna:</strong> ${comuna}</li>
  //                 <li><strong>Teléfono:</strong> ${telefono}</li>
  //                 <li><strong>Email:</strong> ${email}</li>
  //               </ul>
  //             </div>

  //             <!-- Información del Estudiante -->
  //             <div class="section">
  //               <h5><strong>Información del Estudiante</strong></h5>
  //               <ul>
  //                 <li><strong>Nombre estudiante:</strong> ${pupilo}</li>
  //                 <li><strong>Edad:</strong> ${edad}</li>
  //                 <li><strong>Curso al que postula:</strong> ${cursoPostula}</li>
  //                 <li><strong>Colegio de procedencia:</strong> ${colegioOrigen}</li>
  //               </ul>
  //             </div>

  //             <!-- Motivos del Cambio de Colegio -->
  //             <div class="section">
  //               <h5><strong>Motivos del Cambio de Colegio</strong></h5>
  //               <ul>
  //                 <li>Proyecto educativo&nbsp;&nbsp;${motivosCambio.proyecto ? '✓' : ''}</li>
  //                 <li>Dificultades de disciplina&nbsp;&nbsp;${motivosCambio.disciplina ? '✓' : ''}</li>
  //                 <li>Dificultades académicas&nbsp;&nbsp;${motivosCambio.academicas ? '✓' : ''}</li>
  //                 <li>Cambio de domicilio&nbsp;&nbsp;${motivosCambio.domicilio ? '✓' : ''}</li>
  //                 <li>
  //                   Otro: ${motivosCambio.otroText ?? '—'}&nbsp;&nbsp;
  //                   ${motivosCambio.otro && motivosCambio.otroText ? '✓' : ''}
  //                 </li>
  //               </ul>
  //             </div>

  //             <!-- Expectativas del Proyecto Educativo -->
  //             <div class="section">
  //               <h5><strong>Expectativas del Proyecto Educativo</strong></h5>
  //               <ul>
  //                 <li>Formación académica de calidad&nbsp;&nbsp;${expectativas.academica ? '✓' : ''}</li>
  //                 <li>Educación en valores y principios&nbsp;&nbsp;${expectativas.valores ? '✓' : ''}</li>
  //                 <li>Desarrollo socioemocional&nbsp;&nbsp;${expectativas.socioemocional ? '✓' : ''}</li>
  //                 <li>Espacios para potenciar talentos&nbsp;&nbsp;${expectativas.talentos ? '✓' : ''}</li>
  //                 <li>
  //                   Otro: ${expectativas.otroExpText ?? '—'}&nbsp;&nbsp;
  //                   ${expectativas.otroExp && expectativas.otroExpText ? '✓' : ''}
  //                 </li>
  //               </ul>
  //             </div>

  //             <!-- Comentarios Adicionales -->
  //             <div class="section">
  //               <h5><strong>Comentarios adicionales</strong></h5>
  //               <p>${comentarios ?? '—'}</p>
  //             </div>

  //             <!-- Declaración y autorización -->
  //             <div class="section">
  //               <h5><strong>Declaración y autorización</strong></h5>
  //               <p>${consentimiento ? '✓ Autorizado' : '✗ No autorizado'}</p>
  //             </div>
  //           </div>

  //           <div class="footer">
  //             Colegio Andes Chile – <em>Educando con Amor ❤️</em>
  //           </div>
  //         </div>
  //       </body>
  //       </html>
  //     `;

  //     const correoHtmlApoderado = `
  //     <!DOCTYPE html>
  //     <html lang="es">
  //     <head>
  //       <meta charset="UTF-8" />
  //       <title>Formulario de Postulación 2026</title>
  //       <style>
  //         body {
  //           margin: 0;
  //           padding: 0;
  //           background: #f4f4f4;
  //           font-family: Arial, sans-serif;
  //         }
  //         .container {
  //           max-width: 600px;
  //           margin: 20px auto;
  //           background: #fff;
  //           border-radius: 8px;
  //           overflow: hidden;
  //           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  //         }
  //         .header {
  //           background: #C1272D;
  //           padding: 20px;
  //           text-align: center;
  //         }
  //         .header img {
  //           max-height: 60px;
  //         }
  //         .header h2 {
  //           margin: 8px 0 0;
  //           color: #fff;
  //           font-size: 18px;
  //         }
  //         .content {
  //           padding: 20px;
  //           color: #333;
  //           font-size: 14px;
  //           line-height: 1.6;
  //           border: 1px solid #eee;
  //         }
  //         .content ul {
  //           padding-left: 20px;
  //         }
  //         .content li {
  //           margin-bottom: 8px;
  //         }
  //         .section {
  //           margin: 20px 0;
  //         }
  //         .section strong {
  //           color: #00285C;
  //         }
  //         .footer {
  //           background: #eee;
  //           padding: 15px 20px;
  //           font-size: 12px;
  //           color: #666;
  //           text-align: center;
  //         }
  //         .footer a {
  //           color: #C1272D;
  //           text-decoration: none;
  //         }
  //       </style>
  //     </head>

  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <img src="https://www.colegioandeschile.cl/img/LOGOCOLEGIO.png" alt="Logo Colegio Andes Chile" />
  //           <h2>Formulario de Postulación 2026</h2>
  //           <h2>Colegio Andes Chile</h2>
  //         </div>

  //         <div class="content">
  //           <!-- Texto de presentación -->
  //           <div class="section">
  //             <p>Reciba un cordial saludo del <strong>Colegio Andes Chile (CACH)</strong>.</p>
  //             <p>Nos alegra mucho que estés interesado en conocer más sobre nuestro proyecto educativo y formar parte de nuestra comunidad.</p>
  //             <p>En CACH, creemos firmemente en una educación personalizada y de calidad, donde cada estudiante es protagonista de su aprendizaje, acompañado siempre por un equipo comprometido y cercano, en un ambiente familiar y acogedor.</p>
              
  //             <p>✨ <strong>¿Por qué elegirnos?</strong></p>
  //             <ul>
  //               <li>Máximo de 26 alumnos por sala, lo que permite un seguimiento individualizado.</li>
  //               <li>Inglés intensivo desde Pre Básica hasta Primer Año Medio.</li>
  //               <li>Apoyo constante con asistentes de la educación desde Pre Kínder a 2° Básico.</li>
  //               <li>Más de 20 talleres extracurriculares académicos, deportivos y artísticos.</li>
  //               <li>Refuerzos académicos con docentes especializados.</li>
  //               <li>Aplicación escolar móvil para pagos, asistencia, notas, certificados y libro de clases digital.</li>
  //             </ul>

  //             <p>🕒 <strong>Horarios académicos</strong></p>
  //             <ul>
  //               <li>Pre Kínder y Kínder: 08:15 a 13:15 hrs.</li>
  //               <li>Talleres Párvulos: martes y jueves de 13:15 a 14:15 hrs.</li>
  //               <li>1° a 8° Básico: 08:15 a 14:15 hrs.</li>
  //               <li>1° Medio: 8:15 a 15:45 (viernes 8:15 a 14:15)</li>
  //               <li>Talleres Básica: lunes a viernes, 14:45 a 15:45 hrs.</li>
  //             </ul>

  //             <p>💲 <strong>Aranceles 2026</strong></p>
  //             <ul>
  //               <li>Matrícula: $270.000</li>
  //               <li>Mensualidad Pre Kínder y Kínder: $220.000</li>
  //               <li>Mensualidad 1° Básico a 1° Medio: $240.000</li>
  //             </ul>

  //             <p>Gracias por su postulación. Nuestra encargada de admisión se pondrá en contacto con usted vía telefónica y agendará una entrevista.</p>
  //             <p>Nos encantaría que seas parte de esta gran familia educativa. Estamos aquí para acompañarte en cada paso del proceso de admisión 2026.</p>
  //             <p><strong>¡Te esperamos con los brazos abiertos!</strong></p>
  //           </div>

  //           <!-- Información del Apoderado -->
  //           <div class="section">
  //             <h5><strong>Información del Apoderado</strong></h5>
  //             <ul>
  //               <li><strong>Nombre apoderado:</strong> ${apoderado}</li>
  //               <li><strong>RUT:</strong> ${rut}</li>
  //               <li><strong>Dirección:</strong> ${direccion}</li>
  //               <li><strong>Comuna:</strong> ${comuna}</li>
  //               <li><strong>Teléfono:</strong> ${telefono}</li>
  //               <li><strong>Email:</strong> ${email}</li>
  //             </ul>
  //           </div>

  //           <!-- Información del Estudiante -->
  //           <div class="section">
  //             <h5><strong>Información del Estudiante</strong></h5>
  //             <ul>
  //               <li><strong>Nombre estudiante:</strong> ${pupilo}</li>
  //               <li><strong>Edad:</strong> ${edad}</li>
  //               <li><strong>Curso al que postula:</strong> ${cursoPostula}</li>
  //               <li><strong>Colegio de procedencia:</strong> ${colegioOrigen}</li>
  //             </ul>
  //           </div>

  //           <!-- Motivos del Cambio de Colegio -->
  //           <div class="section">
  //             <h5><strong>Motivos del Cambio de Colegio</strong></h5>
  //             <ul>
  //               <li>Proyecto educativo&nbsp;&nbsp;${motivosCambio.proyecto ? '✓' : ''}</li>
  //               <li>Dificultades de disciplina&nbsp;&nbsp;${motivosCambio.disciplina ? '✓' : ''}</li>
  //               <li>Dificultades académicas&nbsp;&nbsp;${motivosCambio.academicas ? '✓' : ''}</li>
  //               <li>Cambio de domicilio&nbsp;&nbsp;${motivosCambio.domicilio ? '✓' : ''}</li>
  //               <li>
  //                 Otro: ${motivosCambio.otroText ?? '—'}&nbsp;&nbsp;
  //                 ${motivosCambio.otro && motivosCambio.otroText ? '✓' : ''}
  //               </li>
  //             </ul>
  //           </div>

  //           <!-- Expectativas del Proyecto Educativo -->
  //           <div class="section">
  //             <h5><strong>Expectativas del Proyecto Educativo</strong></h5>
  //             <ul>
  //               <li>Formación académica de calidad&nbsp;&nbsp;${expectativas.academica ? '✓' : ''}</li>
  //               <li>Educación en valores y principios&nbsp;&nbsp;${expectativas.valores ? '✓' : ''}</li>
  //               <li>Desarrollo socioemocional&nbsp;&nbsp;${expectativas.socioemocional ? '✓' : ''}</li>
  //               <li>Espacios para potenciar talentos&nbsp;&nbsp;${expectativas.talentos ? '✓' : ''}</li>
  //               <li>
  //                 Otro: ${expectativas.otroExpText ?? '—'}&nbsp;&nbsp;
  //                 ${expectativas.otroExp && expectativas.otroExpText ? '✓' : ''}
  //               </li>
  //             </ul>
  //           </div>

  //           <!-- Comentarios Adicionales -->
  //           <div class="section">
  //             <h5><strong>Comentarios adicionales</strong></h5>
  //             <p>${comentarios ?? '—'}</p>
  //           </div>

  //           <!-- Declaración y autorización -->
  //           <div class="section">
  //             <h5><strong>Declaración y autorización</strong></h5>
  //             <p>${consentimiento ? '✓ Autorizado' : '✗ No autorizado'}</p>
  //           </div>
  //         </div>

  //         <div class="footer">
  //           Colegio Andes Chile – <em>Educando con Amor ❤️</em>
  //         </div>
  //       </div>
  //     </body>
  //     </html>
  //     `;


  //     // Opciones del correo
  //     const mailOptions = {
  //       from: user_smtp,
  //       to: 'omar.guerra@outlook.cl',
  //       subject: 'Nueva postulación - Colegio Andes de Chile',
  //       html: correoHtml,
  //     };

  //     // Envía el correo
  //     const result = await transporter.sendMail(mailOptions);

  //     return {
  //       message: 'Correo enviado con éxito',
  //       result,
  //     };
  //   } catch (error) {
  //     console.error('Error al enviar el correo:', error);
  //     throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
  //   }
  // }

  @Post('enviar-postulacion')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async enviarCorreo(@Body() formData: CreatePostulacionDto): Promise<any> {
    try {
      // 1) Config SMTP
      const smtpInfo = await this.correoSmtp.getCorreoSmtp();
      const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

      const transporter = nodemailer.createTransport({
        host: host_smtp,
        port: port_smtp,
        secure: Number(port_smtp) === 465, // SSL sólo si es 465
        auth: { user: user_smtp, pass: pass_smtp },
        tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      });

      // 2) Datos
      const {
        apoderado,
        rut,
        direccion,
        comuna,
        telefono,
        email,
        ocupacion,
        pupilo,
        edad,
        cursoPostula,
        colegioOrigen,
        necesidadEducativa,
        motivosCambio,
        expectativas,
        comentarios,
        consentimiento,
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
                  <li><strong>Ocupación:</strong> ${ocupacion}</li>
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
                  <li><strong>Necesidad educativa especial:</strong> ${necesidadEducativa ? necesidadEducativa.detalle : 'No'}</li>
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

      const correoHtmlApoderado = `
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
            <!-- Texto de presentación -->
            <div class="section">
              <p>Reciba un cordial saludo del <strong>Colegio Andes Chile (CACH)</strong>.</p>
              <p>Nos alegra mucho que estés interesado en conocer más sobre nuestro proyecto educativo y formar parte de nuestra comunidad.</p>
              <p>En CACH, creemos firmemente en una educación personalizada y de calidad, donde cada estudiante es protagonista de su aprendizaje, acompañado siempre por un equipo comprometido y cercano, en un ambiente familiar y acogedor.</p>
              
              <p>✨ <strong>¿Por qué elegirnos?</strong></p>
              <ul>
                <li>Máximo de 26 alumnos por sala, lo que permite un seguimiento individualizado.</li>
                <li>Inglés intensivo desde Pre Básica hasta Primer Año Medio.</li>
                <li>Apoyo constante con asistentes de la educación desde Pre Kínder a 2° Básico.</li>
                <li>Más de 20 talleres extracurriculares académicos, deportivos y artísticos.</li>
                <li>Refuerzos académicos con docentes especializados.</li>
                <li>Aplicación escolar móvil para pagos, asistencia, notas, certificados y libro de clases digital.</li>
              </ul>

              <p>🕒 <strong>Horarios académicos</strong></p>
              <ul>
                <li>Pre Kínder y Kínder: 08:15 a 13:15 hrs.</li>
                <li>Talleres Párvulos: martes y jueves de 13:15 a 14:15 hrs.</li>
                <li>1° a 8° Básico: 08:15 a 14:15 hrs.</li>
                <li>1° Medio: 8:15 a 15:45 (viernes 8:15 a 14:15)</li>
                <li>Talleres Básica: lunes a viernes, 14:45 a 15:45 hrs.</li>
              </ul>

              <p>💲 <strong>Aranceles 2026</strong></p>
              <ul>
                <li>Matrícula: $270.000</li>
                <li>Mensualidad Pre Kínder y Kínder: $220.000</li>
                <li>Mensualidad 1° Básico a 1° Medio: $240.000</li>
              </ul>

              <p>Gracias por su postulación. Nuestra encargada de admisión se pondrá en contacto con usted vía telefónica y agendará una entrevista.</p>
              <p>Nos encantaría que seas parte de esta gran familia educativa. Estamos aquí para acompañarte en cada paso del proceso de admisión 2026.</p>
              <p><strong>¡Te esperamos con los brazos abiertos!</strong></p>
            </div>

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
                <li><strong>Ocupación:</strong> ${ocupacion}</li>
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
                <li><strong>Necesidad educativa especial:</strong> ${necesidadEducativa ? necesidadEducativa.detalle : 'No'}</li>
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

      // 4) Texto alternativo (deliverability)
      const textInterno =
        `Nueva postulación - Colegio Andes Chile
        Apoderado: ${apoderado} (${rut})
        Dirección: ${direccion}, ${comuna}
        Teléfono: ${telefono} | Email: ${email}
        Estudiante: ${pupilo} | Edad: ${edad}
        Curso postula: ${cursoPostula}
        Colegio origen: ${colegioOrigen}
        Comentarios: ${comentarios ?? '—'}
        Consentimiento: ${consentimiento ? 'Autorizado' : 'No autorizado'}`;

      const textApoderado =
              `Hola ${apoderado},
      Hemos recibido tu postulación para ${pupilo} al curso ${cursoPostula}.
      Pronto te contactaremos para agendar entrevista.
      Saludos, Colegio Andes Chile (CACH).`;

      // 5) Destinatarios
      const CORREO_INTERNO = 'omar.guerra@outlook.cl';

      // 6) Opciones de los dos correos
      const mailToColegio: nodemailer.SendMailOptions = {
        from: `"Colegio Andes Chile" <${user_smtp}>`,
        to: CORREO_INTERNO,
        subject: 'Nueva postulación - Colegio Andes Chile',
        html: correoHtml,
        text: textInterno,
        replyTo: email || undefined, // para responder al apoderado
      };

      const mailToApoderado: nodemailer.SendMailOptions = {
        from: `"Colegio Andes Chile" <${user_smtp}>`,
        to: email,
        subject: 'Recepción de postulación - Colegio Andes Chile',
        html: correoHtmlApoderado,
        text: textApoderado,
        replyTo: 'colegioandeschile@gmail.com',
      };

      // 7) Enviar ambos en paralelo
      const [resColegio, resApoderado] = await Promise.all([
        transporter.sendMail(mailToColegio),
        transporter.sendMail(mailToApoderado),
      ]);

      return {
        message: 'Correos enviados con éxito',
        interno: { accepted: resColegio.accepted, rejected: resColegio.rejected, messageId: resColegio.messageId },
        apoderado: { accepted: resApoderado.accepted, rejected: resApoderado.rejected, messageId: resApoderado.messageId },
      };
    } catch (error) {
      console.error('Error al enviar los correos:', error);
      throw new Error('Hubo un problema al enviar los correos. Por favor, intenta nuevamente.');
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
