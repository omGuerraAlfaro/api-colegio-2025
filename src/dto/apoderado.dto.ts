import { IsEmail, IsNotEmpty, IsOptional, IsDate, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';

class EstudianteDTO {
    @ApiProperty()
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    primer_nombre: string;

    @ApiProperty()
    @IsOptional()
    segundo_nombre?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    primer_apellido: string;

    @ApiProperty()
    @IsOptional()
    segundo_apellido?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsNotEmpty()
    rut: string;

    @ApiProperty()
    @IsNotEmpty()
    dv: string;

    @ApiProperty()
    @IsOptional()
    telefono_contacto?: string | null;

    @ApiProperty()
    @IsOptional()
    genero?: string | null;

    @ApiProperty()
    @IsOptional()
    alergico?: string | null;

    @ApiProperty()
    @IsOptional()
    vive_con?: string | null;

    @ApiProperty()
    @IsOptional()
    enfermedad_cronica?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    cursoId: number;

    @ApiProperty()
    @IsNotEmpty()
    pae_id: number;
}

export class ApoderadoDTO {
    @ApiProperty()
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    primer_nombre: string;

    @ApiProperty()
    @IsOptional()
    segundo_nombre?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    primer_apellido: string;

    @ApiProperty()
    @IsOptional()
    segundo_apellido?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsNotEmpty()
    rut: string;

    @ApiProperty()
    @IsNotEmpty()
    dv: string;

    @ApiProperty()
    @IsOptional()
    telefono?: string | null;

    @ApiProperty()
    @IsEmail()
    correo_electronico: string;

    @ApiProperty()
    @IsOptional()
    estado_civil?: string | null;

    @ApiProperty()
    @IsOptional()
    nacionalidad?: string | null;

    @ApiProperty()
    @IsOptional()
    actividad?: string | null;

    @ApiProperty()
    @IsOptional()
    escolaridad?: string | null;

    @ApiProperty({ type: [EstudianteDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EstudianteDTO)
    estudiantes: EstudianteDTO[];
}


export class ApoderadoAloneDTO {
    @ApiProperty()
    @IsOptional()
    segundo_nombre?: string | null;

    @ApiProperty()
    @IsOptional()
    segundo_apellido?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsOptional()
    telefono?: string | null;

    @ApiProperty()
    @IsEmail()
    correo_electronico: string;

    @ApiProperty()
    @IsOptional()
    estado_civil?: string | null;

    @ApiProperty()
    @IsOptional()
    nacionalidad?: string | null;

    @ApiProperty()
    @IsOptional()
    actividad?: string | null;

    @ApiProperty()
    @IsOptional()
    escolaridad?: string | null;
}
