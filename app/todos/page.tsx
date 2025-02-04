'use client';

import React from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type FormValues = {
  title: string;
  description: string;
};

const TodosPage = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);
  const onError: SubmitErrorHandler<FormValues> = errors => console.log(errors);

  return (
    <div className="grid grid-cols-2 gap-[40px]">
      <ul>
        <li>Todo</li>
        <li>Todo2</li>
      </ul>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex flex-col gap-[10px]"
        >
          <Input {...register('title')} placeholder="Add todo title" />
          <Textarea
            {...register('description')}
            placeholder="Add todo description"
          />

          <Input type="submit" value="Add todo" />
        </form>
      </div>
    </div>
  );
};

export default TodosPage;
