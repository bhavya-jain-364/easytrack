// app/api/users/signout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Clear the authToken cookie by setting its expiration date to the past
  const response = NextResponse.json({ message: 'Signed out successfully' });

  // Clear the HttpOnly cookie
  response.cookies.set('authToken', '', { path: '/', expires: new Date(0) });

  return response;
}
