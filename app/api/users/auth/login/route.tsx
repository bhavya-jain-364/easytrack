// pages/api/users/auth/login.ts
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { db } = await connectToDatabase();
  const { email, password } = await req.json();

  // Find user by email
  const user = await db.collection('user').findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Check if the password matches
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Generate a JWT token for the session
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'very-secret', {
    expiresIn: '1h',
  });

  // Set the cookie with the token
  const cookie = serialize('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, 
  });

  return NextResponse.json({ message: 'Login successful' }, {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
