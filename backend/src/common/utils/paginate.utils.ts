import { PaginationDto } from '../dto/dto';

export async function paginate<T>(
  data: T,
  total: number,
  page: number,
  limit: number,
): Promise<PaginationDto<T>> {
  const totalPages = Math.ceil(total / limit);
  const currentPage = page;
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  const paginationResponse = new PaginationDto<T>();
  paginationResponse.data = data;
  paginationResponse.meta = {
    limit: limit,
    total: total,
    current_page: currentPage,
    total_pages: totalPages,
    next: nextPage,
    prev: prevPage,
  };
  return paginationResponse;
}
