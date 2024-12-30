import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateEstudianteDto {
  @IsOptional()
  @IsString()
  primer_nombre_alumno?: string;

  @IsOptional()
  @IsString()
  segundo_nombre_alumno?: string;

  @IsOptional()
  @IsString()
  primer_apellido_alumno?: string;

  @IsOptional()
  @IsString()
  segundo_apellido_alumno?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento_alumno?: string;

  @IsOptional()
  @IsDateString()
  fecha_matricula?: string;

  @IsOptional()
  @IsString()
  genero_alumno?: string;

  @IsOptional()
  @IsString()
  alergia_alimento_alumno?: string;

  @IsOptional()
  @IsString()
  alergia_medicamento_alumno?: string;

  @IsOptional()
  @IsString()
  vive_con?: string;

  @IsOptional()
  @IsString()
  enfermedad_cronica_alumno?: string;

  @IsOptional()
  @IsString()
  prevision_alumno?: string;

  @IsOptional()
  @IsString()
  nacionalidad?: string;

  @IsOptional()
  @IsBoolean()
  es_pae?: boolean;

  @IsOptional()
  @IsString()
  consultorio_clinica_alumno?: string;

  @IsOptional()
  @IsBoolean()
  autorizacion_fotografias?: boolean;

  @IsOptional()
  @IsBoolean()
  apto_educacion_fisica?: boolean;

  @IsOptional()
  @IsString()
  observaciones_alumno?: string;

  @IsOptional()
  @IsBoolean()
  estado_estudiante?: boolean;
}
