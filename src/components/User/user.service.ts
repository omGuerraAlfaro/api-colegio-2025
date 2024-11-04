import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Profesor } from 'src/models/Profesor.entity';
import { Usuarios } from 'src/models/User.entity';
import { Repository } from 'typeorm';
import { Administrador } from 'src/models/Administrador.entity';
import { hash, compare } from 'bcrypt';
import { SubAdministrador } from 'src/models/SubAdministrador.entity';

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

    for (const apoderado of apoderados) {
      const username = this.generateUsername(apoderado.primer_nombre_apoderado, apoderado.primer_apellido_apoderado);
      const plainPassword = apoderado.rut;
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

    return createdUsers;
  }

  async createUserForApoderadoByRut(rut: string): Promise<Usuarios[]> {
    try {
      const apoderado = await this.apoderadoRepository.findOne({ where: { rut } });
      const userCreated: Usuarios[] = [];

      const username = apoderado.rut +'-'+apoderado.dv;
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
        const username = this.generateUsername(profesor.primer_nombre, profesor.primer_apellido);
        const plainPassword = profesor.rut;
        const hashedPassword = await hash(plainPassword, 5);

        const existingUser = await this.usuarioRepository.findOne({ where: { username } });
        if (existingUser) {
          // Si el usuario ya existe, puedes decidir saltarte este profesor o actualizar el usuario existente.
          continue;
        }

        const usuario = new Usuarios();
        usuario.username = username + '.profesor';
        usuario.password = hashedPassword;
        usuario.correo_electronico = profesor.correo_electronico;
        usuario.profesor_id = profesor.id;
        usuario.rut = profesor.rut;

        const savedUser = await this.usuarioRepository.save(usuario);
        createdUsers.push(savedUser);
      }

      return createdUsers;

    } catch (error) {
      this.logger.error(`Error creating InscripcionMatricula: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Error creating the inscripcion matricula.',
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
}
