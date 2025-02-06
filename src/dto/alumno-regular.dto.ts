import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, IsDateString, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AlumnoRegularDto {

    @IsNumber()
    @IsNotEmpty()
    numero_matricula: number;

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
    curso: string;
}