import { type InternalAxiosRequestConfig } from 'axios';

export function addHeadersToRequest(config: InternalAxiosRequestConfig) {
  const token = 'test';
  config.headers.Authorization = token ? `Bearer ${token}` : undefined;
}
