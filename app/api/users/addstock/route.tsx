import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol } = await req.json();
    if (!symbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Update the user document to add the stock symbol to their stocks array
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(user.userId) },
      { 
        $addToSet: { stocks: symbol } // Using $addToSet to avoid duplicates
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to add stock' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Stock added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
