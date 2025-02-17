import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PdfValidador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  validationCode: string;

  @Column({ nullable: true })
  certificateType: string;

  @Column({ nullable: true })
  certificateNumber: string; //numeroMatricula

  @Column({ default: false })
  isValid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validatedAt: Date;

  @Column()
  primerNombreAlumno: string;

  @Column({ nullable: true })
  segundoNombreAlumno: string;

  @Column()
  primerApellidoAlumno: string;

  @Column()
  segundoApellidoAlumno: string;

  @Column('int')
  curso: number;

  @Column({ type: 'varchar', length: 10 })
  rut: string;

  @Column({ type: 'varchar', length: 1 })
  dv: string;

  @Column({ default: false })
  isPagada: boolean;

  @Column({ default: false })
  isErp: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  uniqueIdPago: string;

  @Column()
  rutApoderado: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

}
