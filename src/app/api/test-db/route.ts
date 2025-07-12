import { NextResponse } from 'next/server';
import { testConnection, initDatabase } from '../../../lib/db';

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed',
          error: 'Could not connect to MySQL database'
        }, 
        { status: 500 }
      );
    }

    // Initialize database tables
    const isInitialized = await initDatabase();
    
    if (!isInitialized) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database initialization failed',
          error: 'Could not create database tables'
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connected and initialized successfully!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 