import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    buyOrder: string;

    @ApiProperty()
    @IsUrl()
    @IsNotEmpty()
    returnUrl: string;

    // @ApiProperty()
    // @IsUrl()
    // @IsNotEmpty()
    // rutApoderado: string;
}


