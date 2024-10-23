// app/api/users/auth/fetchname/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth'; // Assuming you have a token handler
import { connectToDatabase } from '@/lib/mongodb'; // Assuming you have MongoDB connection

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req); // Extract user from token

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const userData = await db.collection('user').findOne({ userId: user.userId });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user's name
    return NextResponse.json({ name: userData.name });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
