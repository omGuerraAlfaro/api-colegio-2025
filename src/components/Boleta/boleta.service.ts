import { Get, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from 'src/models/Boleta.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoService } from '../Apoderado/apoderado.service';

@Injectable()
export class BoletaService {
  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    private readonly apoderadoService: ApoderadoService,
  ) { }

  async findBoletasByRutEstudiante(rut_estudiante: string): Promise<Boleta[]> {
    return await this.boletaRepository.find({ where: { rut_estudiante } });
  }
  
  async findBoletasByRutApoderado(rut_apoderado: string) {
    const boletas = await this.boletaRepository.find({ where: { rut_apoderado: rut_apoderado } });

    // Objeto para agrupar las boletas por estudiante
    const groupedBoletas = {};

    // Un conjunto para llevar un registro de los RUTs de los estudiantes únicos
    const estudianteRuts = new Set(boletas.map(boleta => boleta.rut_estudiante));

    // Contador para crear claves secuenciales
    let estudianteCounter = 1;

    estudianteRuts.forEach(rutEstudiante => {
      const boletasEstudiante = boletas.filter(boleta => boleta.rut_estudiante === rutEstudiante);

      // Separar las boletas en boletasColegiatura y boletasPae
      const boletasColegiatura = boletasEstudiante.filter(boleta => !boleta.detalle.startsWith("Boleta de PAE"));
      const boletasPae = boletasEstudiante.filter(boleta => boleta.detalle.startsWith("Boleta de PAE"));

      // Agregar las boletas separadas al objeto agrupado
      groupedBoletas[`estudiante${estudianteCounter}`] = {
        boletasColegiatura,
        boletasPae
      };

      estudianteCounter++;
    });

    return { boletas: groupedBoletas };
  }

  async findAll() {
    return await this.boletaRepository.find();
  }

  async findAllBoletasConApoderado(): Promise<Boleta[]> {
    return this.boletaRepository.find({ relations: ['apoderado'] });
  }

  async reenumerateBoletas(): Promise<void> {
    const boletas = await this.boletaRepository.find({ order: { id: 'ASC' } });

    let newId = 1;
    for (const boleta of boletas) {
      await this.boletaRepository.update(boleta.id, { id: newId });
      newId++;
    }

    await this.boletaRepository.query(`ALTER TABLE boletas AUTO_INCREMENT = ${newId}`);
  }

  async createAnnualBoletasForApoderadoRut(rut: string) { //malo
    // Obtén los estudiantes asociados al apoderado
    const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut);

    if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
      throw new Error('No se encontraron estudiantes para el apoderado con el RUT proporcionado.');
    }

    const meses = ['matricula', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const boletas = [];
    const boletasPae = [];

    for (const estudiante of apoderado.estudiantes) {
      for (const mes of meses) {
        const boleta = this.boletaRepository.create({
          apoderado_id: apoderado.id,
          // pago_id: , // Dejar como NULL o establecer si es necesario
          estado_id: 1, // Suponiendo que 1 es un estado válido, por ejemplo 'Pendiente'
          detalle: `Boleta de ${mes}`,
          total: 119, // Total incluyendo el IVA, ajusta según tu lógica
          fecha_vencimiento: new Date(), // Fecha actual, puedes ajustarla para que coincida con el mes de la boleta si es necesario
        });

        // Guarda la boleta en la base de datos
        const savedBoleta = await this.boletaRepository.save(boleta);
        boletas.push(savedBoleta);
      }
    }

    // Retorna las boletas creadas
    return boletas;
  }

  async createAnnualBoletasForMultipleApoderados() {
    try {
      // Tu código asíncrono aquí
      // Obtén un arreglo de todos los RUTs de apoderados
      const arrayRuts = await this.apoderadoService.findAllRut();

      const meses = ['matricula', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const boletas = [];
      const mesesPae = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const boletasPae = [];

      for (const rut of arrayRuts) {
        const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut.rut);

        if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
          continue; // Si no hay estudiantes, continúa con el siguiente RUT
        }

        const rutApoderado = apoderado.rut;

        for (const estudiante of apoderado.estudiantes) {
          const rutEstudiante = estudiante.rut;

          for (const mes of meses) {
            const fechaActual = new Date();
            let anio = fechaActual.getFullYear();
            let mesIndex = meses.indexOf(mes);
            let valorMatricula = 220000;
            let subTotal = 0;
            let total = 0;

            if (mes === 'matricula') {
              mesIndex = 0;
              total = valorMatricula;
              subTotal = total
            } else {
              mesIndex += 1;
              total = 1000; //cambiar
              subTotal = total
            }

            const fechaVencimiento = new Date(anio, mesIndex, 1);

            const boleta = this.boletaRepository.create({
              apoderado: apoderado,
              rut_estudiante: rutEstudiante,
              rut_apoderado: rutApoderado,
              estado_id: 1, // 1 es 'Pendiente'
              detalle: `Boleta de ${mes}`,
              total: total,
              fecha_vencimiento: fechaVencimiento,
            });

            // Guarda la boleta en la base de datos
            const savedBoleta = await this.boletaRepository.save(boleta);
            boletas.push(savedBoleta);

          }
        }
        return { boletas, boletasPae };
      }
    } catch (error) {
      console.error("Se ha producido un error:", error);
    }
  }

  async repactarBoleta(boletaId: number, meses: number): Promise<Boleta[]> {
    if (meses < 1 || meses > 2) {
      throw new Error('La repactación puede ser solo de 1 o 2 meses después del actual.');
    }

    const boletaActual = await this.boletaRepository.findOne({ where: { id: boletaId } });
    if (!boletaActual) {
      throw new Error('Boleta no encontrada.');
    }

    if (boletaActual.estado_id !== 1) { // Asumiendo que 1 es 'Pendiente'
      throw new Error('Solo se pueden repactar boletas que estén pendientes.');
    }

    // Encuentra las boletas de los meses siguientes
    const fechaVencimientoOriginal = boletaActual.fecha_vencimiento;
    const boletasFuturas = await this.boletaRepository.find({
      where: {
        rut_estudiante: boletaActual.rut_estudiante,
        fecha_vencimiento: MoreThan(fechaVencimientoOriginal)
      },
      order: {
        fecha_vencimiento: 'ASC'
      },
      take: meses
    });

    if (boletasFuturas.length < meses) {
      throw new Error('No hay suficientes boletas futuras para repactar.');
    }

    // const montoPorMes = boletaActual.subtotal / meses;

    for (const [index, boletaFutura] of boletasFuturas.entries()) {
      // const subtotalActualizado = Number(boletaFutura.subtotal) + montoPorMes;

      // boletaFutura.subtotal = subtotalActualizado;
      // const subSubtotal = subtotalActualizado - (subtotalActualizado * boletaActual.descuento) / 100;
      // boletaFutura.total = subSubtotal;
      // boletaFutura.nota += ` Incluye repactación de la boleta actual - Cuota ${index + 1}.`;
      await this.boletaRepository.save(boletaFutura);
    }

    // Cambiar estado de la boleta actual a 'Repactada'
    boletaActual.estado_id = 4; // Asumiendo que 4 es 'Repactada'
    await this.boletaRepository.save(boletaActual);

    return boletasFuturas;
  }

  async updateBoletaStatus(idBoleta: number, nuevoEstado: number, idPago: string): Promise<void> {
    await this.boletaRepository.update(idBoleta, { estado_id: nuevoEstado, pago_id: idPago });
  }

  async findBoletaById(id: number): Promise<Boleta> {
    try {
      const boleta = await this.boletaRepository.findOne({ where: { id } });
      if (!boleta) {
        throw new NotFoundException('Boleta no encontrada');
      }
      return boleta;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la boleta');
    }
  }

  async getPendientesVencidas(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const boletas = await this.boletaRepository.createQueryBuilder('boleta')
        .where('boleta.estado_id = :estadoId', { estadoId: 1 })
        .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .getMany();
      return { boletas };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las boletas pendientes y vencidas');
    }
  }

  async getTotalPendienteVencido(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const result = await this.boletaRepository.createQueryBuilder('boleta')
        .select('SUM(boleta.total)', 'total_pendiente_vencido')
        .where('boleta.estado_id = :estadoId', { estadoId: 1 })
        .andWhere('boleta.fecha_vencimiento BETWEEN :startDate AND :currentDate', { startDate, currentDate })
        //.andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .getRawOne();
      return result.total_pendiente_vencido ? { total_pendiente_vencido: result.total_pendiente_vencido } : { total_pendiente_vencido: 0 };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el total pendiente vencido');
    }
  }

  async getTotalPendientePorMes(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const startDate = new Date(currentDate.getFullYear(), 2, 1);

      const result = await this.boletaRepository.query(`
        SELECT 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m-01') AS mes,
          SUM(boleta.total) AS total_pendiente_vencido
        FROM 
          boleta
        WHERE 
          boleta.estado_id = 1
          AND boleta.fecha_vencimiento BETWEEN ? AND ?
        GROUP BY 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m')
        ORDER BY 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m') ASC
        LIMIT 25;
      `, [startDate.toISOString().slice(0, 10), currentDate.toISOString().slice(0, 10)]);

      return result.map(row => ({
        mes: row.mes,
        total_pendiente_vencido: row.total_pendiente_vencido || 0,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el total pendiente vencido por mes');
    }
  }

  async getTotalPagadoPorMes(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const startDate = new Date(currentDate.getFullYear(), 2, 1);

      const result = await this.boletaRepository.query(`
        SELECT 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m-01') AS mes,
          SUM(boleta.total) AS total_pagado
        FROM 
          boleta
        WHERE 
          boleta.estado_id = 2
          AND boleta.fecha_vencimiento BETWEEN ? AND ?
        GROUP BY 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m')
        ORDER BY 
          DATE_FORMAT(boleta.fecha_vencimiento, '%Y-%m') ASC
        LIMIT 25;
      `, [startDate.toISOString().slice(0, 10), currentDate.toISOString().slice(0, 10)]);

      return result.map(row => ({
        mes: row.mes,
        total_pagado: row.total_pagado || 0,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el total pagado por mes');
    }
  }

  async getTotalPagado(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const result = await this.boletaRepository.createQueryBuilder('boleta')
        .select('SUM(boleta.total)', 'total_pagado')
        .where('boleta.estado_id = :estadoId', { estadoId: 2 })
        .andWhere('boleta.fecha_vencimiento BETWEEN :startDate AND :currentDate', { startDate, currentDate })
        .getRawOne();

      return result.total_pagado ? { total_pagado: result.total_pagado } : { total_pagado: 0 };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el total pagado');
    }
  }


  async getApoderadosMorosos(fecha: string, estadoId: number) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();

      const boletas = await this.boletaRepository.createQueryBuilder('boleta')
        .leftJoinAndSelect('boleta.apoderado', 'apoderado')
        .where('boleta.estado_id = :estadoId', { estadoId })
        .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .getMany();

      // Agrupar boletas por RUT de apoderado
      const apoderadosMap = boletas.reduce((acc, boleta) => {
        const rutApoderado = `${boleta.rut_apoderado}-${boleta.apoderado.dv}`;
        if (!acc[rutApoderado]) {
          acc[rutApoderado] = {
            apoderado: {
              id: boleta.apoderado.id,
              nombreCompleto: [
                boleta.apoderado.primer_nombre_apoderado,
                boleta.apoderado.segundo_nombre_apoderado,
                boleta.apoderado.primer_apellido_apoderado,
                boleta.apoderado.segundo_apellido_apoderado
              ].filter(Boolean).join(' '),
              rut: rutApoderado,
              telefono: boleta.apoderado.telefono_apoderado,
              correo_electronico: boleta.apoderado.correo_apoderado,
            },
            boletasPendientes: [],
            boletasPagadas: []
          };
        }
        if (estadoId === 1) {
          acc[rutApoderado].boletasPendientes.push(boleta);
        } else if (estadoId === 2) {
          acc[rutApoderado].boletasPagadas.push(boleta);
        }
        return acc;
      }, {});

      const apoderadosMorosos = Object.values(apoderadosMap);
      const totalApoderadosMorosos = apoderadosMorosos.length;

      return {
        total: totalApoderadosMorosos,
        apoderados: apoderadosMorosos,
      };
    } catch (error) {
      console.error('Error al obtener los apoderados morosos:', error);
      throw new InternalServerErrorException('Error al obtener los apoderados morosos');
    }
  }



}