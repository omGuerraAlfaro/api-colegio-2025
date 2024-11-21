import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { CalendarioEscolar } from './CalendarioEscolar.entity';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';

@Entity('asistencia')
export class Asistencia {
    @PrimaryGeneratedColumn()
    id_asistencia: number;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.asistencias)
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => Curso, (curso) => curso.asistencias)
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => CalendarioEscolar, (calendario) => calendario.asistencias)
    @JoinColumn({ name: 'id_dia' })
    calendario: CalendarioEscolar;

    @Column({ type: 'varchar', length: 20 })
    estado: string; // Presente, Ausente, Tardanza, etc.
}
