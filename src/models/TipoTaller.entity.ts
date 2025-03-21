import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { InscripcionTaller } from './InscripcionTaller.entity';

@Entity('tipo_taller')
export class TipoTaller {
    @PrimaryGeneratedColumn()
    id_taller: number;

    @Column({ type: 'varchar', length: 30 })
    descripcion_taller: string;

    @OneToMany(() => InscripcionTaller, inscripcion => inscripcion.tipo_taller)
    inscripciones: InscripcionTaller[];

}
