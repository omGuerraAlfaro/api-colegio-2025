import { Controller, Get, Post, Body, Put, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { PdfValidadorService } from './pdf-validador.service';
import { CreatePdfValidadorDto, UpdatePdfValidadorDto } from 'src/dto/pdf-validador.dto';

@Controller('pdf-validador')
export class PdfValidadorController {
    constructor(private readonly pdfValidadorService: PdfValidadorService) { }

    // Crear un nuevo registro
    @Post()
    async create(@Body() createPdfValidadorDto: CreatePdfValidadorDto) {
        return await this.pdfValidadorService.create(createPdfValidadorDto);
    }

    // Obtener todos los registros
    @Get()
    async findAll() {
        return await this.pdfValidadorService.findAll();
    }

    // Obtener un registro por id
    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     return await this.pdfValidadorService.findOne(id);
    // }

    // Endpoint para validar el certificado (por ejemplo: /pdf-validador/validar-certificado?id=<id>)
    @Get('validar-certificado')
    async validar(@Query('id') id: string) {
        // Buscar el registro por id
        const record = await this.pdfValidadorService.findOne(id);
        if (!record) {
            throw new NotFoundException(`Registro con id ${id} no encontrado`);
        }

        // Si ya está validado, devolvemos un mensaje informativo
        if (record.isValid) {
            return { message: 'Certificado ya fue validado previamente', data: record };
        }

        // Actualizamos el registro: marcamos como válido y asignamos la fecha de validación
        const updateData = {
            isValid: true,
            validatedAt: new Date(),
        };

        const updatedRecord = await this.pdfValidadorService.update(id, updateData);

        return { message: 'Certificado validado exitosamente', data: updatedRecord };
    }

    // Actualizar un registro por id
    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePdfValidadorDto: UpdatePdfValidadorDto) {
        return await this.pdfValidadorService.update(id, updatePdfValidadorDto);
    }

    // Eliminar un registro por id
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.pdfValidadorService.remove(id);
        return { message: 'Registro eliminado correctamente' };
    }
}
