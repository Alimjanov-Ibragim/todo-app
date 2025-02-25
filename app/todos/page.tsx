'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/app/components';
import { Spinner } from '@/app/components';
import { TodosServiceInstance } from '@/shared/services/todosAxios';
import { ExtendedTodo, TStatus } from '@/lib/types';
import 'easymde/dist/easymde.min.css';
import { LogoutButton } from '@/app/components';

const TodosPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    data: todos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['todos'],
    queryFn: TodosServiceInstance.fetchTodos
  });

  const { toast } = useToast();

  const deleteTodo = async (id: string) => {
    try {
      await TodosServiceInstance.deleteTodo(id);
      toast({
        title: 'Todo deleted successfully'
      });

      queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      console.log('error', error);
    }
  };

  const handleChangeStatus = async (status: TStatus, id: string) => {
    try {
      await TodosServiceInstance.updateStatusTodo({ status, id });
      toast({
        title: 'Todo updated successfully'
      });

      queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      console.log('error', error);
    }
  };

  if (!session && status === 'unauthenticated') return <p>Доступ запрещён</p>;

  return (
    <div className="flex flex-col gap-[40px]">
      <div>
        <h1 className="font-bold">Todos</h1>
        <div className="flex items-end justify-between gap-[10px]">
          <Button onClick={() => router.push(`/todos/create`)}>
            Create todo
          </Button>
          <div className="flex flex-col">
            <strong>User: {session?.user?.name || session?.user?.email}</strong>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[40px]">
        <div>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <ErrorMessage>Failed to fetch todos</ErrorMessage>
          ) : (
            <ul className="p-[10px] border rounded-[8px]">
              {todos.map((todo: ExtendedTodo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-start gap-[10px] p-[10px] border-b border-gray-500"
                >
                  <div>
                    <h4
                      className="font-bold"
                      onClick={() => router.push(`/todos/edit/?id=${todo.id}`)}
                    >
                      {todo.title}
                    </h4>
                    <p>{todo.description}</p>
                  </div>

                  <div className="flex flex-col items-end gap-[10px]">
                    <Select
                      onValueChange={(e: TStatus) =>
                        handleChangeStatus(e, String(todo.id))
                      }
                      defaultValue={todo.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="OPEN">open</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            in progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => deleteTodo(String(todo.id))}
                      className="px-[10px] py-[5px] text-white bg-red-500 rounded-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
