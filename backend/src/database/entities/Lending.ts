import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookCopy } from './BookCopy';
import { User } from './User';

@Entity('lending', { schema: '42library' })
export class Lending {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'lendingLibrarianId' })
  lendingLibrarianId: number;

  @Column('varchar', {
    name: 'lendingCondition',
    length: 255,
    nullable: false,
    default: '',
  })
  lendingCondition: string;

  @Column('int', { name: 'returningLibrarianId', nullable: true })
  returningLibrarianId: number | null;

  @Column('varchar', {
    name: 'returningCondition',
    nullable: true,
    length: 255,
  })
  returningCondition: string | null;

  @Column('datetime', { name: 'returnedAt', nullable: true })
  returnedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => BookCopy, (book) => book.lendings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'bookId', referencedColumnName: 'id' }])
  book: BookCopy;

  @Column({ name: 'bookId', type: 'int' })
  bookId: number;

  @ManyToOne(() => User, (user) => user.lendings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.librarianLendings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'lendingLibrarianId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_f2adde8c7d298210c39c500d966',
    },
  ])
  lendingLibrarian: User;

  @ManyToOne(() => User, (user) => user.librarianReturnings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'returningLibrarianId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_returningLibrarianId',
    },
  ])
  returningLibrarian: User;
}
