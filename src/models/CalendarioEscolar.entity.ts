import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';

@Entity('calendario_escolar')
export class CalendarioEscolar {
    @PrimaryGeneratedColumn()
    id_dia: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'varchar', length: 20 })
    tipo: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;
}
