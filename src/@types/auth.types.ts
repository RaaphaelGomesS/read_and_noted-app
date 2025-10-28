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

export type BookStatus = 'lendo' | 'aguardando' | 'finalizado' | 'parado';

export type Book = {
  id: number;
  title: string;
  author: string;
  img: string;
  readPages: number;
  totalPages: number;
};