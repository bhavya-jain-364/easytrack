import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const userData = await db.collection('user').findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { stocks: 1 } } // Only fetch the stocks array
    );

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      stocks: userData.stocks || [] 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching stock list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
