import axios from "axios";

export function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data;
    console.log(error.response);

    if (backendMessage && typeof backendMessage === "string") {
      return new Error(backendMessage);
    } else {
      return new Error("Não foi possível conectar ao servidor.");
    }
  }
  return new Error(defaultMessage);
}