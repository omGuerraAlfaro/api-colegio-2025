import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, IsDateString, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class EstudianteDto {
  @IsString()
  @IsNotEmpty()
  primer_nombre_alumno: string;

  @IsString()
  @IsOptional()
  segundo_nombre_alumno?: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido_alumno: string;

  @IsString()
  @IsNotEmpty()
  segundo_apellido_alumno: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  dv: string;

  @IsString()
  @IsNotEmpty()
  genero_alumno: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento_alumno: Date;

  @IsString()
  @IsNotEmpty()
  cursoId: number;

  @IsString()
  @IsNotEmpty()
  vive_con: string;

  @IsString()
  @IsNotEmpty()
  nacionalidad_alumno: string;

  @IsString()
  @IsOptional()
  enfermedad_cronica_alumno?: string;

  @IsString()
  @IsOptional()
  alergia_alimento_alumno?: string;

  @IsString()
  @IsOptional()
  alergia_medicamento_alumno?: string;

  @IsString()
  @IsNotEmpty()
  prevision_alumno: string;

  @IsString()
  @IsNotEmpty()
  consultorio_clinica_alumno: string;

  @IsBoolean()
  es_pae: boolean;

  @IsBoolean()
  eximir_religion: boolean;

  @IsBoolean()
  autorizacion_fotografias: boolean;

  @IsBoolean()
  apto_educacion_fisica: boolean;

  @IsString()
  @IsOptional()
  observaciones_alumno?: string;
}

export class InscripcionDto {
  @IsString()
  @IsOptional()
  id_inscripcion?: string;

  @IsDateString()
  @IsOptional()
  fecha_matricula_inscripcion?: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => EstudianteDto)
  estudiantes: EstudianteDto[];

  @IsString()
  @IsNotEmpty()
  
  primer_nombre_apoderado: string;

  @IsString()
  @IsOptional()
  segundo_nombre_apoderado?: string;

  @IsString()
  @IsNotEmpty()
  
  primer_apellido_apoderado: string;

  @IsString()
  @IsNotEmpty()
  
  segundo_apellido_apoderado: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  dv: string;

  @IsString()
  @Matches(/^[0-9]{9}$/, { message: 'Telefono debe tener 9 dígitos' })
  telefono_apoderado: string;

  @IsEmail()
  @IsNotEmpty()
  correo_apoderado: string;

  @IsString()
  @IsNotEmpty()
  parentesco_apoderado: string;

  @IsString()
  @IsNotEmpty()
  estado_civil: string;

  @IsString()
  @IsNotEmpty()
  profesion_oficio: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  comuna: string;

  @IsString()
  @IsNotEmpty()
  primer_nombre_apoderado_suplente: string;

  @IsString()
  @IsOptional()
  segundo_nombre_apoderado_suplente?: string;

  @IsString()
  @IsNotEmpty()
  
  primer_apellido_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  segundo_apellido_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  rut_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  dv_apoderado_suplente: string;

  @IsString()
  @Matches(/^[0-9]{9}$/, { message: 'Telefono debe tener 9 dígitos' })
  telefono_apoderado_suplente: string;

  @IsEmail()
  @IsNotEmpty()
  correo_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  parentesco_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  estado_civil_suplente: string;

  @IsString()
  @IsNotEmpty()
  profesion_oficio_suplente: string;

  @IsString()
  @IsNotEmpty()
  direccion_suplente: string;

  @IsString()
  @IsNotEmpty()
  comuna_suplente: string;
}

export class MatriculaDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => EstudianteDto)
  estudiantes: EstudianteDto[];

  @IsString()
  @IsNotEmpty()
  
  primer_nombre_apoderado: string;

  @IsString()
  @IsOptional()
  segundo_nombre_apoderado?: string;

  @IsString()
  @IsNotEmpty()
  
  primer_apellido_apoderado: string;

  @IsString()
  @IsNotEmpty()
  
  segundo_apellido_apoderado: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  dv: string;

  @IsString()
  @Matches(/^[0-9]{9}$/, { message: 'Telefono debe tener 9 dígitos' })
  telefono_apoderado: string;

  @IsEmail()
  @IsNotEmpty()
  correo_apoderado: string;

  @IsString()
  @IsNotEmpty()
  parentesco_apoderado: string;

  @IsString()
  @IsNotEmpty()
  estado_civil: string;

  @IsString()
  @IsNotEmpty()
  profesion_oficio: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  comuna: string;

  @IsString()
  @IsNotEmpty()
  primer_nombre_apoderado_suplente: string;

  @IsString()
  @IsOptional()
  segundo_nombre_apoderado_suplente?: string;

  @IsString()
  @IsNotEmpty()
  
  primer_apellido_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  segundo_apellido_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  rut_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  dv_apoderado_suplente: string;

  @IsString()
  @Matches(/^[0-9]{9}$/, { message: 'Telefono debe tener 9 dígitos' })
  telefono_apoderado_suplente: string;

  @IsEmail()
  @IsNotEmpty()
  correo_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  parentesco_apoderado_suplente: string;

  @IsString()
  @IsNotEmpty()
  estado_civil_suplente: string;

  @IsString()
  @IsNotEmpty()
  profesion_oficio_suplente: string;

  @IsString()
  @IsNotEmpty()
  direccion_suplente: string;

  @IsString()
  @IsNotEmpty()
  comuna_suplente: string;

  @IsNumber()
  @IsNotEmpty()
  valor_matricula: number;

  @IsNumber()
  @IsOptional()
  valor_mensualidad?: number;
}
