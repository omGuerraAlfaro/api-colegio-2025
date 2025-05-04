import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { BoletaService } from './boleta.service';
import { ApiTags } from '@nestjs/swagger';
import { CrearBoletaDto, UpdateBoletaDto, UpdateBoletaDto2 } from 'src/dto/updateBoleta.dto';
import { Boleta } from 'src/models/Boleta.entity';
import { ResumenApoderadoMorosoDto } from 'src/dto/apoderado.dto';


@ApiTags('Boletas')
@Controller('boleta')
export class BoletaController {
    constructor(private readonly boletaService: BoletaService) { }

    @Get()
    async getBoletas() {
        return await this.boletaService.findAll();
    }

    @Get('con-apoderado')
    async getBoletaApoderado() {
        return await this.boletaService.findAllBoletasConApoderado();
    }

    // @Post('reenumerate')
    // async reenumerateBoletas(): Promise<void> {
    //     await this.boletaService.reenumerateBoletas();
    // }

    @Get('estudiante/:rut')
    async getBoletasByRutEstudiante(@Param('rut') rut: string): Promise<Boleta[]> {
        return this.boletaService.findBoletasByRutEstudiante(rut);
    }

    @Get(':rut')
    async getBoleta(@Param('rut') rut: string) {
        return await this.boletaService.findBoletasByRutApoderado(rut);
    }

    @Get('apoderado/:rut')
    async getBoletaSimply(@Param('rut') rut: string) {
        return await this.boletaService.findBoletasByRutApoderadoOnly(rut);
    }

    @Get('apoderado-historial-pago/:rut')
    async findBoletasPagadasWithTransaccionData(@Param('rut') rut: string) {
        return await this.boletaService.findBoletasPagadasWithTransaccionData(rut);
    }

    @Post('crear-boletas-apoderado/:rut')
    createBoletasEstudiante(
        @Param('rut') rut: string,
        @Body() crearBoletaDto: CrearBoletaDto
    ) {
        return this.boletaService.createAnnualBoletasForApoderadoByRut(rut, crearBoletaDto);
    }

    // @Post('generar-boletas')
    // async getBoletasEstudiantes() {
    //     return await this.boletaService.createAnnualBoletasForMultipleApoderados();
    // }

    @Post('repactar/:id/:meses')
    async repactarBoleta(
        @Param('id') boletaId: number,
        @Param('meses') meses: number
    ): Promise<any> {
        try {
            if (isNaN(meses) || meses < 1 || meses > 3) {
                throw new HttpException('Número de meses inválido. Debe ser 1, 2 o 3.', HttpStatus.BAD_REQUEST);
            }

            const boletasRepactadas = await this.boletaService.repactarBoleta(boletaId, meses);
            return {
                message: 'Repactación realizada con éxito.',
                boletasRepactadas: boletasRepactadas
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put('updateBoleta')
    async updateBoleta(@Body() updateBoletaDto: UpdateBoletaDto) {
        const { idBoleta, estado, idPago } = updateBoletaDto;
        const result = await this.boletaService.updateBoletaStatus(idBoleta, estado, idPago);
        return result;
    }

    @Put(':id')
    async updateBoletaAll(@Param('id') id: number, @Body() updateBoletaDto: UpdateBoletaDto2) {
        return this.boletaService.updateBoleta(id, updateBoletaDto);
    }

    @Get('id/:id')
    async getBoletaById(@Param('id') id: number) {
        try {
            const boleta = await this.boletaService.findBoletaById(id);
            if (!boleta) {
                throw new NotFoundException('Boleta no encontrada');
            }
            return boleta;
        } catch (error) {
            throw new InternalServerErrorException('Error al buscar la boleta');
        }
    }


    @Get('pendientes-vencidas/:fecha')
    async getPendientesVencidas(@Param('fecha') fecha: string) {
        return await this.boletaService.getPendientesVencidas(fecha);
    }

    @Get('pagadas/:fecha')
    async getPagadas(@Param('fecha') fecha: string) {
        return await this.boletaService.getTotalPagado(fecha);
    }

    @Get('total-pendiente-vencido/:fecha')
    async getTotalPendienteVencido(@Param('fecha') fecha: string) {
        return await this.boletaService.getTotalPendienteVencido(fecha);
    }

    @Get('apoderados-estado-boleta/:fecha/:estadoId')
    async getApoderadosMorosos(
        @Param('fecha') fecha: string,
        @Param('estadoId') estadoId: number
    ) {
        return await this.boletaService.getApoderadosMorosos(fecha, estadoId);
    }

    @Get('total-pendiente-por-mes/:fecha')
    async getTotalPendientePorMes(@Param('fecha') fecha: string) {
        return this.boletaService.getTotalPendientePorMes(fecha);
    }
    @Get('total-pagado-por-mes/:fecha')
    async getTotalPagadoPorMes(@Param('fecha') fecha: string) {
        return this.boletaService.getTotalPagadoPorMes(fecha);
    }

    @Get('morosos/obtener')
    findMorosos(): Promise<ResumenApoderadoMorosoDto[]> {
        return this.boletaService.getApoderadosMorososNew();
    }
}