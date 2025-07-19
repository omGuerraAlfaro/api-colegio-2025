import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Profesor } from './Profesor.entity';
import { EstudianteCurso } from './CursoEstudiante.entity';
import { Estudiante } from './Estudiante.entity';
import { Asistencia } from './Asistencia.entity';
import { Nota } from './Notas.entity';
import { Evaluacion } from './Evaluacion.entity';
import { InscripcionTaller } from './InscripcionTaller.entity';
import { CalendarioEscolar } from './CalendarioEscolar.entity';
@Entity()
export class Curso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nombre: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nivel_grado: string;

    @ManyToOne(() => Profesor, profesor => profesor.cursoConnection)
    @JoinColumn({ name: 'profesor_id' })
    profesorConnection: Profesor;

    @OneToMany(() => EstudianteCurso, cursoEstudiante => cursoEstudiante.curso)
    cursoConnection: EstudianteCurso[];

    @OneToMany(() => Asistencia, asistencia => asistencia.curso)
    asistencias: Asistencia[];

    @ManyToOne(() => Evaluacion, (evaluacion) => evaluacion.notas)
    @JoinColumn({ name: 'id_evaluacion' })
    evaluacion: Evaluacion;

    @OneToMany(() => InscripcionTaller, inscripcionTaller => inscripcionTaller.estudiante)
    inscripciones: InscripcionTaller[];

    @OneToMany(() => CalendarioEscolar, (calendario) => calendario.curso)
    calendario: CalendarioEscolar[];

    addStudent(student: Estudiante) {
        const connection = new EstudianteCurso();
        connection.curso = this;
        connection.estudiante = student;
        this.cursoConnection.push(connection);
    }

}