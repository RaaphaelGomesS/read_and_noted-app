export interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "DEFAULT";
}

export type LoginRequestDTO = {
  identifier?: string;
  password?: string;
};

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

export type UserUpdateDTO = {
  email: string;
  username: string;
};

export type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
};
