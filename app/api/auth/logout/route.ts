import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json(
      { message: 'Вы успешно вышли из системы' },
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure'
        }
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Ошибка при выходе из системы' },
      { status: 500 }
    );
  }
}
