export interface LoginModel {
  user: User;
  token: Token;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  created_at?: string;
  created_at_formatted?: string;
}
