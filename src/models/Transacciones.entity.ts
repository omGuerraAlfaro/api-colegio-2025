import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { EstadoTransaccion } from './EstadoTransaccion.entity';
import { Boleta } from './Boleta.entity';
import { Apoderado } from './Apoderado.entity';

@Entity('transacciones')
export class Transacciones {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    boleta_id: number;

    @Column()
    apoderado_id: number;

    @Column()
    estado_transaccion_id: number;

    @Column({ nullable: true })
    webpay_transaccion_id: string;
    
    @Column({ nullable: true })
    transferencia_transaccion_id: string;
    
    @Column({ nullable: true })
    monto: number;

    @Column()
    fecha_creacion: Date;

    @Column({ nullable: true })
    fecha_actualizacion: Date;

    @Column({ nullable: true })
    metodo_pago: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    codigo_autorizacion: string;

    @Column({ nullable: true })
    codigo_respuesta: number;

    @ManyToOne(() => Boleta, boleta => boleta.id)
    @JoinColumn({ name: 'boleta_id' })
    boleta: Boleta;

    @ManyToOne(() => Apoderado, apoderado => apoderado.id)
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @ManyToOne(() => EstadoTransaccion, estado => estado.id)
    @JoinColumn({ name: 'estado_transaccion_id' })
    estadoTransaccion: EstadoTransaccion;
}


