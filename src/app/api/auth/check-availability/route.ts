import { NextResponse } from 'next/server';

// Use the same user storage structure
declare global {
  var users: {
    id: string;
    username: string;
    email: string;
    password: string;
    role: number;
    avatar: string;
    is_verified: boolean;
    created_at: Date;
    last_login?: Date;
    projects?: any[];
  }[];
}

if (!global.users) {
  global.users = [];
}

export async function POST(request: Request) {
  try {
    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Type and value are required' },
        { status: 400 }
      );
    }

    const trimmedValue = value.trim().toLowerCase();

    if (type === 'email') {
      // Check email availability
      const existingUser = global.users.find(user => user.email === trimmedValue);
      return NextResponse.json({
        available: !existingUser,
        message: existingUser ? 'Email already registered' : 'Email is available'
      });
    } else if (type === 'username') {
      // Check username availability
      const existingUser = global.users.find(user => user.username.toLowerCase() === trimmedValue);
      return NextResponse.json({
        available: !existingUser,
        message: existingUser ? 'Username already taken' : 'Username is available'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "email" or "username"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
} 