import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { Direccion } from './Direccion.entity';

@Entity()
export class ApoderadoDireccion {
    @PrimaryColumn()
    apoderado_id: number;

    @PrimaryColumn()
    direccion_id: number;

    @ManyToOne(
        type => Apoderado,
        apoderado => apoderado.estudiantesConnection
    )
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @ManyToOne(
        type => Direccion,
        direccion => direccion.direccionConnection
    )
    @JoinColumn({ name: 'direccion_id' })
    direccion: Direccion;
}
