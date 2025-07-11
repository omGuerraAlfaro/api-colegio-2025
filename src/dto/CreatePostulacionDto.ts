// src/dto/create-postulacion.dto.ts
import { 
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class MotivosCambioDto {
  @IsBoolean() proyecto: boolean;
  @IsBoolean() disciplina: boolean;
  @IsBoolean() academicas: boolean;
  @IsBoolean() domicilio: boolean;
  @IsBoolean() otro: boolean;

  @IsOptional()
  @IsString()
  otroText?: string;
}

class ExpectativasDto {
  @IsBoolean() academica: boolean;
  @IsBoolean() valores: boolean;
  @IsBoolean() socioemocional: boolean;
  @IsBoolean() talentos: boolean;
  @IsBoolean() otroExp: boolean;

  @IsOptional()
  @IsString()
  otroExpText?: string;
}

export class CreatePostulacionDto {
  // Apoderado
  @IsString() @IsNotEmpty() apoderado: string;
  @IsString() @IsNotEmpty() rut: string;
  @IsString() @IsNotEmpty() direccion: string;
  @IsString() @IsNotEmpty() comuna: string;
  @IsString() @IsNotEmpty() telefono: string;
  @IsEmail() @IsNotEmpty() email: string;

  // Estudiante
  @IsString() @IsNotEmpty() pupilo: string;
  @IsNumber({}, { message: "La edad debe ser un número" })
  @Min(3, { message: "Mínimo 3 años" })
  @Max(25, { message: "Máximo 25 años" })
  @Type(() => Number)
  edad: number;
  @IsString() @IsNotEmpty() cursoPostula: string;
  @IsString() @IsNotEmpty() colegioOrigen: string;

  // MotivosCambio anidado
  @IsObject()
  @ValidateNested()
  @Type(() => MotivosCambioDto)
  motivosCambio: MotivosCambioDto;

  // Expectativas anidado
  @IsObject()
  @ValidateNested()
  @Type(() => ExpectativasDto)
  expectativas: ExpectativasDto;

  // Comentarios (opcional)
  @IsOptional()
  @IsString()
  comentarios?: string;

  // Consentimiento
  @IsBoolean() consentimiento: boolean;
}
