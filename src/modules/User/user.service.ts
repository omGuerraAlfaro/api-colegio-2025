import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Profesor } from 'src/models/Profesor.entity';
import { Usuarios } from 'src/models/User.entity';
import { Repository } from 'typeorm';
import { Administrador } from 'src/models/Administrador.entity';
import { hash, compare } from 'bcrypt';
import { SubAdministrador } from 'src/models/SubAdministrador.entity';
import { ResetPasswordDto } from 'src/dto/login.dto';
import { CorreoService } from '../Correo/correo.service';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
    @InjectRepository(SubAdministrador)
    private readonly subAdministradorRepository: Repository<SubAdministrador>,
    private readonly correoService: CorreoService,
  ) { }

  async findAll(): Promise<Usuarios[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuarios[]> {
    return this.usuarioRepository.find({ where: { id: id } });
  }

  async findOneByRut(rut: string): Promise<Usuarios[]> {
    return this.usuarioRepository.find({ where: { rut: rut } });
  }

  async findUserWithApoderadoAndAlumnos(userId: number): Promise<Usuarios> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['apoderado', 'apoderado.estudiantesConnection', 'apoderado.estudiantesConnection.estudiante']
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.apoderado && user.profesor_id) {
      throw new NotFoundException('This user is a teacher (profesor), not a guardian (apoderado).');
    }

    // Transformar la estructura de estudiantesConnection para obtener solo los estudiantes
    if (user.apoderado) {
      user.apoderado.estudiantes = user.apoderado.estudiantesConnection.map(conn => conn.estudiante);
      delete user.apoderado.estudiantesConnection; // Eliminar la conexión para no enviarla en la respuesta
    }

    return user;
  }


  async findUserWithProfesor(userId: number): Promise<Usuarios> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['profesor']
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.profesor && user.apoderado_id) {
      throw new NotFoundException('This user is a (apoderado), not a (profesor).');
    }

    return user;
  }




  async createUsersForAllApoderados(): Promise<Usuarios[]> {
    const apoderados = await this.apoderadoRepository.find();
    const createdUsers: Usuarios[] = [];
    try {
      for (const apoderado of apoderados) {
        const username = apoderado.rut + '-' + apoderado.dv;
        const plainPassword = 'andeschile2025';
        const hashedPassword = await hash(plainPassword, 5);

        const existingUser = await this.usuarioRepository.findOne({ where: { username } });
        if (existingUser) {
          continue;
        }

        const usuario = new Usuarios();
        usuario.username = username;
        usuario.password = hashedPassword;
        usuario.correo_electronico = apoderado.correo_apoderado;
        usuario.apoderado_id = apoderado.id;
        usuario.rut = apoderado.rut;


        const savedUser = await this.usuarioRepository.save(usuario);
        createdUsers.push(savedUser);
      }
    } catch (error) {
      this.logger.error(`Error creating createUsersForAllApoderados: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating in createUsersForAllApoderados.',
        details: error.message,
        stack: error.stack,
      });
    }

    return createdUsers;
  }

  async createUserForApoderadoByRut(rut: string): Promise<Usuarios[]> {
    try {
      const apoderado = await this.apoderadoRepository.findOne({ where: { rut } });
      const userCreated: Usuarios[] = [];

      const username = apoderado.rut + '-' + apoderado.dv;
      const plainPassword = 'andeschile2025';
      const hashedPassword = await hash(plainPassword, 5);


      const usuario = new Usuarios();
      usuario.username = username;
      usuario.password = hashedPassword;
      usuario.correo_electronico = apoderado.correo_apoderado;
      usuario.apoderado_id = apoderado.id;
      usuario.rut = apoderado.rut;


      const savedUser = await this.usuarioRepository.save(usuario);
      userCreated.push(savedUser);

      return userCreated;
    } catch (error) {
      this.logger.error(`Error creating createUserForApoderadoByRut: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating in createUserForApoderadoByRut.',
        details: error.message,
        stack: error.stack,
      });
    }
  }

  async createUsersForAllProfesores(): Promise<Usuarios[]> {
    try {
      const profesores = await this.profesorRepository.find();
      const createdUsers: Usuarios[] = [];

      for (const profesor of profesores) {
        const usernameBase = this.generateUsername(profesor.primer_nombre, profesor.primer_apellido);
        const username = usernameBase + '.profesor';

        const existingUser = await this.usuarioRepository.findOne({
          where: [
            { username },
            { rut: profesor.rut }
          ]
        });

        if (existingUser) {
          this.logger.warn(`Usuario ya existe para profesor ${profesor.rut}, se omite.`);
          continue;
        }

        const plainPassword = profesor.rut;
        const hashedPassword = await hash(plainPassword, 5);

        const usuario = new Usuarios();
        usuario.username = username;
        usuario.password = hashedPassword;
        usuario.correo_electronico = profesor.correo_electronico;
        usuario.profesor_id = profesor.id;
        usuario.rut = profesor.rut;

        const savedUser = await this.usuarioRepository.save(usuario);
        createdUsers.push(savedUser);
      }

      return createdUsers;

    } catch (error) {
      this.logger.error(`Error al crear usuarios para profesores: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error al crear usuarios para profesores.',
        details: error.message,
        stack: error.stack,
      });
    }
  }

  async createUsersForAllAdministradores(): Promise<Usuarios[]> {
    try {
      const administradores = await this.administradorRepository.find();
      const createdUsers: Usuarios[] = [];

      for (const administrador of administradores) {
        const username = this.generateUsername(administrador.primer_nombre, administrador.primer_apellido);
        const plainPassword = administrador.rut;
        const hashedPassword = await hash(plainPassword, 5);

        const existingUser = await this.usuarioRepository.findOne({ where: { username } });
        if (existingUser) {
          continue;
        }

        const usuario = new Usuarios();
        usuario.username = username;
        usuario.password = hashedPassword;
        usuario.correo_electronico = administrador.correo_electronico;
        usuario.administrador_id = administrador.id;
        usuario.rut = administrador.rut;
        usuario.genero = administrador.genero;

        const savedUser = await this.usuarioRepository.save(usuario);
        createdUsers.push(savedUser);
      }

      return createdUsers;

    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating the user.',
        details: error.message,
        stack: error.stack,
      });
    }
  }

  async createUsersForAllSubAdministradores(): Promise<Usuarios[]> {
    try {
      const subAdministradores = await this.subAdministradorRepository.find();
      const createdUsers: Usuarios[] = [];

      for (const subAdministrador of subAdministradores) {
        const username = this.generateUsername(subAdministrador.primer_nombre, subAdministrador.primer_apellido);
        const plainPassword = subAdministrador.rut;
        const hashedPassword = await hash(plainPassword, 5);

        const existingUser = await this.usuarioRepository.findOne({ where: { username } });
        if (existingUser) {
          continue;
        }

        const usuario = new Usuarios();
        usuario.username = username;
        usuario.password = hashedPassword;
        usuario.correo_electronico = subAdministrador.correo_electronico;
        usuario.subAdministrador_id = subAdministrador.id;
        usuario.rut = subAdministrador.rut;
        usuario.genero = subAdministrador.genero;

        const savedUser = await this.usuarioRepository.save(usuario);
        createdUsers.push(savedUser);
      }

      return createdUsers;

    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating the user.',
        details: error.message,
        stack: error.stack,
      });
    }
  }


  private generateUsername(primerNombre: string, primerApellido: string): string {
    let baseUsername = `${primerNombre}.${primerApellido}`;
    baseUsername = baseUsername.toLowerCase();
    // Puedes agregar lógica adicional para manejar nombres de usuario duplicados
    return baseUsername;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usuarioRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await compare(oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('OLD_PASSWORD_INCORRECT', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;

    await this.usuarioRepository.save(user);
  }

  async resetPassword(userRut: string): Promise<void> {
    const user = await this.usuarioRepository.findOne({ where: { rut: userRut } });

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const newPassword = 'andeschile2025';
    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await this.usuarioRepository.save(user);
  }

  async UserResetPassword(
    dto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { rut, correo } = dto;
    const correoUpper = correo.trim().toUpperCase();

    const usuario = await this.usuarioRepository
      .createQueryBuilder('u')
      .where('u.username = :rut', { rut })
      .andWhere('UPPER(u.correo_electronico) = :correo', { correo: correoUpper })
      .getOne();

    if (!usuario) {
      throw new HttpException(
        'Rut o correo no válidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPassword = 'andeschile2025';
    const hashedPassword = await hash(newPassword, 10);
    usuario.password = hashedPassword;
    await this.usuarioRepository.save(usuario);


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
                <h1>Confirmación Restauración Contraseña</h1>
              </div>
              <p>Estimado(a) apoderado(a),</p>
              <p>Estos son los datos de ingreso para nuestra app:</p>
              <div class="highlight-box">
                <p class="label">Usuario:</p>
                <p class="value">${usuario.username}</p>
                <p class="label">Contraseña:</p>
                <p class="value">andeschile2025</p>
                <p>Puede cambiar su contraseña directamente desde la aplicación Móvil Colegio Andes Chile App.</p>
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

    const mailOptions = {
      from: 'contacto@colegioandeschile.cl',
      to: usuario.correo_electronico,
      subject: 'Confirmación Recuperación Contreseña',
      html: correoHtml,
    };

    try {
      await this.correoService.enviarCorreo(mailOptions);
      console.log('Correo enviado con éxito, UserResetPassword');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }

    return {
      success: true,
      message: 'Tu contraseña ha sido restablecida con éxito. Revisa tu correo para más detalles.',
    };
  }

}
