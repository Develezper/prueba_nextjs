import axios from "axios";
import type { ApiErrorResponse } from "@/src/types/http";

export function getAxiosErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string | null {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return null;
  }

  return error.response?.data?.message ?? fallbackMessage;
}
