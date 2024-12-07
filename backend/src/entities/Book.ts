import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookCopy } from './BookCopy';
import { Category } from './Category';
import { Likes } from './Likes';
import { Reservation } from './Reservation';
import { Reviews } from './Reviews';
import { SuperTag } from './SuperTag';
import { BookInfoSearchKeywords } from './BookInfoSearchKeywords';

@Index('categoryId', ['categoryId'], {})
@Entity('book_info')
export class Book {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'author', length: 255 })
  author: string;

  @Column('varchar', { name: 'publisher', length: 255 })
  publisher: string;

  @Column('varchar', { name: 'isbn', nullable: true, length: 255 })
  isbn: string;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('date', { name: 'publishedAt', nullable: true })
  publishedAt: Date | null;

  @Column('datetime', {
    name: 'createdAt',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date;

  @Column('int', { name: 'categoryId' })
  categoryId: number;

  @OneToMany(() => BookCopy, (book) => book.info)
  books?: BookCopy[];

  @ManyToOne(() => Category, (category) => category.bookInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category: Category;

  @OneToMany(() => Likes, (likes) => likes.bookInfo)
  likes?: Likes[];

  @OneToMany(() => Reservation, (reservation) => reservation.bookInfo)
  reservations?: Reservation[];

  @OneToMany(() => Reviews, (reviews) => reviews.bookInfo)
  reviews?: Reviews[];

  @OneToMany(() => SuperTag, (superTags) => superTags.userId)
  superTags?: SuperTag[];

  @OneToOne(
    () => BookInfoSearchKeywords,
    (bookInfoSearchKeyword) => bookInfoSearchKeyword.bookInfo,
  )
  bookInfoSearchKeyword?: BookInfoSearchKeywords;
}
