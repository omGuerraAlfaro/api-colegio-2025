import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { EstadoBoleta } from './EstadoBoleta.entity';

@Entity('boleta')
export class Boleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    apoderado_id: number;

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

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2 })
    iva: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    descuento: number;

    @Column({ nullable: true })
    nota: string;
 
    @ManyToOne(() => Apoderado, apoderado => apoderado.id)
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @ManyToOne(() => EstadoBoleta, estado => estado.id)
    @JoinColumn({ name: 'estado_id' })
    estadoBoleta: EstadoBoleta;

    // @ManyToOne(type => Pago, { nullable: true })
    // @JoinColumn({ name: 'pago_id' })
    // pago: Pago;

}
