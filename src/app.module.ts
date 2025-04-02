import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { entities } from './models';
import {
  ApoderadoModule,
  EstudianteModule,
  ProfesorModule,
  CursoModule,
  UsuarioModule,
  AdministradorModule,
  AuthModule,
  NoticiasModule,
  CorreoModule,
  BoletaModule,
  PaymentModule,
  AnotacionModule,
  AsignaturaModule,
  AsistenciaModule,
  CalendarioEscolarModule,
  InscripcionMatriculaModule,
  PdfModule,
  NotasModule,
  PdfValidadorModule,
  EvaluacionModule,
  SemestreModule,
  InscripcionTallerModule
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApoderadoModule,
    EstudianteModule,
    ProfesorModule,
    CursoModule,
    AdministradorModule,
    UsuarioModule,
    AuthModule,
    NoticiasModule,
    CorreoModule,
    BoletaModule,
    PaymentModule,
    AnotacionModule,
    AsignaturaModule,
    AsistenciaModule,
    CalendarioEscolarModule,
    InscripcionMatriculaModule,
    InscripcionTallerModule,
    PdfModule,
    NotasModule,
    EvaluacionModule,
    PdfValidadorModule,
    SemestreModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'colegioa_colegio2025',
      entities,
      synchronize: true
    }),
  ]
})
export class AppModule { }

// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: '44.207.168.60',
//   port: 3306,
//   username: 'colegioa_omarignacio',
//   password: 'tZk+2t]rxUG3',
//   database: 'colegioa_colegio2025',
//   entities,
//   synchronize: true
// }),

// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '',
//   database: 'colegio-2025-2',
//   entities,
//   synchronize: true
// }),