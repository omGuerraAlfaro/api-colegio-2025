import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EvaluacionPreBasica } from './EvaluacionPreBasica.entity';

@Entity('tipo_evaluacion_prebasica')
export class TipoEvaluacionPreBasica {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 30 })
    tipo_evaluacion: string;

    @OneToMany(() => EvaluacionPreBasica, (evaluacion) => evaluacion.id_tipo_evaluacion)
    evaluaciones: EvaluacionPreBasica[];
}
