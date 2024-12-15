import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Evaluacion } from './Evaluacion.entity';
import { Nota } from './Notas.entity';
import { Asistencia } from './Asistencia.entity';

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

    @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.semestre)
    evaluaciones: Evaluacion[];

    @OneToMany(() => Nota, (nota) => nota.semestre)
    notas: Nota[];

    @OneToMany(() => Asistencia, (asistencia) => asistencia.semestre)
    asistencias: Asistencia[];
}
