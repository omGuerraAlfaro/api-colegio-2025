import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateFullNoticiaDto } from '../../../src/dto/noticia.dto';
import { NoticiasColegio } from 'src/models/Noticias.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('noticias')
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) { }

    @Post()
    async create(@Body() createFullNoticiaDto: CreateFullNoticiaDto): Promise<NoticiasColegio> {
        console.log('Función create llamada con data:', createFullNoticiaDto);

        try {
            return await this.noticiasService.createNoticiaWithImages(createFullNoticiaDto);
        } catch (error) {
            console.error("Error:", error);  // Log del error para debug
            throw new HttpException('Error al crear noticia', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get()
    async getAllNoticias(): Promise<NoticiasColegio[]> {
        return await this.noticiasService.getAllNoticias();
    }
    
    @Get(':id')
    async getNoticiaById(@Param('id') id: number): Promise<NoticiasColegio> {
        return await this.noticiasService.getNoticiaById(id);
    }

    @Post(':id/like')
    async likeNoticia(@Param('id') noticiaId: number): Promise<NoticiasColegio> {
        return this.noticiasService.likeNoticia(noticiaId);
    }
}



