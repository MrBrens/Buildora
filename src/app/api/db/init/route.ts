import { NextResponse } from 'next/server';
import { testConnection, initDatabase } from '../../../../lib/db';

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'Please check your MAMP MySQL settings'
        },
        { status: 500 }
      );
    }

    // Initialize database tables
    const isInitialized = await initDatabase();
    
    if (!isInitialized) {
      return NextResponse.json(
        { 
          error: 'Database initialization failed',
          message: 'Could not create database tables'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connected and initialized successfully!',
      tables: ['users', 'projects', 'plans', 'payments', 'subscriptions']
    });

  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { 
        error: 'Database initialization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 