import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';

@Entity()
export class ApoderadoEstudiante {
    @PrimaryColumn()
    apoderado_id: number;

    @PrimaryColumn()
    estudiante_id: number;

    @ManyToOne(
        type => Apoderado,
        apoderado => apoderado.estudiantesConnection
    )
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @ManyToOne(
        type => Estudiante,
        estudiante => estudiante.apoderadosConnection
    )
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;
}
