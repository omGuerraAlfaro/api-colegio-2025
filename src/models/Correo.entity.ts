import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('correo_smtp')
export class Correo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    host_smtp: string;

    @Column()
    port_smtp: number;

    @Column()
    user_smtp: string;

    @Column()
    pass_smtp: string;

}