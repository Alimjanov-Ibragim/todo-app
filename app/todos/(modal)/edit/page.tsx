'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import SimpleMDE from 'react-simplemde-editor';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { createTodoSchema } from '@/app/validationSchemas';
import { TodosServiceInstance } from '@/shared/services/todosAxios';
import { TodoForm } from '@/lib/types';
import 'easymde/dist/easymde.min.css';

export default function EditTodoPage() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<TodoForm>({
    resolver: zodResolver(createTodoSchema)
  });

  const onSubmit: SubmitHandler<TodoForm> = async data => {
    try {
      setIsSubmitting(true);
      await TodosServiceInstance.createTodos(data);
      setIsSubmitting(false);
      reset();
      toast({
        title: 'Todo created successfully'
      });

      queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (error) {
      toast({
        title: 'An unexpected error occured. Please try again.'
      });
      setIsSubmitting(false);
      console.log('error', error);
    }
  };

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
            render={({ field }) => <SimpleMDE {...field} />}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
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
