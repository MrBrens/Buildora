import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../../../lib/db';

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 2) {
    errors.push('Username must be at least 2 characters long');
  }
  
  if (username.length > 30) {
    errors.push('Username must be less than 30 characters');
  }
  
  if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, spaces, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Basic input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          error: 'All fields are required',
          field: !name ? 'name' : !email ? 'email' : 'password'
        },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input types' },
        { status: 400 }
      );
    }

    // 2. Trim whitespace
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 3. Validate email format
    if (!validateEmail(trimmedEmail)) {
      return NextResponse.json(
        { 
          error: 'Please enter a valid email address',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // 4. Validate username
    const usernameValidation = validateUsername(trimmedName);
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { 
          error: usernameValidation.errors[0],
          field: 'name'
        },
        { status: 400 }
      );
    }

    // 5. Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: passwordValidation.errors[0],
          field: 'password'
        },
        { status: 400 }
      );
    }

    // 6. Check for existing user in database
    const existingUser = await findUserByEmail(trimmedEmail);
    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists',
          field: 'email'
        },
        { status: 409 }
      );
    }

    // 7. Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 8. Create new user in database
    const userData = {
      username: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: 1,
      avatar: 'user'
    };

    const result = await createUser(userData);
    
    // 9. Return success response
    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: {
          id: (result as any).insertId,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle database-specific errors
    if (error instanceof Error) {
      if (error.message.includes('Duplicate entry')) {
        return NextResponse.json(
          { 
            error: 'An account with this email already exists',
            field: 'email'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}