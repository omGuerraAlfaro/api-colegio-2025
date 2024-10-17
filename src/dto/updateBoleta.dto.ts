import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBoletaDto {
    @IsInt()
    @Min(1)
    idBoleta: number;

    @IsInt()
    estado: number;

    @IsString()
    @IsOptional()
    idPago: string;
}

export class UpdateBoletaDto2 {
    readonly apoderado_id?: number;
    readonly estudiante_id?: number;
    readonly rut_estudiante?: string;
    readonly rut_apoderado?: string;
    readonly pago_id?: string;
    readonly estado_id?: number;
    readonly detalle?: string;
    readonly fecha_vencimiento?: Date;
    readonly total?: number;
}


export class CrearBoletaDto {
    @IsNotEmpty()
    @IsNumber()
    valor_matricula: number;

    @IsNotEmpty()
    @IsNumber()
    valor_mensualidad: number;
}