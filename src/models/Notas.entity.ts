import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';
import { Asignatura } from './Asignatura.entity';
import { Evaluacion } from './Evaluacion.entity';
import { Semestre } from './Semestre.entity';

@Entity('notas')
export class Nota {
    @PrimaryGeneratedColumn()
    id_nota: number;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.notas)
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => Evaluacion, (evaluacion) => evaluacion.notas)
    @JoinColumn({ name: 'id_evaluacion' })
    evaluacion: Evaluacion;

    @Column({ type: 'decimal', precision: 2, scale: 1 })
    nota: number;

    @Column({ type: 'date' })
    fecha: Date;
}
