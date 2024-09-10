export class CreateNoticiaDto {
    fecha: Date;
    titulo: string;
    description: string;
}

export class CreateImageDto {
    imageData: string;
}

export class CreateFullNoticiaDto {
    noticia: CreateNoticiaDto;
    images: CreateImageDto[];
}