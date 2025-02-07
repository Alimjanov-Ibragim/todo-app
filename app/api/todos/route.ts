import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createTodoSchema } from '@/app/validationSchemas';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const body = await request.json();
  const validation = createTodoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newTodo = await prisma.todos.create({
    data: {
      title: body.title,
      description: body.description,
      userId: token.id as number
    }
  });
  return NextResponse.json(newTodo, { status: 201 });
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const todos = await prisma.todos.findMany({
      where: { userId: token.id }
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while receiving data', error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Id is required' }, { status: 400 });
  }

  try {
    const deletedTodo = await prisma.todos.deleteMany({
      where: {
        id: Number(id),
        userId: token.id
      }
    });

    if (deletedTodo.count === 0) {
      return NextResponse.json(
        { message: 'Задача не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Задача удалена' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while deleting todo', error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

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

    const updatedTodo = await prisma.todos.updateMany({
      where: {
        id: Number(id),
        userId: token.id
      },
      data: {
        status
      }
    });

    if (updatedTodo.count === 0) {
      return NextResponse.json(
        { message: 'Задача не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Статус обновлен' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while updating todo status', error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const body = await request.json();
  const validation = createTodoSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  try {
    const updatedTodo = await prisma.todos.updateMany({
      where: {
        id: Number(body.id),
        userId: token.id
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status
      }
    });

    if (updatedTodo.count === 0) {
      return NextResponse.json(
        { message: 'Задача не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Задача обновлена' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update todo', error },
      { status: 500 }
    );
  }
}
