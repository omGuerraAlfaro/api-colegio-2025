import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Asignatura } from './Asignatura.entity';
import { Semestre } from './Semestre.entity';
import { Nota } from './Notas.entity';
import { TipoEvaluacion } from './TipoEvaluacion.entity';

@Entity('evaluaciones')
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 50 })
    nombre_evaluacion: string; // Ejemplo: 'Parcial 1', 'Tarea 2', 'Nota Final'

    // @Column({ type: 'varchar', length: 30 })
    // tipo_evaluacion: string; // Ejemplo: 'Examen', 'Tarea', 'Proyecto', 'Final'

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
