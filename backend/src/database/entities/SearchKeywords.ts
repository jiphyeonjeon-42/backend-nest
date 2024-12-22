import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SearchLogs } from './SearchLogs';

Index('search_keywords', ['keyword']);
@Entity('search_keywords')
export class SearchKeywords {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'keyword', length: 255, nullable: true })
  keyword?: string;

  @Column('varchar', {
    name: 'disassembled_keyword',
    length: 255,
    nullable: true,
  })
  disassembledKeyword?: string;

  @Column('varchar', {
    name: 'initial_consonants',
    length: 255,
    nullable: true,
  })
  initialConsonants?: string;

  @OneToMany(() => SearchLogs, (searchLogs) => searchLogs.searchKeyword)
  searchLogs?: SearchLogs[];
}
