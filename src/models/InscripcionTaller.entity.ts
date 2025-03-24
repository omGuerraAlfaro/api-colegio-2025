import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { TipoTaller } from './TipoTaller.entity';
import { Curso } from './Curso.entity';

@Entity()
export class InscripcionTaller {
    @PrimaryGeneratedColumn()
    id_inscripcion: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.inscripciones, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => Curso, curso => curso.inscripciones, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => TipoTaller, tipo_taller => tipo_taller.inscripciones, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_tipo_taller' })
    tipo_taller: TipoTaller;
    

    @Column({ type: 'date', nullable: true })
    fecha_inscripcion: Date;
}
