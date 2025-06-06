export interface Response<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  code: number;
}

export interface TopContributor {
  userId: number;
  fullName: string;
  recipeCount: number;
}