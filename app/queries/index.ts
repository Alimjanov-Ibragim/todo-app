"use server";

import prisma from "@/prisma/client";

export async function getTodos(id: number) {
  try {
    const todos = await prisma.todos.findMany({
      where: { userId: id },
    });
    return todos;
  } catch (error) {
    console.log(error);
  }
}
