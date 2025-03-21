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
import { Asistencia } from './Asistencia.entity';
import { Nota } from './Notas.entity';
import { ApoderadoSuplenteEstudiante } from './ApoderadoSuplenteEstudiante.entity';
import { InscripcionTaller } from './InscripcionTaller.entity';

@Entity()
export class Estudiante {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    primer_nombre_alumno: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_nombre_alumno: string;

    @Column({ type: 'varchar', length: 150 })
    primer_apellido_alumno: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_apellido_alumno: string;

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento_alumno: Date;

    @Column({ type: 'date', nullable: true })
    fecha_matricula: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    genero_alumno: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergia_alimento_alumno: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergia_medicamento_alumno: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    vive_con: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    enfermedad_cronica_alumno: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    prevision_alumno: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    nacionalidad: string;

    @Column({ type: 'boolean', default: false })
    es_pae: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    consultorio_clinica_alumno: string;

    @Column({ type: 'boolean', default: false })
    autorizacion_fotografias: boolean;

    @Column({ type: 'boolean', default: false })
    apto_educacion_fisica: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    observaciones_alumno: string;

    @Column({ type: 'boolean', default: true })
    estado_estudiante: boolean;

    @OneToMany(() => AnotacionesEstudiante, anotacioneEstudiante => anotacioneEstudiante.estudiante)
    anotacionesConnection: AnotacionesEstudiante[];

    @OneToMany(() => ApoderadoEstudiante, apoderadoEstudiante => apoderadoEstudiante.estudiante)
    apoderadosConnection: ApoderadoEstudiante[];

    @OneToMany(() => ApoderadoEstudiante, apoderadoSuplenteEstudiante => apoderadoSuplenteEstudiante.estudiante)
    apoderadosSuplenteConnection: ApoderadoSuplenteEstudiante[];

    @OneToMany(() => EstudianteCurso, cursoEstudiante => cursoEstudiante.estudiante)
    cursoConnection: EstudianteCurso[];

    @OneToMany(() => Asistencia, (asistencia) => asistencia.estudiante)
    asistencias: Asistencia[];

    @OneToMany(() => Nota, (nota) => nota.estudiante)
    notas: Nota[];

    @OneToMany(() => InscripcionTaller, inscripcionTaller => inscripcionTaller.estudiante)
    inscripciones: InscripcionTaller[];


}
