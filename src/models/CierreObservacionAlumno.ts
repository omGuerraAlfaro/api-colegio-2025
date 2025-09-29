import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';

@Entity()
export class CierreObservacionAlumno {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 800, nullable: true })
    observacion: string;

    @ManyToOne(() => Estudiante, estudiante => estudiante.cierresObsConnection, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;
}
