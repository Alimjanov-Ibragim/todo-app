/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

export class AxiosService {
  private _axios: AxiosInstance | undefined;

  public createAxios = (options: Record<string, any>): AxiosInstance => {
    this._axios = axios.create({ ...options });
    return this._axios;
  };

  public addInterceptorsOnRequestFulfilled = (
    interceptors: ((
      value: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig)[]
  ) => {
    this._axios?.interceptors.request.use(
      (value: InternalAxiosRequestConfig) => {
        const newValue = interceptors.reduce(
          (prevValue, interceptor) => interceptor(prevValue),
          value
        );
        return newValue;
      }
    );
  };

  public addInterceptorsOnRequestRejected = (
    interceptors: ((error: any) => Promise<never>)[]
  ) => {
    this._axios?.interceptors.request.use(undefined, (error: any) => {
      return interceptors.reduce(
        (prevPromise, interceptor) =>
          prevPromise.catch(currentError =>
            interceptor(currentError).catch(nextError => {
              throw nextError;
            })
          ),
        Promise.reject(error)
      );
    });
  };

  public addInterceptorsOnResponseFulfilled = (
    interceptors: ((value: AxiosResponse) => AxiosResponse)[]
  ) => {
    this._axios?.interceptors.response.use((value: AxiosResponse) => {
      const newValue = interceptors.reduce(
        (prevValue, interceptor) => interceptor(prevValue),
        value
      );
      return newValue;
    });
  };

  public addInterceptorsOnResponseRejected = (
    interceptors: ((error: any) => Promise<never>)[]
  ) => {
    this._axios?.interceptors.response.use(undefined, (error: any) => {
      return interceptors.reduce(
        (prevPromise, interceptor) =>
          prevPromise.catch(currentError =>
            interceptor(currentError).catch(nextError => {
              throw nextError;
            })
          ),
        Promise.reject(error)
      );
    });
  };
}
