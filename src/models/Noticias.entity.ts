import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinColumn
} from "typeorm";

@Entity('noticias_colegio')
export class NoticiasColegio {
    @PrimaryGeneratedColumn()
    noticiaId: number;

    @Column()
    src: string;

    @Column('date')
    fecha: Date;

    @Column()
    titulo: string;

    @Column('text')
    description: string;

    @Column({ default: 0 })
    likes_count: number;

    @OneToMany(() => NoticiasImages, image => image.noticia, { cascade: true })
    images: NoticiasImages[];
}

@Entity('noticias_images')
export class NoticiasImages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('mediumblob')
    image_data: Buffer;

    @ManyToOne(() => NoticiasColegio, noticia => noticia.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'noticiaId' })
    noticia: NoticiasColegio;

}
