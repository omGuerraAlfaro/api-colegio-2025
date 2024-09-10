import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiasController } from './noticias.controller';
import { NoticiasService } from './noticias.service';
import { NoticiasColegio, NoticiasImages } from 'src/models/Noticias.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoticiasColegio, NoticiasImages
    ]),
  ],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}
