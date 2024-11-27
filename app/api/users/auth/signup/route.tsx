import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  const { db } = await connectToDatabase();
  const body = await req.json();

  const { name, email, password } = body;

  // Check if the user already exists
  const existingUser = await db.collection('user').findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);

  // Create the new user
  const result = await db.collection('user').insertOne({
    name,
    email,
    password: hashedPassword,
    stocks: [],
    createdAt: new Date(),
  });

  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}
