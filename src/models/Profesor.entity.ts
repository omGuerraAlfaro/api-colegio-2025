import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Curso } from './Curso.entity';
import { Usuarios } from './User.entity';

@Entity()
export class Profesor {
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

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo_electronico: string;

    @OneToMany(() => Curso, curso => curso.profesorConnection)
    cursoConnection: Curso[];

    @OneToOne(() => Usuarios, usuario => usuario.profesor)
    usuario: Usuarios;

}
