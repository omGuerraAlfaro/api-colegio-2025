import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Evaluacion } from './Evaluacion.entity';

@Entity('tipo_evaluacion')
export class TipoEvaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 30 })
    tipo_evaluacion: string;

    @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.id_tipo_evaluacion)
    evaluaciones: Evaluacion[];
}
