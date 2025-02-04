'use client';

import React from 'react';
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import 'easymde/dist/easymde.min.css';

type FormValues = {
  title: string;
  description: string;
};

const TodosPage = () => {
  const { register, handleSubmit, control } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async data => {
    console.log(data);
    await axios.post('/api/todos', data);
  };
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
          <Controller
            name="description"
            control={control}
            render={({ field }) => <SimpleMDE {...field} />}
          />
          <Input type="submit" value="Add todo" />
        </form>
      </div>
    </div>
  );
};

export default TodosPage;
