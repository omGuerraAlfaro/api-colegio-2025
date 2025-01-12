import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { NotasService } from './notas.service';

@Controller('notas')
export class NotasController {
    constructor(private readonly notasService: NotasService) { }

    
}
