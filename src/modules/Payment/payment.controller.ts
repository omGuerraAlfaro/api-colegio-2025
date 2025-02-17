// payment.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { ConfirmTransactionDto } from '../../dto/confirm-transaction.dto';
import { ConfirmTransfDto } from 'src/dto/confirmTran.dto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('initiate')
    async initiate(@Body(ValidationPipe) createTransactionDto: CreateTransactionDto): Promise<any> {
        const response = await this.paymentService.createTransaction(
            createTransactionDto.buyOrder,
            createTransactionDto.sessionId,
            createTransactionDto.amount,
            createTransactionDto.returnUrl
        );
        return response;
    }

    @Post('confirm')
    async confirm(@Body(ValidationPipe) confirmTransactionDto: ConfirmTransactionDto): Promise<any> {
        const transactionResult = await this.paymentService.confirmTransaction(confirmTransactionDto.token);
        return transactionResult;
    }

    @Post('confirmacionTransferencia')
    async confirmacionTransferencia(@Body() confirmTranfDTO: ConfirmTransfDto): Promise<any> {
        const confirmResult = await this.paymentService.comprobarTransferencia(confirmTranfDTO.buy_order, confirmTranfDTO.correo)
        return confirmResult;
    }

    @Post('initiate/certificado')
    async initiateCertificado(@Body(ValidationPipe) createTransactionDto: CreateTransactionDto): Promise<any> {
        const response = await this.paymentService.createTransactionForCertificados(
            createTransactionDto.buyOrder,
            createTransactionDto.sessionId,
            createTransactionDto.amount,
            createTransactionDto.returnUrl
        );
        return response;
    }

    @Post('confirm/certificado')
    async confirmCertificado(@Body(ValidationPipe) confirmTransactionDto: ConfirmTransactionDto): Promise<any> {
        const transactionResult = await this.paymentService.confirmTransactionForCertificados(confirmTransactionDto.token);
        return transactionResult;
    }
}

