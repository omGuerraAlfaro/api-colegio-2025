import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Asignatura } from './Asignatura.entity';
import { Semestre } from './Semestre.entity';
import { Nota } from './Notas.entity';
import { TipoEvaluacion } from './TipoEvaluacion.entity';
import { Curso } from './Curso.entity';

@Entity('evaluaciones')
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 225 })
    nombre_evaluacion: string;

    @ManyToOne(() => Curso, (curso) => curso.evaluacion)
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => Asignatura, (asignatura) => asignatura.evaluaciones)
    @JoinColumn({ name: 'id_asignatura' })
    asignatura: Asignatura;

    @ManyToOne(() => Semestre, (semestre) => semestre.evaluaciones)
    @JoinColumn({ name: 'id_semestre' })
    semestre: Semestre;

    @OneToMany(() => Nota, (nota) => nota.evaluacion)
    notas: Nota[];

    @ManyToOne(() => TipoEvaluacion, (tipoEvaluacion) => tipoEvaluacion.evaluaciones, { nullable: false })
    @JoinColumn({ name: 'id_tipo_evaluacion' })
    id_tipo_evaluacion: TipoEvaluacion;
}
