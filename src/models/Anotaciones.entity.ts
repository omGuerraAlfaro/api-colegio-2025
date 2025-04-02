import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';
import { Asignatura } from './Asignatura.entity';
import { AsignaturaPreBasica } from './AsignaturaPreBasica.entity';

@Entity()
export class Anotacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    anotacion_titulo: string;

    @Column({ type: 'varchar', length: 1000 })
    anotacion_descripcion: string;

    @CreateDateColumn({ nullable: false })
    fecha_ingreso: Date;

    @Column({ type: 'boolean', default: false })
    es_positiva: boolean;

    @Column({ type: 'boolean', default: false })
    es_negativa: boolean;

    @Column({ type: 'boolean', default: false })
    es_neutra: boolean;

    @Column({ type: 'boolean', default: true })
    anotacion_estado: boolean;

    @ManyToOne(() => Asignatura, { nullable: true })
    @JoinColumn({ name: 'asignatura_id' })
    asignatura: Asignatura;

    @ManyToOne(() => AsignaturaPreBasica, { nullable: true })
    @JoinColumn({ name: 'asignatura_prebasica_id' })
    asignaturaPreBasica: AsignaturaPreBasica;

    @OneToMany(() => AnotacionesEstudiante, anotacionesEstudiante => anotacionesEstudiante.anotacion, {
        cascade: true,
    })
    estudiantesConnection: AnotacionesEstudiante[];

}
