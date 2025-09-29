import { IsInt, Min, IsString, MaxLength } from 'class-validator';

export class CierreObservacionDto {
    @IsInt()
    @Min(1)
    estudianteId!: number;

    @IsString()
    @MaxLength(800)
    observacion!: string;
}