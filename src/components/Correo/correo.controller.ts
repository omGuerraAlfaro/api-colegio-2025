import { Controller, Post, Body, UsePipes, ValidationPipe, Inject, Get, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CorreoService } from './correo.service';
import { ApiTags } from '@nestjs/swagger';

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


  @Post('/enviar')
  @UsePipes(new ValidationPipe())
  async enviarCorreo(@Body() formData: any): Promise<any> {
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
        <h4><strong>Formulario Admisión 2024</strong></h4>
        <p><strong>Nombre completo del postulante:</strong> ${formData.pupilo}</p>
        <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
        <p><strong>Curso al que postula:</strong> ${formData.cursoPostula}</p>
        <p><strong>Teléfono:</strong> ${formData.telefono}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Colegio o Jardín de procedencia:</strong> ${formData.colegio}</p>
        <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
      `;

      // Opciones del correo
      const mailOptions = {
        from: user_smtp,
        to: 'omar.guerra@outlook.cl',
        subject: 'Postulación Colegio Andes de Chile',
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
