'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SimpleMDE from 'react-simplemde-editor';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ErrorMessage } from '@/app/components';
import { Spinner } from '@/app/components';
import { createTodoSchemaWithoutUserId } from '@/app/validationSchemas';
import { TodosServiceInstance } from '@/shared/services/todosAxios';
import { TodoForm, ExtendedTodo } from '@/lib/types';
import 'easymde/dist/easymde.min.css';

export default function EditTodoPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const todoId = searchParams.get('id') as string;
  const {
    data: todos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['todos'],
    queryFn: TodosServiceInstance.fetchTodos
  });

  const todoToEdit: ExtendedTodo = todos?.find(
    (todo: ExtendedTodo) => String(todo.id) === todoId
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TodoForm>({
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN'
    },
    resolver: zodResolver(createTodoSchemaWithoutUserId)
  });

  useEffect(() => {
    if (todoToEdit) {
      reset({
        title: todoToEdit.title,
        description: todoToEdit.description,
        status: todoToEdit.status
      });
    }
  }, [todoToEdit, reset]);

  const onSubmit: SubmitHandler<TodoForm> = async data => {
    try {
      const updatedTodo = {
        id: todoId,
        title: data.title,
        description: data.description,
        status: data.status,
        userId: (session?.user as { id?: number }).id || -1
      };
      setIsSubmitting(true);
      await TodosServiceInstance.editTodo(updatedTodo);
      setIsSubmitting(false);
      reset();
      toast({
        title: 'Todo created successfully'
      });

      queryClient.invalidateQueries({ queryKey: ['todos'] });
      router.push('/todos');
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      setIsSubmitting(false);
      console.log('error', error);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage>Error loading todos</ErrorMessage>;

  if (!todoToEdit) return <div>Todo not found</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit task</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px]"
        >
          <Input {...register('title')} placeholder="Add todo title" />
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE {...field} placeholder="Add todo description" />
            )}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="OPEN">open</SelectItem>
                    <SelectItem value="IN_PROGRESS">in progress</SelectItem>
                    <SelectItem value="COMPLETED">completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>{errors.status?.message}</ErrorMessage>
          <Button type="submit" disabled={isSubmitting}>
            Save {isSubmitting && <Spinner />}
          </Button>
        </form>

        {/* Кнопка закрытия */}
        <button onClick={() => router.push('/todos')} className="close-button">
          ×
        </button>
      </div>
    </div>
  );
}
