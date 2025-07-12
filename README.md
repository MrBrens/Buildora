# Buildora - Authentication System

A modern Next.js application with a fully functional authentication system built with NextAuth.js.

## Features

- ✅ **User Registration & Login** - Complete signup and login functionality
- ✅ **Session Management** - Persistent sessions with JWT strategy
- ✅ **Protected Routes** - Dashboard protected with AuthGuard component
- ✅ **Password Security** - Bcrypt password hashing
- ✅ **Modern UI** - Beautiful gradient design with animations
- ✅ **TypeScript Support** - Full type safety
- ✅ **Responsive Design** - Works on all devices

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Important:** Replace `your-super-secret-key-change-this-in-production` with a strong secret key for production.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Authentication Flow

### Registration
1. User visits `/signup`
2. Fills out name, email, and password
3. Password is hashed with bcrypt
4. User is automatically logged in and redirected to dashboard

### Login
1. User visits `/login`
2. Enters email and password
3. Credentials are verified against stored users
4. User is redirected to dashboard on success

### Protected Routes
- Dashboard (`/dashboard`) is protected with `AuthGuard`
- Unauthenticated users are redirected to login
- Session state is managed globally

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   └── signup/route.ts              # User registration API
│   ├── components/
│   │   └── AuthGuard.tsx               # Route protection component
│   ├── dashboard/page.tsx               # Protected dashboard
│   ├── login/page.tsx                   # Login page
│   ├── signup/page.tsx                  # Registration page
│   └── page.tsx                        # Home page
├── types/
│   └── next-auth.d.ts                  # TypeScript types
└── globals.css                         # Global styles
```

## Key Components

### AuthGuard
Protects routes by checking session status and redirecting unauthenticated users.

### NextAuth Configuration
- Uses Credentials provider
- JWT session strategy
- Custom callbacks for user data
- Error handling and redirects

### User Storage
Currently uses in-memory storage for development. For production, replace with a database.

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. **Environment Variables**: Use strong secrets and proper environment management
3. **HTTPS**: Ensure HTTPS in production
4. **Rate Limiting**: Add rate limiting to auth endpoints
5. **Email Verification**: Add email verification for new accounts
6. **Password Reset**: Implement password reset functionality

## Development

### Adding New Protected Routes

```tsx
import AuthGuard from '../components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Your protected content here</div>
    </AuthGuard>
  );
}
```

### Customizing User Data

Modify the user object in `src/app/api/signup/route.ts` to include additional fields.

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check that the user exists and password is correct
2. **Session not persisting**: Verify NEXTAUTH_SECRET is set
3. **Redirect loops**: Check AuthGuard implementation and session status

### Debug Mode

Set `NODE_ENV=development` to enable NextAuth debug mode for detailed logs.

## Technologies Used

- **Next.js 15** - React framework
- **NextAuth.js** - Authentication library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **bcryptjs** - Password hashing

## License

MIT License - feel free to use this code for your projects!
