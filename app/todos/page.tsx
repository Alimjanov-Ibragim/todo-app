"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SimpleMDE from "react-simplemde-editor";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { createTodoSchema } from "@/app/validationSchemas";
import { TodosServiceInstance } from "@/shared/services/todosAxios";
import "easymde/dist/easymde.min.css";

type TodoForm = z.infer<typeof createTodoSchema>;

type ExtendedTodo = TodoForm & {
  id: number;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
};

const TodosPage = () => {
  const queryClient = useQueryClient();
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: TodosServiceInstance.fetchTodos,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(createTodoSchema),
  });

  const onSubmit: SubmitHandler<TodoForm> = async (data) => {
    try {
      setIsSubmitting(true);
      console.log(data);
      await TodosServiceInstance.createTodos(data);
      setIsSubmitting(false);

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      toast.error("An unexpected error occured. Please try again.", {
        position: "top-right",
      });
      setIsSubmitting(false);
      console.log("error", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-[40px]">
      <div>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <ErrorMessage>Failed to fetch todos</ErrorMessage>
        ) : (
          <ul className="list-disc">
            {todos.map((todo: ExtendedTodo) => (
              <li key={todo.id}>
                <h4>{todo.title}</h4>
                <p>{todo.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px]"
        >
          <Input {...register("title")} placeholder="Add todo title" />
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
