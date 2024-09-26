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
import { ApoderadoSuplenteEstudiante } from './ApoderadoSuplenteEstudiante.entity';

@Entity()
export class ApoderadoSuplente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    primer_nombre: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_nombre: string;

    @Column({ type: 'varchar', length: 150 })
    primer_apellido: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_apellido: string;

    @Column({ nullable: true })
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    correo_electronico: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    estado_civil: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    nacionalidad: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    actividad: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    escolaridad: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    parentesco: string;

    @OneToMany(() => Boleta, boleta => boleta.apoderado)
    boletas: Boleta[];

    @OneToMany(() => ApoderadoSuplenteEstudiante, apoderadoEstudiante => apoderadoEstudiante.apoderado)
    estudiantesConnection: ApoderadoSuplenteEstudiante[];

    @OneToMany(() => ApoderadoDireccion, apoderadoDireccion => apoderadoDireccion.direccion)
    direccionConnection: ApoderadoDireccion[];

    estudiantes?: Estudiante[];
}
