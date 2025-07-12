import mysql from 'mysql2/promise';

// Database configuration for MAMP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '8889'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'buildora',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Type definitions
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: 'user' | 'admin';
  role: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  user_id: number;
  folder_name: string;
  title: string;
  description: string;
  logo: string;
  status: 'draft' | 'generating' | 'completed';
  created_at: Date;
  updated_at: Date;
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar ENUM('user', 'admin') DEFAULT 'user',
        role INT DEFAULT 1,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        folder_name VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        logo VARCHAR(255),
        status ENUM('draft', 'generating', 'completed') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create plans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        duration_days INT DEFAULT 30,
        features TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create subscriptions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan_id INT NOT NULL,
        payment_id INT NOT NULL,
        status ENUM('active', 'expired', 'canceled', 'trial') DEFAULT 'active',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('✅ Database tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// User operations
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  role?: number;
  avatar?: string;
}) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.email, userData.password, userData.role || 1, userData.avatar || 'user']
    );
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] as User : null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

export async function findUserById(id: number): Promise<User | null> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] as User : null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

export async function updateUserLastLogin(id: number) {
  try {
    await pool.execute(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
}

// Project operations
export async function createProject(projectData: {
  user_id: number;
  folder_name: string;
  title: string;
  description?: string;
  logo?: string;
}) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO projects (user_id, folder_name, title, description, logo) VALUES (?, ?, ?, ?, ?)',
      [projectData.user_id, projectData.folder_name, projectData.title, projectData.description || '', projectData.logo || '']
    );
    return result;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getUserProjects(userId: number): Promise<Project[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows as Project[];
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
}

export default pool; 