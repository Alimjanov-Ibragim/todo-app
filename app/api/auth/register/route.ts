// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверка на существующего пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует' },
        { status: 422 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    return NextResponse.json(
      { message: 'Пользователь успешно зарегистрирован' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
