// import { addHeadersToRequest } from '@/shared/interceptors/addHeadersToRequest.interceptor';
// import { errorHandlerInterceptor } from '@/shared/interceptors/errorHandler.interceptor';
import { z } from 'zod';

import { createTodoSchema } from '@/app/validationSchemas';
import { AxiosService } from '@/shared/services/axiosService.service';

type TodoForm = z.infer<typeof createTodoSchema>;

const baseAxiosConfig = {
  baseURL: '/'
};

const AxiosUrls = {
  fetchTodos: '/api/todos'
};

const axiosService = new AxiosService();
const todosAxios = axiosService.createAxios(baseAxiosConfig);
// axiosService.addInterceptorsOnRequestFulfilled([addHeadersToRequest]);
// axiosService.addInterceptorsOnResponseRejected([errorHandlerInterceptor]);

export class TodosService {
  public async fetchTodos(data: TodoForm) {
    return todosAxios.post(AxiosUrls.fetchTodos, data);
  }
}

export const TodosServiceInstance = new TodosService();
