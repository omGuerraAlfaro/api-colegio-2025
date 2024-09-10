import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EnviarCorreoDto {
  
  @IsNotEmpty()
  @IsEmail()
  emailTo: string;
}
