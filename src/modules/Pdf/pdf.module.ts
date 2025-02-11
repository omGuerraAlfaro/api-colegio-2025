import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PdfValidadorModule } from '../Pdf-Validador/pdf-validador.module';

@Module({
  imports: [PdfValidadorModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule { }
