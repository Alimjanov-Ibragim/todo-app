import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createTodoSchema } from '@/app/validationSchemas';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createTodoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400
    });
  }

  const newTodo = await prisma.todos.create({
    data: {
      title: body.title,
      description: body.description
    }
  });
  return NextResponse.json(newTodo, { status: 201 });
}

export async function GET() {
  try {
    const todos = await prisma.todos.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while receiving data', error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Id is required' }, { status: 400 });
  }
  try {
    const deletedTodo = await prisma.todos.delete({
      where: {
        id: Number(id)
      }
    });
    return NextResponse.json(deletedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while deleting todo', error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: 'Id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status value. Allowed values: ${validStatuses.join(
            ', '
          )}`
        },
        { status: 400 }
      );
    }

    const updatedTodo = await prisma.todos.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      }
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while updating todo status', error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const validation = createTodoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  try {
    const updatedTodo = await prisma.todos.update({
      where: { id: Number(body.id) },
      data: {
        title: body.title,
        description: body.description,
        status: body.status
      }
    });
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update todo', error },
      { status: 500 }
    );
  }
}
