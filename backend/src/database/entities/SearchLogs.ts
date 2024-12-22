import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SearchKeywords } from './SearchKeywords';

@Entity('search_logs')
export class SearchLogs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'search_keyword_id', nullable: true })
  searchKeywordId?: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @ManyToOne(() => SearchKeywords, (SearchKeyword) => SearchKeyword.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'search_keyword_id',
      referencedColumnName: 'id',
    },
  ])
  searchKeyword?: SearchKeywords;
}
