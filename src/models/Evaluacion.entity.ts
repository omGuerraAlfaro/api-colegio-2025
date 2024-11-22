import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Curso } from './Curso.entity';
import { Asignatura } from './Asignatura.entity';
import { Semestre } from './Semestre.entity';
import { Nota } from './Notas.entity';

@Entity('evaluaciones')
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @ManyToOne(() => Curso, (curso) => curso.evaluaciones)
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => Asignatura, (asignatura) => asignatura.evaluaciones)
    @JoinColumn({ name: 'id_asignatura' })
    asignatura: Asignatura;

    @ManyToOne(() => Semestre, (semestre) => semestre.evaluaciones)
    @JoinColumn({ name: 'id_semestre' })
    semestre: Semestre;

    @Column({ type: 'varchar', length: 50 })
    tipo_evaluacion: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    peso: number;

    @Column({ type: 'date' })
    fecha: Date;

    @OneToMany(() => Nota, (nota) => nota.evaluacion)
    notas: Nota[];
}
