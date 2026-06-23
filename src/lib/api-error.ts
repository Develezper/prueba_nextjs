import { getAxiosErrorMessage } from "@/src/lib/axios-error";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  const axiosErrorMessage = getAxiosErrorMessage(error, fallbackMessage);

  if (axiosErrorMessage) {
    return axiosErrorMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
