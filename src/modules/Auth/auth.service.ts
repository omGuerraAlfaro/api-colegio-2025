import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { v4 as uuidv4 } from 'uuid';


import { LoginDto, RegisterDto } from "src/dto/login.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Usuarios } from "src/models/User.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuarios)
        private userRepository: Repository<Usuarios>,
        // @InjectRepository(Roles)
        // private roleRepository: Repository<Roles>,
        private jwtAuthService: JwtService,
    ) { }

    // async register(userObject: RegisterDto) {
    //     const { password, name_user, email_user, roles } = userObject;
    //     const plainToHash = await hash(password, 10);
    //     try {
    //         const userExist = await this.userRepository.findOne({
    //             relations: ['roles'],
    //             where: { username: userObject.name_user },
    //         });
    //         if (!userExist) {
    //             const user = new Usuarios();
    //             user.username = name_user;
    //             user.password = plainToHash;
    //             user.correo_electronico = email_user;
    //             // user.roles = [];

    //             // if (roles && Array.isArray(roles)) {
    //             //   for (const rol of roles) {
    //             //     try {
    //             //       const roleEntity = await this.roleRepository.findOne({ where: { id_role: rol.id } });
    //             //       user.roles.push(roleEntity);
    //             //     } catch (error) {
    //             //       // controlar error si no existe rol
    //             //     }
    //             //   }
    //             // }

    //             await this.userRepository.save(user);

    //             return {
    //                 body: userObject,
    //                 message: 'User Created',
    //             };
    //         } else {
    //             throw new HttpException('USERNAME_ALREADY_EXIST', HttpStatus.FORBIDDEN);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    async login(userObject: LoginDto) {
        try {
            const { username, password } = userObject;

            const user = await this.userRepository.findOne({ where: { username: username } });

            if (!user) throw new HttpException('USER_NOT_FOUND: ' + username + ', Password: ' + password, HttpStatus.NOT_FOUND);

            const chkPassword = await compare(password, user.password);
            if (!chkPassword)
                throw new HttpException('PASSWORD_INCORRECT: ' + username + ', Password: ' + password, HttpStatus.FORBIDDEN);

            const payload = { name_user: user.username };

            const token = this.jwtAuthService.sign(payload);

            return {
                user,
                token,
            };

        } catch (error) {
            console.error('Error during login:', error);
            throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
