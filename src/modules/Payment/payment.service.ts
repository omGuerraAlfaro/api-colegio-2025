// payment.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { Boleta } from 'src/models/Boleta.entity';
import { BoletaService } from '../Boleta/boleta.service';
import { CorreoService } from '../Correo/correo.service';
import { ApoderadoService } from '../Apoderado/apoderado.service';
import { json } from 'stream/consumers';
import { EstudianteService } from '../Estudiante/estudiante.service';
import { Transacciones } from 'src/models/Transacciones.entity';
import { PdfValidadorService } from '../Pdf-Validador/pdf-validador.service';
import { log } from 'console';

@Injectable()
export class PaymentService {
    private commerceCode: string;
    private apiKey: string;
    private tx: InstanceType<typeof WebpayPlus.Transaction>;

    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(Transacciones)
        private transaccionRepository: Repository<Transacciones>,
        private readonly boletaService: BoletaService,
        private readonly correoService: CorreoService,
        private readonly apoderadoService: ApoderadoService,
        private readonly estudianteService: EstudianteService,
        private readonly pdfValidadorService: PdfValidadorService
    ) {
        this.commerceCode = process.env.COMMERCE_CODE;
        this.apiKey = process.env.API_KEY;

        if (!this.commerceCode || !this.apiKey) {
            throw new Error('COMMERCE_CODE and API_KEY must be defined in environment variables');
        }

        WebpayPlus.configureForProduction(this.commerceCode, this.apiKey);


        // 📌 Producción:
        this.tx = new WebpayPlus.Transaction(new Options(this.commerceCode, this.apiKey, Environment.Production));

        // 📌 Integración:
        // this.tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    }



    async createTransaction(buyOrder: string, sessionId: string, amount: number, returnUrl: string) {
        try {
            const response = await this.tx.create(buyOrder, sessionId, amount, returnUrl);

            // Save transaction to database
            await this.transactionRepository.save({
                buyOrder: buyOrder,
                sessionId: sessionId,
                amount: amount,
                token: response.token,
                status: 'pendiente',
            });

            const parts = buyOrder.split('-');
            const rawIds = parts.slice(2);
            const idsBoletas = rawIds.map(id => parseInt(id, 10));


            for (const idBoleta of idsBoletas) {
                const boleta = await this.boletaService.findBoletaById(idBoleta);
                const { rut_apoderado } = boleta;
                const apoderado = await this.apoderadoService.findApoderadoByRut(rut_apoderado);

                await this.transaccionRepository.save({
                    boleta_id: idBoleta,
                    apoderado_id: apoderado.id,
                    estado_transaccion_id: 1,
                    webpay_transaccion_id: response.token,
                    monto: amount,
                    fecha_creacion: new Date(),
                    metodo_pago: null,
                    descripcion: 'Pago de boletas pendiente',
                    codigo_autorizacion: null,
                    codigo_respuesta: null,
                });

            }

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async confirmTransaction(token: string) {
        try {
            const response = await this.tx.commit(token);
            console.log(token);

            const { buy_order, amount, session_id, status, accounting_date, transaction_date, authorization_code, payment_type_code, response_code, vci } = response;
            const parts = buy_order.split('-');
            const rawIds = parts.slice(2);
            const idsBoletas = rawIds.map(id => parseInt(id, 10));

            // Determine transaction status based on VCI
            let estadoTransaccionId;
            switch (vci) {
                case 'TSY':
                case 'TSYS':
                case 'TSYF':
                    await this.updateTransactionStatus(token, 'aprobado');
                    estadoTransaccionId = 3; // Terminada
                    break;
                default:
                    estadoTransaccionId = 2; // Rechazada
                    break;
            }

            const boletas = [];
            const apoderados = new Map();
            const estudiantes = new Map();
            var correo = '';

            let totalPago = 0;
            for (const idBoleta of idsBoletas) {
                await this.boletaService.updateBoletaStatus(idBoleta, 2, buy_order);
                const boleta = await this.boletaService.findBoletaById(idBoleta);
                boletas.push(boleta);

                const total = typeof boleta.total === 'string' ? parseFloat(boleta.total) : boleta.total;
                totalPago += total;

                if (!apoderados.has(boleta.rut_apoderado)) {
                    const apoderado = await this.apoderadoService.findApoderadoByRut(boleta.rut_apoderado);
                    correo = apoderado.correo_apoderado;
                    apoderados.set(boleta.rut_apoderado, apoderado);
                }

                if (!estudiantes.has(boleta.rut_estudiante)) {
                    const estudiante = await this.estudianteService.findByRut(boleta.rut_estudiante);
                    estudiantes.set(boleta.rut_estudiante, estudiante);
                }

                // Buscar la transacción existente en la tabla Transacciones por boleta_id
                const transaccionExistente = await this.transaccionRepository.findOne({ where: { boleta_id: idBoleta } });

                if (!transaccionExistente) {
                    throw new NotFoundException(`Transaction for boleta_id ${idBoleta} not found`);
                }

                // Actualizar los campos necesarios en la transacción existente
                transaccionExistente.estado_transaccion_id = estadoTransaccionId;
                transaccionExistente.monto = total;
                transaccionExistente.fecha_actualizacion = new Date();
                transaccionExistente.metodo_pago = 'Venta Tarjeta';
                transaccionExistente.descripcion = 'Pago Colegiatura';
                transaccionExistente.codigo_autorizacion = authorization_code;
                transaccionExistente.codigo_respuesta = response_code;

                // Guardar los cambios en la base de datos
                await this.transaccionRepository.save(transaccionExistente);
            }

            const apoderadosHtml = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Nombre Apoderado</th>
                    <th>Rut Apoderado</th>
                    <th>Telefono</th>
                    <th>Correo</th>
                </tr>
                ${Array.from(apoderados.values()).map(apoderado => `
                    <tr>
                        <td>${apoderado.primer_nombre_apoderado} ${apoderado.segundo_nombre_apoderado} ${apoderado.primer_apellido_apoderado} ${apoderado.segundo_apellido_apoderado}</td>
                        <td>${apoderado.rut}-${apoderado.dv}</td>
                        <td>${apoderado.telefono}</td>
                        <td>${apoderado.correo_apoderado}</td>
                    </tr>
                `).join('')}
            </table>
        `;

            const boletasHtml = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Boleta ID</th>
                    <th>Detalle</th>
                    <th>Total</th>
                    <th>RUT Estudiante</th>
                    <th>Nombre Estudiante</th>
                </tr>
                ${boletas.map(boleta => {
                const estudiante = estudiantes.get(boleta.rut_estudiante);
                return `
                        <tr>
                            <td>${boleta.id}</td>
                            <td>${boleta.detalle}</td>
                            <td>$ ${Math.round(parseFloat(boleta.total))}</td>
                            <td>${boleta.rut_estudiante}</td>
                            <td>${estudiante ? `${estudiante.primer_nombre_alumno} ${estudiante.segundo_nombre_alumno} ${estudiante.primer_apellido_alumno} ${estudiante.segundo_apellido_alumno}` : ''}</td>
                        </tr>
                    `;
            }).join('')}
                <tr>
                    <td colspan="2"><strong>Total Pago</strong></td>
                    <td colspan="3"><strong>$ ${Math.round(totalPago)}</strong></td>
                </tr>
            </table>
        `;

            const correoHtmlApoderado = `
            <h4><strong>Confirmación de Transacción WebPay</strong></h4>
            <p>Estimado Usuario,</p>
            ${apoderadosHtml}
            <<p>Se ha realizado el pago de la o las siguentes boletas.</p>
            ${boletasHtml}
            <h3>Colegio Andes Chile – Educando con Amor</h3>
        `;

            const mailOptionsApoderado = {
                from: 'contacto@colegioandeschile.cl',
                to: correo,
                subject: 'Confirmación de Transferencia',
                html: correoHtmlApoderado,
            };

            const correoHtmlAdm = `
            <h4><strong>Confirmación de Transacción WebPay</strong></h4>
            <p>Estimado Administrador,</p>
            <p>El Apoderado: </p>
            ${apoderadosHtml}
            <p>Pagó la o las siguentes boletas.</p>
            ${boletasHtml}
            <p>La orden de compra asignada para este pago es: <strong>${buy_order}</strong></p>
            <h3>Colegio Andes Chile – Educando con Amor</h3>
        `;

            const mailOptionsAdm = {
                from: 'contacto@colegioandeschile.cl',
                to: 'adm.colegioandeschile@gmail.com',
                subject: 'Confirmación de Pago WebPay',
                html: correoHtmlAdm,
            };

            try {
                await this.correoService.enviarCorreo(mailOptionsApoderado);
                await this.correoService.enviarCorreo(mailOptionsAdm);
                console.log('Correo enviado con éxito TRANSACCION CONFIRM');
            } catch (error) {
                console.error('Error al enviar el correo:', error);
            }

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private async updateTransactionStatus(token: string, status: string) {
        const transaction = await this.transactionRepository.findOne({ where: { token } });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        transaction.status = status;
        await this.transactionRepository.save(transaction);
    }

    /* 
    para ver el estado es lo mismo debo utilizar status() -> const response = await tx.status(token);
    
    Reversar o Anular un pago -> const response = await tx.refund(token, amount);

    */

    async comprobarTransferencia(buy_order: string, correo: string) {
        const ordenCompra = "T-" + buy_order;
        const parts = buy_order.split("-");
        let rawIds: string[];
        if (parts.length === 3) {
            rawIds = parts.slice(2, 3);
        } else if (parts.length === 4) {
            rawIds = parts.slice(2, 4);
        }

        const idsBoletas = rawIds.map((rawId) => parseInt(rawId, 10));
        const boletas = [];
        const apoderados = new Map();
        const estudiantes = new Map();
        let totalPago = 0;

        for (const idBoleta of idsBoletas) {
            await this.boletaService.updateBoletaStatus(idBoleta, 5, ordenCompra);
            const boleta = await this.boletaService.findBoletaById(idBoleta);
            boletas.push(boleta);

            // Verifica si boleta.total es string y conviértelo a número
            const total = typeof boleta.total === 'string' ? parseFloat(boleta.total) : boleta.total;
            totalPago += total;

            // Obtener el apoderado usando el rut_apoderado
            if (!apoderados.has(boleta.rut_apoderado)) {
                const apoderado = await this.apoderadoService.findApoderadoByRut(boleta.rut_apoderado);
                apoderados.set(boleta.rut_apoderado, apoderado);
            }

            // Obtener el estudiante usando el rut_estudiante
            if (!estudiantes.has(boleta.rut_estudiante)) {
                const estudiante = await this.estudianteService.findByRut(boleta.rut_estudiante);
                estudiantes.set(boleta.rut_estudiante, estudiante);
            }
        }

        const apoderadosHtml = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Nombre Apoderado</th>
                    <th>Rut Apoderado</th>
                    <th>Telefono</th>
                    <th>Correo</th>
                </tr>
                ${Array.from(apoderados.values()).map(apoderado => `
                    <tr>
                        <td>${apoderado.primer_nombre_apoderado} ${apoderado.segundo_nombre_apoderado} ${apoderado.primer_apellido_apoderado} ${apoderado.segundo_apellido_apoderado}</td>
                        <td>${apoderado.rut}-${apoderado.dv}</td>
                        <td>${apoderado.telefono_apoderado}</td>
                        <td>${apoderado.correo_apoderado}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        const boletasHtml = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Boleta ID</th>
                    <th>Detalle</th>
                    <th>Total</th>
                    <th>RUT Estudiante</th>
                    <th>Nombre Estudiante</th>
                </tr>
                ${boletas.map(boleta => {
            const estudiante = estudiantes.get(boleta.rut_estudiante);
            return `
                        <tr>
                            <td>${boleta.id}</td>
                            <td>${boleta.detalle}</td>
                            <td>$ ${Math.round(parseFloat(boleta.total))}</td>
                            <td>${estudiante.rut}-${estudiante.dv}</td>
                            <td>${estudiante ? `${estudiante.primer_nombre_alumno} ${estudiante.segundo_nombre_alumno} ${estudiante.primer_apellido_alumno} ${estudiante.segundo_apellido_alumno}` : ''}</td>
                        </tr>
                    `;
        }).join('')}
                <tr>
                    <td colspan="2"><strong>Total Pago</strong></td>
                    <td colspan="3"><strong>$ ${Math.round(totalPago)}</strong></td>
                </tr>
            </table>
        `;

        const correoHtmlAdm = `
            <h4><strong>Nueva Solicitud de Confirmación de Transferencia</strong></h4>
            <p>Estimado Administrador,</p>
            <p>La orden de compra <strong>${ordenCompra}</strong> está en proceso de verificación.</p>
            ${apoderadosHtml}
            <br>
            ${boletasHtml}
            <p><b>Próximas 24 horas para confirmar.</b></p>
            <h3>Colegio Andes Chile – Educando con Amor</h3>
        `;

        const mailOptionsAdm = {
            from: 'contacto@colegioandeschile.cl',
            to: 'adm.colegioandeschile@gmail.com',
            subject: 'Confirmación de Transferencia',
            html: correoHtmlAdm,
        };

        const correoHtmlApoderado = `
            <h4><strong>Confirmación de Transferencia</strong></h4>
            <p>Estimado usuario,</p>
            ${apoderadosHtml}
            <p>Su orden de compra <strong>${ordenCompra}</strong> está en proceso de verificación.</p>
            ${boletasHtml}
            <p>Será confirmada dentro de las próximas 24 horas.</p>
            <p>Gracias por su paciencia.</p>
            <h3>Colegio Andes Chile – Educando con Amor</h3>
        `;

        const mailOptionsApoderado = {
            from: 'contacto@colegioandeschile.cl',
            to: correo,
            subject: 'Confirmación de Transferencia',
            html: correoHtmlApoderado,
        };

        try {
            await this.correoService.enviarCorreo(mailOptionsAdm);
            await this.correoService.enviarCorreo(mailOptionsApoderado);
            console.log('Correo enviado con éxito, CONFIRM TRANSFERENCIA');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }
    }

    async createTransactionForCertificados(buyOrder: string, sessionId: string, amount: number, returnUrl: string) {
        try {
            const response = await this.tx.create(buyOrder, sessionId, amount, returnUrl);

            // Save transaction to database
            await this.transactionRepository.save({
                buyOrder: buyOrder,
                sessionId: sessionId,
                amount: amount,
                token: response.token,
                status: 'pendiente',
            });

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async confirmTransactionForCertificados(token: string) {
        try {
            const response = await this.tx.commit(token);
            console.log("Token:", token);

            const { buy_order, amount, session_id, status, accounting_date, transaction_date, authorization_code, payment_type_code, response_code, vci } = response;

            const parts = buy_order.split('-');

            const updateData = {
                isPagada: true,
                pagadaAt: new Date(),
            };

            const updatedRecords = await Promise.all(
                parts.map(async (uniqueIdPago) => {
                    const record = await this.pdfValidadorService.updatePay(uniqueIdPago, updateData);
                    return {
                        primerNombreAlumno: record.primerNombreAlumno,
                        segundoNombreAlumno: record.segundoNombreAlumno ?? undefined,
                        primerApellidoAlumno: record.primerApellidoAlumno,
                        segundoApellidoAlumno: record.segundoApellidoAlumno,
                        certificateType: record.certificateType,
                    };
                })
            );

            let estadoTransaccionId;
            console.log(vci);

            switch (vci) {
                case 'TSY':
                case 'TSYS':
                case 'TSYF':
                    await this.updateTransactionStatus(token, 'aprobado');
                    estadoTransaccionId = 3; // Terminada
                    break;
                default:
                    estadoTransaccionId = 2; // Rechazada
                    break;
            }

            return { response, updatedRecords };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


}


// const updateData = {
//     isPagada: true,
//     pagadaAt: new Date(),
// };

// const updatedRecord = await this.pdfValidadorService.update(id, updateData);
// delete updatedRecord.validationCode;

// const correoHtmlApoderado = `
//     <h4><strong>Confirmación de Transferencia</strong></h4>
//     <p>Estimado usuario,</p>
//     ${apoderadosHtml}
//     <p>Su orden de compra <strong>${buy_order}</strong> está en proceso de verificación.</p>
//     ${boletasHtml}
//     <p>Será confirmada dentro de las próximas 24 horas.</p>
//     <p>Gracias por su paciencia.</p>
//     <h3>Colegio Andes Chile – Educando con Amor</h3>
// `;

// const mailOptionsApoderado = {
//     from: 'contacto@colegioandeschile.cl',
//     to: correo,
//     subject: 'Confirmación de Transferencia',
//     html: correoHtmlApoderado,
// };