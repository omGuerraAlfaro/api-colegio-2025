import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';
import { Asignatura } from './Asignatura.entity';

@Entity('notas')
export class Nota {
    @PrimaryGeneratedColumn()
    id_nota: number;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.notas)
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => Curso, (curso) => curso.notas)
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => Asignatura, (asignatura) => asignatura.notas)
    @JoinColumn({ name: 'id_asignatura' })
    asignatura: Asignatura;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    nota: number;

    @Column({ type: 'date' })
    fecha: Date;
}
