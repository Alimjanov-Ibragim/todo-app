import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value;

  // Если токен отсутствует, перенаправляем на страницу входа
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Если токен есть, продолжаем обработку запроса
  return NextResponse.next();
}

// Указываем пути, к которым применится middleware
export const config = {
  matcher: ['/todos/:path*'] // Например, защищаем только роуты todos
};
