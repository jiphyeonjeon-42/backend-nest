import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';

@Entity('book_info_search_keywords')
export class BookInfoSearchKeywords {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    name: 'disassembled_title',
    length: 255,
    nullable: true,
  })
  disassembledTitle?: string;

  @Column('varchar', {
    name: 'disassembled_author',
    length: 255,
    nullable: true,
  })
  disassembledAuthor?: string;

  @Column('varchar', {
    name: 'disassembled_publisher',
    length: 255,
    nullable: true,
  })
  disassembledPublisher?: string;

  @Column('varchar', { name: 'title_initials', length: 255, nullable: true })
  titleInitials?: string;

  @Column('varchar', { name: 'author_initials', length: 255, nullable: true })
  authorInitials?: string;

  @Column('varchar', {
    name: 'publisher_initials',
    length: 255,
    nullable: true,
  })
  publisherInitials?: string;

  @Column('int', { name: 'book_info_id', nullable: true })
  bookInfoId?: number;

  @OneToOne(() => Book, (bookInfo) => bookInfo.id)
  @JoinColumn([
    {
      name: 'book_info_id',
      referencedColumnName: 'id',
    },
  ])
  bookInfo?: Book;
}
