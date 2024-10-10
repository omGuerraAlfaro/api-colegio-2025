import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';

@Entity()
export class InscripcionMatricula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    id_inscripcion: string;

    @Column({ type: 'varchar', length: 150 })
    primer_nombre_alumno: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_nombre_alumno: string;

    @Column({ type: 'varchar', length: 150 })
    primer_apellido_alumno: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_apellido_alumno: string;
    
    @Column({ type: 'varchar', length: 10 })
    rut_alumno: string;
    
    @Column({ type: 'varchar', length: 10, nullable: true })
    genero_alumno: string;
    
    @Column({ type: 'date', nullable: true })
    fecha_nacimiento_alumno: Date;
    
    @Column({ type: 'numeric', nullable: true })
    curso_alumno: number;
    
    @Column({ type: 'varchar', length: 150 })
    primer_nombre_apoderado: string;
    
    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_nombre_apoderado: string;
    
    @Column({ type: 'varchar', length: 150 })
    primer_apellido_apoderado: string;
    
    @Column({ type: 'varchar', length: 150, nullable: true })
    segundo_apellido_apoderado: string;
    
    @Column({ type: 'varchar', length: 13 })
    rut_apoderado: string;

    @Column({ type: 'varchar', length: 10 })
    telefono_apoderado: string;

    @Column({ type: 'varchar', length: 250 })
    correo_apoderado: string;

    @Column({ type: 'varchar', length: 250 })
    parentesco_apoderado: string;

    @Column({ type: 'varchar', length: 250 })
    estado_civil: string;
    
    @Column({ type: 'varchar', length: 250 })
    profesion_oficio: string;

    @Column({ type: 'varchar', length: 250 })
    direccion: string;

    @Column({ type: 'varchar', length: 250 })
    comuna: string;

    @Column({ type: 'date', nullable: true })
    fecha_matricula_inscripcion: Date;
}
