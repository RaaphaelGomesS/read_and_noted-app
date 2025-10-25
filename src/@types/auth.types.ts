export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'DEFAULT';
}

export type UserRequestDTO = {
  email?: string;
  username?: string;
  password?: string;
};

export type UserResponseDTO = {
  id: number;
  email: string;
  username: string;
};