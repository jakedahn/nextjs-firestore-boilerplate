import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the auth cookie
  cookies().delete('auth-token');
  
  // Redirect to home page
  return NextResponse.json({ success: true });
}