import { IsEmail, IsNotEmpty, IsOptional, IsDate, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
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
    
}
