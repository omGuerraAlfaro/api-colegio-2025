import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { EstadoBoleta } from './EstadoBoleta.entity';
import { Estudiante } from './Estudiante.entity';

@Entity('boleta')
export class Boleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    apoderado_id: number;

    @Column()
    estudiante_id: number;

    @Column()
    rut_estudiante: string;

    @Column()
    rut_apoderado: string;

    @Column({ nullable: true })
    pago_id: string;

    @Column({ nullable: true })
    estado_id: number;

    @Column({ nullable: true })
    detalle: string;

    @Column({ nullable: true })
    fecha_vencimiento: Date;

    @Column()
    total: number;
 
    @ManyToOne(() => Apoderado, apoderado => apoderado.id)
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @ManyToOne(() => Estudiante, estudiante => estudiante.id)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => EstadoBoleta, estado => estado.id)
    @JoinColumn({ name: 'estado_id' })
    estadoBoleta: EstadoBoleta;

    // @ManyToOne(type => Pago, { nullable: true })
    // @JoinColumn({ name: 'pago_id' })
    // pago: Pago;

}
