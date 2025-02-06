import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { NoticiasImages } from 'src/models/Noticias.entity';

@Module({
  imports: [
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
