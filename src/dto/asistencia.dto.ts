import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

export class CreateAsistenciaDto {
    estudianteId: number;
    cursoId: number;
    semestreId: number;
    calendarioId: number;
    estado: boolean;
}

export class UpdateAsistenciaDto {
    asistenciaId: number;
    estado: boolean;
}

export class UpdateMultipleAsistenciaDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAsistenciaDto2)
    asistencias: UpdateAsistenciaDto2[];
}

export class UpdateAsistenciaDto2{
    @IsNumber()
    @IsNotEmpty()
    estudianteId: number;
  
    @IsNumber()
    @IsNotEmpty()
    calendarioId: number;
  
    @IsNumber()
    @IsNotEmpty()
    cursoId: number;
  
    @IsNumber()
    @IsNotEmpty()
    semestreId: number;
  
    @IsNumber()
    @IsNotEmpty()
    estado: number;
  
    // Si existe un ID interno de la tabla asistencia (por ejemplo, id_asistencia),
    // agrégalo también si es necesario.
    // @IsNumber()
    // @IsNotEmpty()
    // asistenciaId: number;
  }