import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class ConfirmTransfDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    buy_order: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    correo: string;

}


