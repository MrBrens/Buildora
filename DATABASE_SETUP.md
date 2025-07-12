# Database Setup Guide for Buildora

## 🗄️ MAMP MySQL Connection 

### 1. MAMP Setup
1. **Start MAMP** and ensure MySQL is running
2. **Default MySQL settings:**
   - Host: `localhost`
   - Port: `8889` (MAMP default)
   - Username: `root`
   - Password: `root`
   - Database: `buildora`

### 2. Create Environment File
Create a `.env` file in the root directory:

```env
# MAMP MySQL Database Connection
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=buildora

# NextAuth Configuration
NEXTAUTH_SECRET=buildora-secret-key-2024-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Create Database
1. **Open phpMyAdmin** at `http://localhost:8888/phpMyAdmin`
2. **Create new database** named `buildora`
3. **Or use MySQL command line:**
   ```sql
   CREATE DATABASE buildora;
   ```

### 4. Initialize Database
1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the database init endpoint:**
   ```
   http://localhost:3000/api/db/init
   ```

3. **Check the response** - should show:
   ```json
   {
     "success": true,
     "message": "Database connected and initialized successfully!",
     "tables": ["users", "projects", "plans", "payments", "subscriptions"]
   }
   ```

### 5. Test Account Creation
1. **Go to signup page:** `http://localhost:3000/signup`
2. **Create a test account**
3. **Check phpMyAdmin** to see the user in the database

## 🔧 Troubleshooting

### Connection Issues
- **Check MAMP is running** on port 8888
- **Verify MySQL port** is 8889 (not 3306)
- **Check database exists** in phpMyAdmin
- **Verify credentials** (root/root)

### Port Issues
- **MAMP MySQL port:** 8889
- **MAMP Apache port:** 8888
- **Next.js port:** 3000

### Database Tables
The system will automatically create these tables:
- `users` - User accounts
- `projects` - User projects
- `plans` - Subscription plans
- `payments` - Payment records
- `subscriptions` - User subscriptions

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar ENUM('user', 'admin') DEFAULT 'user',
  role INT DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
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
);
```

## ✅ Success Indicators

1. **Database connection successful** in console
2. **Tables created** in phpMyAdmin
3. **User registration works** without errors
4. **Login works** with created accounts
5. **Data persists** after server restart

## 🚀 Next Steps

After successful database setup:
1. **Test user registration**
2. **Test user login**
3. **Create test projects**
4. **Verify data persistence**
5. **Deploy to production** with proper environment variables 