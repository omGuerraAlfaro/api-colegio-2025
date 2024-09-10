import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';
import { Estudiante } from './Estudiante.entity';
import { ApoderadoDireccion } from './ApoderadoDireccion.entity';
import { Direccion } from './Direccion.entity';
import { Usuarios } from './User.entity';
import { Boleta } from './Boleta.entity';

@Entity()
export class Apoderado {
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

    @Column({ type: 'varchar', length: 20, nullable: true })
    estado_civil: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nacionalidad: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    actividad: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    escolaridad: string;

    @Column({ type: 'double', nullable: true })
    descuento_asignado: number;

    @OneToMany(() => Boleta, boleta => boleta.apoderado)
    boletas: Boleta[];

    @OneToMany(() => ApoderadoEstudiante, apoderadoEstudiante => apoderadoEstudiante.apoderado)
    estudiantesConnection: ApoderadoEstudiante[];

    @OneToMany(() => ApoderadoDireccion, apoderadoDireccion => apoderadoDireccion.direccion)
    direccionConnection: ApoderadoDireccion[];

    @OneToOne(() => Usuarios, usuario => usuario.apoderado)
    usuario: Usuarios;

    addStudent(student: Estudiante) {
        const connection = new ApoderadoEstudiante();
        connection.apoderado = this;
        connection.estudiante = student;
        this.estudiantesConnection.push(connection);
    }

    addAddress(address: Direccion) {
        const connection = new ApoderadoDireccion();
        connection.apoderado = this;
        connection.direccion = address;
        this.direccionConnection.push(connection);
    }
    estudiantes?: Estudiante[];
}
