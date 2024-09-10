import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';
import { Anotacion } from './Anotaciones.entity';

@Entity()
export class AnotacionesEstudiante {
    @PrimaryColumn()
    anotacion_id: number;

    @PrimaryColumn()
    estudiante_id: number;

    @ManyToOne(
        type => Anotacion,
        anotacion => anotacion.estudiantesConnection
    )
    @JoinColumn({ name: 'anotacion_id' })
    anotacion: Anotacion;

    @ManyToOne(
        type => Estudiante,
        estudiante => estudiante.anotacionesConnection
    )
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;
}
