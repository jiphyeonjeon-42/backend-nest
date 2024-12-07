export const BOOK_STATUS = {
  OK: 0,
  LOST: 1,
  DAMAGED: 2,
  ASSIGNED: 3,
} as const;

export type BookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];

export function getStatusString(status: BookStatus): string {
  const statusMap: Record<BookStatus, string> = {
    [BOOK_STATUS.OK]: 'AVAILABLE',
    [BOOK_STATUS.ASSIGNED]: 'ASSIGNED',
    [BOOK_STATUS.LOST]: 'LOST',
    [BOOK_STATUS.DAMAGED]: 'DAMAGED',
  };
  return statusMap[status] || 'UNKNOWN';
}
