import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/Category';
import { Book } from '../database/entities/Book';
import { categoryCountSchema } from 'src/books/dto/books.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async getCategoriesWithCount() {
    const categoriesWithCount = await this.categoryRepository
      .createQueryBuilder('category')
      .select('category.name', 'name')
      .addSelect('COUNT(book.id)', 'count')
      .leftJoin('category.bookInfos', 'book')
      .groupBy('category.id')
      .getRawMany();

    return categoriesWithCount.map((item) => categoryCountSchema.parse(item));
  }
}
