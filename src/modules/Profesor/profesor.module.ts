import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorController } from './profesor.controller';
import { ProfesorService } from './profesor.service';
import { Profesor } from 'src/models/Profesor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profesor,
    ]),
  ],
  controllers: [ProfesorController],
  providers: [ProfesorService],
})
export class ProfesorModule { }
