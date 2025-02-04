'use client';

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import axios from 'axios';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { createTodoSchema } from '@/app/validationSchemas';
import 'easymde/dist/easymde.min.css';

type TodoForm = z.infer<typeof createTodoSchema>;

const TodosPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TodoForm>({
    resolver: zodResolver(createTodoSchema)
  });

  const onSubmit: SubmitHandler<TodoForm> = async data => {
    try {
      await axios.post('/api/todos', data);
      console.log(data);
    } catch (error) {
      toast.error('An unexpected error occured. Please try again.', {
        position: 'top-right'
      });
      console.log('error', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-[40px]">
      <ul>
        <li>Todo</li>
        <li>Todo2</li>
      </ul>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px]"
        >
          <Input {...register('title')} placeholder="Add todo title" />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
          <Controller
            name="description"
            control={control}
            render={({ field }) => <SimpleMDE {...field} />}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
          <Input type="submit" value="Add todo" />
        </form>
      </div>
    </div>
  );
};

export default TodosPage;
