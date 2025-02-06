import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correo } from 'src/models/Correo.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CorreoService {
    constructor(
        @InjectRepository(Correo)
        private readonly correoRepository: Repository<Correo>,
    ) { }

    async getCorreoSmtp() {
        try {
            return await this.correoRepository.find();
        } catch (error) {
            console.error('Failed to fetch SMTP info:', error);
            throw new InternalServerErrorException('Failed to fetch SMTP information');
        }
    }

    async enviarCorreo(mailOptions: any) {
        const smtpInfo = await this.getCorreoSmtp();
        const { host_smtp, port_smtp, user_smtp, pass_smtp } = smtpInfo[0];

        const transporter = nodemailer.createTransport({
            host: host_smtp,
            port: port_smtp,
            secure: true,
            auth: {
                user: user_smtp,
                pass: pass_smtp,
            },
        });

        return transporter.sendMail(mailOptions);
    }

}

