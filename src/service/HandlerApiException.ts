import axios from "axios";

export type FieldErrors = {
  [key: string]: string | undefined;
};

export class ValidationError extends Error {
  fieldErrors: FieldErrors;

  constructor(message: string, fieldErrors: FieldErrors) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return new AuthError("Sessão expirada.");
    }

    if (error.response?.status === 400 && error.response.data?.errors) {
      const fieldErrors = error.response.data.errors as FieldErrors;
      return new ValidationError("Corrija os erros abaixo.", fieldErrors);
    }

    const backendMessage = error.response?.data;
    if (backendMessage && typeof backendMessage === "string") {
      return new Error(backendMessage);
    }

    if (error.response?.data?.detail) {
      return new Error(error.response.data.detail);
    }
  }
  return new Error(defaultMessage);
}
