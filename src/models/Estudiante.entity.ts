import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';
import { EstudianteCurso } from './CursoEstudiante.entity';
import { InfoPae } from './InfoPae.entity';
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';

@Entity()
export class Estudiante {
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

    @Column()
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono_contacto: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    genero: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergico: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    vive_con: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    enfermedad_cronica: string;

    // @Column({ type: 'int', nullable: true })
    // pae_id: number | null;

    @OneToMany(() => AnotacionesEstudiante, anotacioneEstudiante => anotacioneEstudiante.estudiante)
    anotacionesConnection: AnotacionesEstudiante[];

    @OneToMany(() => ApoderadoEstudiante, apoderadoEstudiante => apoderadoEstudiante.estudiante)
    apoderadosConnection: ApoderadoEstudiante[];

    @OneToMany(() => EstudianteCurso, cursoEstudiante => cursoEstudiante.estudiante)
    cursoConnection: EstudianteCurso[];

    @ManyToOne(() => InfoPae, infoPae => infoPae.id)
    @JoinColumn({ name: 'pae_id' }) 
    infoPae: InfoPae;
}
