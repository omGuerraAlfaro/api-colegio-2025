import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Asistencia } from './Asistencia.entity';

@Entity('calendario_asistencias')
export class CalendarioAsistencia {
    @PrimaryGeneratedColumn()
    id_dia: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'boolean', default: true })
    es_clase: boolean;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @OneToMany(() => Asistencia, (asistencia) => asistencia.calendario)
    asistencias: Asistencia[];
}
