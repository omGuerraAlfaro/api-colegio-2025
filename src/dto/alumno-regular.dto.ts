import { IsOptional, IsString, IsNumber } from 'class-validator';

export class AlumnoRegularDto {
  @IsOptional()
  @IsNumber()
  numero_matricula?: number;

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
  @IsString()
  rut?: string;

  @IsOptional()
  @IsString()
  dv?: string;

  @IsOptional()
  @IsString()
  curso?: string;

  @IsOptional()
  @IsString()
  tipo_certificado?: string;

  @IsOptional()
  isErp?: boolean;

  @IsOptional()
  @IsString()
  rutApoderado?: string;
}
