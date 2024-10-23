// app/api/users/protected-data/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Use getUserFromToken to extract user info from cookies
    const user = getUserFromToken(req);

    if (!user) {
      // If no user is found, return an unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If the user is authenticated, return the user details
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    // Handle any errors and return a 401 response
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
