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
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';

@Entity()
export class Estudiante {
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

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column({ type: 'date', nullable: true })
    fecha_matricula: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono_contacto: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    genero: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergico_alimento: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergico_medicamentos: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    vive_con: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    enfermedad_cronica: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    prevision: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    nacionalidad: string;

    @Column({ type: 'boolean', default: false })
    es_pae: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    consultorio_clinica: string;

    @Column({ type: 'boolean', default: false })
    vacuna_covid: boolean;

    @Column({ type: 'boolean', default: false })
    fotografia: boolean;

    @Column({ type: 'boolean', default: false })
    apto_ed_fisica: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    observaciones: string;

    @OneToMany(() => AnotacionesEstudiante, anotacioneEstudiante => anotacioneEstudiante.estudiante)
    anotacionesConnection: AnotacionesEstudiante[];

    @OneToMany(() => ApoderadoEstudiante, apoderadoEstudiante => apoderadoEstudiante.estudiante)
    apoderadosConnection: ApoderadoEstudiante[];

    @OneToMany(() => EstudianteCurso, cursoEstudiante => cursoEstudiante.estudiante)
    cursoConnection: EstudianteCurso[];
}
