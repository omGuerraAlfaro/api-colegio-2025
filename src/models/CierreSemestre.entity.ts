import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { Curso } from './Curso.entity';

@Entity()
export class CierreSemestre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    anio: number;

    @Column({ type: 'int' })
    semestre: number;

    @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
    nota_final: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    asistencia_final: number;

    @Column({ type: 'varchar', length: 5, nullable: true })
    concepto_final: string;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_cierre: Date;

    @ManyToOne(() => Estudiante, estudiante => estudiante.cierresConnection, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Curso)
    @JoinColumn({ name: 'curso_id' })
    curso: Curso;
}
