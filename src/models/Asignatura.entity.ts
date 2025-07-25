import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nota } from "./Notas.entity";
import { Evaluacion } from "./Evaluacion.entity";
import { CalendarioEscolar } from "./CalendarioEscolar.entity";

@Entity('asignatura')
export class Asignatura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_asignatura: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ default: true })
    estado_asignatura: boolean;

    @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.asignatura)
    evaluaciones: Evaluacion[];

    @OneToMany(() => CalendarioEscolar, (calendario) => calendario.asignatura)
    calendario: CalendarioEscolar[]; 

}