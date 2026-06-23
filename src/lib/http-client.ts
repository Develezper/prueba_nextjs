import axios, { type AxiosRequestConfig } from "axios";

export const httpClient = axios.create({
  withCredentials: true,
});

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await httpClient.post<TResponse>(path, body);

  return response.data;
}

export async function deleteJson<TResponse>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await httpClient.delete<TResponse>(path, config);

  return response.data;
}
