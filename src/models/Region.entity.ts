import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Ciudad } from './Ciudad.entity';

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;     

    @OneToMany(() => Ciudad, ciudad => ciudad.region)
    ciudades: Ciudad[]; 
}
