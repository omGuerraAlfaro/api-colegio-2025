import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestreController } from './semestre.controller';
import { Semestre } from 'src/models/Semestre.entity';
import { SemestreService } from './semestre.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Semestre
    ]),
  ],
  controllers: [SemestreController],
  providers: [SemestreService],
  exports: [TypeOrmModule],
})
export class SemestreModule {}
