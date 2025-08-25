import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionPreBasica } from "./EvaluacionPreBasica.entity";
import { CalendarioEscolar } from "./CalendarioEscolar.entity";

@Entity('asignatura_prebasica')
export class AsignaturaPreBasica {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_asignatura: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ default: true })
    estado_asignatura: boolean;

    @OneToMany(() => EvaluacionPreBasica, (evaluacion) => evaluacion.asignatura)
    evaluaciones: EvaluacionPreBasica[];

    @OneToMany(() => CalendarioEscolar, (calendario) => calendario.asignaturaPreBasica)
    calendario: CalendarioEscolar[];
}