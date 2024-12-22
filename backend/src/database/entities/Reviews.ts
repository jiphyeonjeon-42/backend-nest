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

@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('int', { name: 'bookInfoId' })
  bookInfoId: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('int', { name: 'updateUserId' })
  updateUserId: number;

  @Column('tinyint', { name: 'isDeleted', width: 1, default: () => "'0'" })
  isDeleted: boolean;

  @Column('int', { name: 'deleteUserId', nullable: true })
  deleteUserId: number | null;

  @Column('text', { name: 'content' })
  content: string;

  @Column('tinyint', { name: 'disabled', width: 1, default: () => "'0'" })
  disabled: boolean;

  @Column('int', { name: 'disabledUserId', nullable: true })
  disabledUserId: number | null;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_529dceb01ef681127fef04d755d3',
    },
  ])
  user: User;

  @ManyToOne(() => Book, (bookInfo) => bookInfo.reviews, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'bookInfoId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_bookInfo2',
    },
  ])
  bookInfo: Book;
}
