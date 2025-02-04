'use client';

import React from 'react';
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';

import { Input } from '@/components/ui/input';
import 'easymde/dist/easymde.min.css';

type FormValues = {
  title: string;
  description: string;
};

const TodosPage = () => {
  const { handleSubmit, control } = useForm<FormValues>();
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
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Add todo title" />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE
                {...field}
                onChange={value => field.onChange(value)}
                value={field.value}
              />
            )}
          />
          <Input type="submit" value="Add todo" />
        </form>
      </div>
    </div>
  );
};

export default TodosPage;
