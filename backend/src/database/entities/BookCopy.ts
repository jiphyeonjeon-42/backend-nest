import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './Book';
import { User } from './User';
import { Lending } from './Lending';
import { Reservation } from './Reservation';
import { BookStatus } from 'src/books/constants';

@Entity('book')
export class BookCopy {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column('varchar', { name: 'donator', nullable: true, length: 255 })
  donator: string | null;

  @Column('varchar', { name: 'callSign', length: 255 })
  callSign: string;

  @Column('int', { name: 'status' })
  status: BookStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt?: Date;

  @Column('int')
  infoId: number;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt?: Date;

  @Column('int', { name: 'donatorId', nullable: true })
  donatorId: number | null;

  @ManyToOne(() => Book, (bookInfo) => bookInfo.books, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'infoId', referencedColumnName: 'id' }])
  info?: Book;

  @ManyToOne(() => User, (user) => user.donateBooks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'donatorId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_donator_id_from_user',
    },
  ])
  donateUser?: User;

  @OneToMany(() => Lending, (lending) => lending.book)
  lendings?: Lending[];

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations?: Reservation[];
}
