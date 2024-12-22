import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Book } from './Book';
import { BookCopy } from './BookCopy';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'endAt', nullable: true })
  endAt: Date | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('int', { name: 'status', default: () => '0' })
  status: number;

  @Column('int', { name: 'bookInfoId' })
  bookInfoId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Book, (bookInfo) => bookInfo.reservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'bookInfoId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_bookInfo',
    },
  ])
  bookInfo: Book;

  @ManyToOne(() => BookCopy, (book) => book.reservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'bookId', referencedColumnName: 'id' }])
  book: BookCopy;

  @Column('int', { name: 'bookId', nullable: true })
  bookId: number | null;
}
