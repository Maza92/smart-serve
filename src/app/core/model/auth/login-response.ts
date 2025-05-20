export interface LoginResponse {
  userId: number;
  username: string;
  token: string;
  expiration: string;
  refreshToken: string;
}
