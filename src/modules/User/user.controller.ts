import { Controller, Get, Post, Body, Response, Param, Patch, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { Usuarios } from 'src/models/User.entity';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/dto/login.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get()
  findAll(): Promise<Usuarios[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') userId: number): Promise<Usuarios[]> {
    return this.usuarioService.findOne(userId);
  }

  @Get('rut/:rut')
  findOneByRut(@Param('rut') userRut: string): Promise<Usuarios[]> {
    return this.usuarioService.findOneByRut(userRut);
  }

  @Get(':id/apoderado-alumnos')
  async getUserWithApoderadoAndAlumnos(@Param('id') userId: number): Promise<Usuarios> {
    return this.usuarioService.findUserWithApoderadoAndAlumnos(userId);
  }

  @Get(':id/profesor')
  async getUserWithProfesor(@Param('id') userId: number): Promise<Usuarios> {
    return this.usuarioService.findUserWithProfesor(userId);
  }

  @Post('/create-for-all-apoderados')
  async createUsersForAllApoderados(@Response() res: any): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllApoderados();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }

  @Post('/create-for-all-profesores')
  async createUsersForAllProfesores(@Response() res): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllProfesores();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }

  @Post('/create-for-all-administradores')
  async createUsersForAllAdministradores(@Response() res): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllAdministradores();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }

  @Post('/create-for-all-sub-administradores')
  async createUsersForAllSubAdministradores(@Response() res): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllSubAdministradores();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }

  @Patch('change/:id')
  async changePassword(
    @Param('id') id: number,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string
  ): Promise<void> {
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new HttpException('All password fields are required.', HttpStatus.BAD_REQUEST);
    }
    if (newPassword !== confirmPassword) {
      throw new HttpException('New passwords do not match.', HttpStatus.BAD_REQUEST);
    }
    await this.usuarioService.changePassword(id, oldPassword, newPassword);
  }

  @Patch('reset-password/:rut')
  async resetPassword(@Param('rut') rut: string): Promise<{ message: string }> {
    await this.usuarioService.resetPassword(rut);
    return { message: 'Password reset successfully' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetear contraseña de usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña reseteada.' })
  @ApiResponse({ status: 400, description: 'Rut o correo inválidos.' })
  async UserResetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.usuarioService.UserResetPassword(dto);
  }
  
}
