import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Usuarios } from './User.entity';

@Entity()
export class Administrador {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    primer_nombre: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    segundo_nombre: string;

    @Column({ type: 'varchar', length: 50 })
    primer_apellido: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    segundo_apellido: string;

    @Column({ nullable: true })
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo_electronico: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    genero: string;

    @OneToOne(() => Usuarios, usuario => usuario.administrador)
    usuario: Usuarios;

}
