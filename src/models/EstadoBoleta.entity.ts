import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Boleta } from "./Boleta.entity";

@Entity('estado_boleta')
export class EstadoBoleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descripcion: string;

    @OneToMany(() => Boleta, boleta => boleta.estadoBoleta)
    boletas: Boleta[];
}