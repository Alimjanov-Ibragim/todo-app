// import { addHeadersToRequest } from '@/shared/interceptors/addHeadersToRequest.interceptor';
// import { errorHandlerInterceptor } from '@/shared/interceptors/errorHandler.interceptor';
import { z } from 'zod';

import { createTodoSchema } from '@/app/validationSchemas';
import { AxiosService } from '@/shared/services/axiosService.service';
import { TStatus } from '@/lib/types';

type TodoForm = z.infer<typeof createTodoSchema>;

const baseAxiosConfig = {
  baseURL: '/'
};

const AxiosUrls = {
  todos: '/api/todos'
};

const axiosService = new AxiosService();
const todosAxios = axiosService.createAxios(baseAxiosConfig);
// axiosService.addInterceptorsOnRequestFulfilled([addHeadersToRequest]);
// axiosService.addInterceptorsOnResponseRejected([errorHandlerInterceptor]);

export class TodosService {
  public async createTodos(data: TodoForm) {
    return todosAxios.post(AxiosUrls.todos, data);
  }
  public async fetchTodos() {
    const { data } = await todosAxios.get(AxiosUrls.todos);
    return data;
  }

  public async deleteTodo(id: string) {
    return todosAxios.delete(AxiosUrls.todos, { params: { id } });
  }

  public async updateStatusTodo(data: { id: string; status: TStatus }) {
    return todosAxios.put(AxiosUrls.todos, data);
  }

  public async fetchTestPosts() {
    const { data } = await todosAxios.get(
      'https://jsonplaceholder.typicode.com/users/1/posts'
    );
    return data;
  }

  public async editTodo(data: {
    id: string;
    status: TStatus;
    title: string;
    description: string;
  }) {
    return todosAxios.patch(AxiosUrls.todos, data);
  }
}

export const TodosServiceInstance = new TodosService();
