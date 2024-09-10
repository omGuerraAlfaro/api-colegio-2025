import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';

@Entity()
export class EstudianteCurso {
    @PrimaryColumn()
    curso_id: number;

    @PrimaryColumn()
    estudiante_id: number;

    @ManyToOne(
        type => Curso,
        curso => curso.cursoConnection
    )
    @JoinColumn({ name: 'curso_id' })
    curso: Curso;

    @ManyToOne(
        type => Estudiante,
        estudiante => estudiante.cursoConnection
    )
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;
}
