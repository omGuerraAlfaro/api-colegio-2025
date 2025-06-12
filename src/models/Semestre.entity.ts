import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Nota } from './Notas.entity';
import { Asistencia } from './Asistencia.entity';
import { Evaluacion } from './Evaluacion.entity';
import { EvaluacionPreBasica } from './EvaluacionPreBasica.entity';

@Entity('semestres')
export class Semestre {
    @PrimaryGeneratedColumn()
    id_semestre: number;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;

    @Column({ type: 'date' })
    fecha_inicio: Date;

    @Column({ type: 'date' })
    fecha_fin: Date;

    @Column({ type: 'boolean', default: false })
    semestreCerrado: boolean;

    @OneToMany(() => Asistencia, (asistencia) => asistencia.semestre)
    asistencias: Asistencia[];

    @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.asignatura)
    evaluaciones: Evaluacion[];

    @OneToMany(() => EvaluacionPreBasica, (evaluacion) => evaluacion.asignatura)
    evaluacionesprebasica: EvaluacionPreBasica[];
}
