import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { clientPromise } from '@/lib/mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const body = await req.json();

  const { name, email, password } = body;

  const existingUser = await db.collection('user').findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 12);

  const result = await db.collection('user').insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}
