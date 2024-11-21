import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Asistencia } from './Asistencia.entity';

@Entity('calendario_escolar')
export class CalendarioEscolar {
    @PrimaryGeneratedColumn()
    id_dia: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'varchar', length: 20 })
    tipo: string; // Clase, Feriado, Evento, etc.

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @OneToMany(() => Asistencia, (asistencia) => asistencia.calendario)
    asistencias: Asistencia[];
}
