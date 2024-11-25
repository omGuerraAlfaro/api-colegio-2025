import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarioEscolarService } from './calendario-escolar.service';
import { CalendarioEscolarController } from './calendario-escolar.controller';
import { CalendarioEscolar } from 'src/models/CalendarioEscolar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalendarioEscolar
    ]),
  ],
  controllers: [CalendarioEscolarController],
  providers: [CalendarioEscolarService],
  exports: [TypeOrmModule],
})
export class CalendarioEscolarModule {}
