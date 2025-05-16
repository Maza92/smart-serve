export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  path?: string;
  method?: string;
  data: T;
}

export interface ApiError extends Omit<ApiResponse<any>, 'data'> {
  errors: string[];
}
