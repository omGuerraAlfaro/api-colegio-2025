import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';
import { ApoderadoSuplente } from './ApoderadoSuplente.entity';

@Entity()
export class ApoderadoSuplenteEstudiante {
    @PrimaryColumn()
    apoderado_suplente_id: number;

    @PrimaryColumn()
    estudiante_id: number;

    @ManyToOne(
        type => ApoderadoSuplente,
        apoderado => apoderado.estudiantesConnection
    )
    @JoinColumn({ name: 'apoderado_suplente_id' })
    apoderado: ApoderadoSuplente;

    @ManyToOne(
        type => Estudiante,
        estudiante => estudiante.apoderadosConnection
    )
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;
}
