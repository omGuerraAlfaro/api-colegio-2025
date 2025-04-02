import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Semestre } from './Semestre.entity';
import { Curso } from './Curso.entity';
import { NotaPreBasica } from './NotasPreBasica.entity';
import { AsignaturaPreBasica } from './AsignaturaPreBasica.entity';
import { TipoEvaluacionPreBasica } from './TipoEvaluacionPreBasica.entity';

@Entity('evaluaciones_prebasica')
export class EvaluacionPreBasica {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 50 })
    nombre_evaluacion: string;

    @ManyToOne(() => Curso, (curso) => curso.evaluacion)
    @JoinColumn({ name: 'id_curso' })
    curso: Curso;

    @ManyToOne(() => AsignaturaPreBasica, (asignatura) => asignatura.evaluaciones)
    @JoinColumn({ name: 'id_asignatura' })
    asignatura: AsignaturaPreBasica;

    @ManyToOne(() => Semestre, (semestre) => semestre.evaluacionesprebasica)
    @JoinColumn({ name: 'id_semestre' })
    semestre: Semestre;

    @OneToMany(() => NotaPreBasica, (nota) => nota.evaluacion)
    notas: NotaPreBasica[];

    @ManyToOne(() => TipoEvaluacionPreBasica, (tipoEvaluacion) => tipoEvaluacion.evaluaciones, { nullable: false })
    @JoinColumn({ name: 'id_tipo_evaluacion' })
    id_tipo_evaluacion: TipoEvaluacionPreBasica;
}
