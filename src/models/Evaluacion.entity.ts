import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Nota } from './Notas.entity';

@Entity('evaluaciones')
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column({ type: 'varchar', length: 50 })
    tipo_evaluacion: string;

    @OneToMany(() => Nota, (nota) => nota.evaluacion)
    notas: Nota[];
}
