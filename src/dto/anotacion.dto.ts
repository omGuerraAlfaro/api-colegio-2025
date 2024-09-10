import { IsNumber, IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class AnotacionDto {
    @IsNumber()
    id: number;

    @IsString()
    anotacion_descripcion: string;

    @IsDate()
    fecha_ingreso: Date;

    @IsBoolean()
    es_positiva: boolean;

    @IsBoolean()
    es_negativa: boolean;

    @IsBoolean()
    anotacion_estado: boolean;
}

export class CreateAnotacionDto {
    @IsString()
    anotacion_titulo: string;

    @IsString()
    anotacion_descripcion: string;

    @IsBoolean()
    @IsOptional()
    es_positiva?: boolean;

    @IsBoolean()
    @IsOptional()
    es_negativa?: boolean;

    @IsBoolean()
    @IsOptional()
    anotacion_estado?: boolean;

    @IsNumber()
    asignaturaId: number;
}