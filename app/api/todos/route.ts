import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';

const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createTodoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {
      status: 400
    });
  }

  const newTodo = await prisma.todo.create({
    data: {
      title: body.title,
      description: body.description
    }
  });
  return NextResponse.json(newTodo, { status: 201 });
}
