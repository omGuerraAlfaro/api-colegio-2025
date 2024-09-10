import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Post('register')
    // async registerUser(@Body() userObject: RegisterDto) {
    //     return await this.authService.register(userObject);
    // }

    @Post('login')
    async loginUser(@Body() userObject: LoginDto) {
        return await this.authService.login(userObject);
    }
}