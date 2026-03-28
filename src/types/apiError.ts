export interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}