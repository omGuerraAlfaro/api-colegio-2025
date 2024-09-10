import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Estudiante } from "./Estudiante.entity";

@Entity('info_pae')
export class InfoPae {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valor: number;

    @Column()
    descripcion: string;

    @OneToMany(() => Estudiante, estudiante => estudiante.infoPae)
    estudiantesPae: Estudiante[];
}