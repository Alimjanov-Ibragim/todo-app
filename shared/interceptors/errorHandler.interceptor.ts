import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandlerInterceptor(error: any) {
  if (error.status === 401) {
    toast.error('Ошибка с обновлением токена', {
      position: 'top-right'
    });
    // logout()
  } else {
    const errorMessage =
      error?.response?.data?.errors?.[0]?.errorMessage ||
      error?.response?.data?.message;
    toast.error(errorMessage || 'Неизвестная ошибка', {
      position: 'top-right'
    });
  }
}
