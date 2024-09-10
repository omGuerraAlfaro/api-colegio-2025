import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estado_transaccion')
export class EstadoTransaccion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descripcion: string;
}