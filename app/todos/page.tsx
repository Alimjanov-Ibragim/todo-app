"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SimpleMDE from "react-simplemde-editor";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { createTodoSchema } from "@/app/validationSchemas";
import { TodosServiceInstance } from "@/shared/services/todosAxios";
import { ExtendedTodo, TodoForm, TStatus } from "@/lib/types";
import "easymde/dist/easymde.min.css";

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
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(createTodoSchema),
  });

  const onSubmit: SubmitHandler<TodoForm> = async (data) => {
    try {
      setIsSubmitting(true);
      await TodosServiceInstance.createTodos(data);
      setIsSubmitting(false);
      reset();
      toast({
        title: "Todo created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      toast({
        title: "An unexpected error occured. Please try again.",
      });
      setIsSubmitting(false);
      console.log("error", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await TodosServiceInstance.deleteTodo(id);
      toast({
        title: "Todo deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      toast({
        title: "An unexpected error occured. Please try again.",
      });
      console.log("error", error);
    }
  };

  const handleChangeStatus = async (status: TStatus, id: string) => {
    try {
      await TodosServiceInstance.updateStatusTodo({ status, id });
      toast({
        title: "Todo updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (error) {
      toast({
        title: "An unexpected error occured. Please try again.",
      });
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1>Todos</h1>
      <div className="grid grid-cols-2 gap-[40px]">
        <div>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <ErrorMessage>Failed to fetch todos</ErrorMessage>
          ) : (
            <ul className="list-disc">
              {todos.map((todo: ExtendedTodo) => (
                <li key={todo.id} className="flex items-center gap-[10px]">
                  <h4>{todo.title}</h4>
                  <p>{todo.description}</p>

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
                        <SelectItem value="IN_PROGRESS">in progress</SelectItem>
                        <SelectItem value="COMPLETED">completed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => deleteTodo(String(todo.id))}
                    className="text-white bg-red-500"
                  >
                    Delete
                  </button>
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
    </div>
  );
};

export default TodosPage;
