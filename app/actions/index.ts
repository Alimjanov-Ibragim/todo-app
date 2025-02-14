"use server";

import { TodoForm, TStatus } from "@/lib/types";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function create(body: TodoForm) {
  try {
    await prisma.todos.create({
      data: {
        title: body.title,
        description: body.description,
        userId: body.userId,
      },
    });

    revalidatePath("/todos");
  } catch (error) {
    console.log(error);
  }
}

export async function removeTodo({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) {
  try {
    await prisma.todos.deleteMany({
      where: {
        id: Number(postId),
        userId: userId,
      },
    });

    revalidatePath("/todos");
  } catch (error) {
    console.log(error);
  }
}

export async function updateStatusTodo({
  postId,
  userId,
  status,
}: {
  status: TStatus;
  postId: number;
  userId: number;
}) {
  try {
    await prisma.todos.updateMany({
      where: {
        id: Number(postId),
        userId: userId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/todos");
  } catch (error) {
    console.log(error);
  }
}

export async function editTodo({
  postId,
  userId,
  title,
  status,
  description,
}: {
  status: TStatus;
  title: string;
  description: string;
  postId: number;
  userId: number;
}) {
  try {
    await prisma.todos.updateMany({
      where: {
        id: postId,
        userId: userId,
      },
      data: {
        title: title,
        description: description,
        status: status,
      },
    });
    revalidatePath("/todos");
  } catch (error) {
    console.log(error);
  }
}
