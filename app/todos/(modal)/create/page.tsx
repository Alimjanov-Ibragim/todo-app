"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/app/components";
import { Spinner } from "@/app/components";
import { createTodoSchema } from "@/app/validationSchemas";
import { TodoForm } from "@/lib/types";
import "easymde/dist/easymde.min.css";
import { create } from "@/app/actions";

export default function CreateTodoPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TodoForm>({
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      userId: session?.user?.id,
    },
    resolver: zodResolver(createTodoSchema),
  });

  async function onSubmit(values: TodoForm) {
    try {
      setIsSubmitting(true);
      await create(values);
      toast({
        title: "Todo created successfully",
      });
      setIsSubmitting(false);
      reset();
      router.push("/todos");
    } catch (e) {
      console.error(e);
      toast({
        title: "An unexpected error occured. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create todo</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[10px]"
        >
          <Input {...register("title")} placeholder="Add todo title" />
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE {...field} placeholder="Add todo description" />
            )}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
          <Button type="submit" disabled={isSubmitting}>
            Save {isSubmitting && <Spinner />}
          </Button>
        </form>

        {/* Кнопка закрытия */}
        <button onClick={() => router.push("/todos")} className="close-button">
          ×
        </button>
      </div>
    </div>
  );
}
