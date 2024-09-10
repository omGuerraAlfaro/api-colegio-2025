import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyOrder: string;

  @Column()
  sessionId: string;

  @Column('decimal')
  amount: number;

  @Column()
  token: string;

  @Column({ default: 'pendiente' })
  status: string;

  // @Column()
  // rutApoderado: string;
}
