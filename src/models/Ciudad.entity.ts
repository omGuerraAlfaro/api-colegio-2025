import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Direccion } from './Direccion.entity';
import { Region } from './Region.entity';

@Entity()
export class Ciudad {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;     

    @OneToMany(() => Direccion, direccion => direccion.ciudad)
    direcciones: Direccion[]; 

    @ManyToOne(() => Region, region => region.ciudades)
    @JoinColumn({ name: 'region_id' })
    region: Region;
}
