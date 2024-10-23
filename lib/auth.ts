// lib/auth.ts
import { verify, JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function getUserFromToken(req: NextRequest): JwtPayload | null {
  // Use NextRequest's cookies() method to get the authToken cookie
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    throw new Error('Authentication token missing');
  }

  try {
    // Verify the token using the secret key
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    return decoded; // Return the decoded user data (e.g., userId, email)
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}
