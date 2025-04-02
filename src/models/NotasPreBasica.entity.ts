import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { EvaluacionPreBasica } from './EvaluacionPreBasica.entity';

@Entity('notas_prebasica')
export class NotaPreBasica {
    @PrimaryGeneratedColumn()
    id_nota: number;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.notas)
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => EvaluacionPreBasica, (evaluacion) => evaluacion.notas)
    @JoinColumn({ name: 'id_evaluacion' })
    evaluacion: EvaluacionPreBasica;

    @Column({ type: 'varchar', length: 5 })
    nota: string;

    @Column({ type: 'date' })
    fecha: Date;
}
