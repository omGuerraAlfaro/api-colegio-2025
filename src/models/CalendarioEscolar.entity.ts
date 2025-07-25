import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { Curso } from './Curso.entity';
import { Asignatura } from './Asignatura.entity';

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

    @ManyToOne(() => Curso, (curso) => curso.calendario, { nullable: true })
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => Asignatura, (asignatura) => asignatura.calendario, { nullable: true })
    @JoinColumn({ name: 'id_asignatura' })
    asignatura: Asignatura;
}
