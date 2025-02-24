import { Controller, Get, Post, Body, Put, Param, Delete, Query, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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

    @Post('crear')
    async createApp(@Body() createPdfValidadorDtos: CreatePdfValidadorDto[]) {
        try {
            return await this.pdfValidadorService.createArray(createPdfValidadorDtos);
        } catch (error) {
            console.error('Error al crear PdfValidador:', error);
            // Opcional: lanzar una excepción HTTP con más información:
            throw new InternalServerErrorException('Error al crear los registros');
        }
    }

    // Obtener todos los registros
    @Get()
    async findAll() {
        return await this.pdfValidadorService.findAll();
    }

    //Obtener registros pagados por rut de apoderado
    @Get('rut/:rut')
    async findOne(@Param('rut') rut: string) {
        return await this.pdfValidadorService.findOneByRutApoderado(rut);
    }

    // Endpoint para validar el certificado (por ejemplo: /pdf-validador/validar-certificado?id=<id>)
    @Get('validar-certificado')
    async validar(@Query('id') id: string) {
        // Buscar el registro por id
        const record = await this.pdfValidadorService.findOne(id);

        if (!record) {
            throw new NotFoundException(`Registro con id ${id} no encontrado`);
        }

        // Evaluar la fecha de expiración antes de cualquier otra validación
        if (record.expirationDate) {
            const expiration = new Date(record.expirationDate);
            const now = new Date();
            if (now > expiration) {
                throw new BadRequestException(`El certificado ha expirado y no puede ser validado.`);
            }
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
        delete updatedRecord.validationCode;

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
