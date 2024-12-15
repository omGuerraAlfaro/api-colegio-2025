import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';
import { Semestre } from './Semestre.entity';
import { CalendarioAsistencia } from './CalendarioAsistencia';

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

    @ManyToOne(() => CalendarioAsistencia, (calendario) => calendario.asistencias)
    @JoinColumn({ name: 'id_dia' })
    calendario: CalendarioAsistencia;

    @ManyToOne(() => Semestre, (semestre) => semestre.asistencias)
    @JoinColumn({ name: 'id_semestre' })
    semestre: Semestre;

    @Column({ type: 'varchar', length: 20 })
    estado: string; // Presente, Ausente, Tardanza, etc.
}
