export interface Paginator {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from?: number;
  to?: number;
}
