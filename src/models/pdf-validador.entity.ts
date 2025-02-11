import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class PdfValidador {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    validationCode: string;
  
    @Column({ nullable: true })
    certificateType: string;
  
    @Column({ nullable: true })
    certificateNumber: string;
  
    @Column({ default: false })
    isValid: boolean;
  
    @Column({ type: 'timestamp', nullable: true })
    validatedAt: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  