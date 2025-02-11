import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfValidadorService } from './pdf-validador.service';
import { PdfValidadorController } from './pdf-validador.controller';
import { PdfValidador } from 'src/models/pdf-validador.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PdfValidador])],
    controllers: [PdfValidadorController],
    providers: [PdfValidadorService],
    exports: [PdfValidadorService],
})
export class PdfValidadorModule { }
