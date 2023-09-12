export interface PaginationModel<T> {
  data: T;
  meta: Meta;
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
