'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import axios from 'axios';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { createTodoSchema } from '@/app/validationSchemas';
import 'easymde/dist/easymde.min.css';

type TodoForm = z.infer<typeof createTodoSchema>;

const TodosPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      await axios.post('/api/todos', data);
      console.log(data);
      setIsSubmitting(false);
    } catch (error) {
      toast.error('An unexpected error occured. Please try again.', {
        position: 'top-right'
      });
      setIsSubmitting(false);
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
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <SimpleMDE {...field} />}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
          <Button type="submit" disabled={isSubmitting}>
            Add {isSubmitting && <Spinner />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TodosPage;
