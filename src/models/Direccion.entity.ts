import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { ApoderadoDireccion } from './ApoderadoDireccion.entity';
import { Ciudad } from './Ciudad.entity';

@Entity()
export class Direccion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    calle: string;

    @Column({ type: 'int' })
    ciudad_id: number;

    @Column({ type: 'varchar', length: 50 })
    codigo_postal: string;

    @Column({ type: 'varchar', length: 50 })
    departamento: string;

    @OneToMany(() => ApoderadoDireccion, apoderadoDireccion => apoderadoDireccion.apoderado)
    direccionConnection: ApoderadoDireccion[];

    @ManyToOne(() => Ciudad, ciudad => ciudad.id)
    @JoinColumn({ name: 'ciudad_id' })
    ciudad: Ciudad;

}
