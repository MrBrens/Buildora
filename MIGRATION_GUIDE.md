# Buildora Migration Guide

## 🚀 Step-by-Step Migration Process

### Step 1: Create New Folder Structure

First, let's create the new directory structure:

```bash
# Create new directories
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features
mkdir -p src/components/providers
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/constants
mkdir -p src/types
mkdir -p src/lib/config
mkdir -p src/lib/utils
mkdir -p src/lib/api
mkdir -p src/lib/auth
mkdir -p src/lib/db
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p docs
mkdir -p scripts
```

### Step 2: Migrate Existing Components

#### Current Structure → New Structure

**Before:**
```
src/app/components/
├── AdvancedNavbar.tsx
├── AuthGuard.tsx
├── button/
├── ComponentLibrary.tsx
├── DashboardContent.tsx
├── LandingBuilder.tsx
├── LandingForm.tsx
├── SignupSuccess.tsx
└── StyleSelector.tsx
```

**After:**
```
src/components/
├── ui/
│   ├── button/
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── input/
│   ├── modal/
│   └── index.ts
├── layout/
│   ├── navbar/
│   │   ├── AdvancedNavbar.tsx
│   │   └── index.ts
│   └── dashboard-layout/
│       └── DashboardContent.tsx
├── features/
│   ├── auth/
│   │   ├── AuthGuard.tsx
│   │   └── SignupSuccess.tsx
│   ├── landing/
│   │   ├── LandingBuilder.tsx
│   │   ├── LandingForm.tsx
│   │   └── StyleSelector.tsx
│   └── dashboard/
└── providers/
    └── ComponentLibrary.tsx
```

### Step 3: Create Service Layer

#### Example: Auth Service

```typescript
// src/services/auth/auth.service.ts
import { findUserByEmail, createUser, updateUserLastLogin } from '@/lib/db';
import { hash, compare } from 'bcryptjs';

export class AuthService {
  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      // Check if user exists
      const existingUser = await findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hash(userData.password, 12);

      // Create user
      const result = await createUser({
        ...userData,
        password: hashedPassword,
      });

      return result;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  static async login(email: string, password: string) {
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await updateUserLastLogin(user.id);

      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
```

#### Example: Project Service

```typescript
// src/services/project/project.service.ts
import { createProject, getUserProjects } from '@/lib/db';

export class ProjectService {
  static async createProject(projectData: {
    user_id: number;
    folder_name: string;
    title: string;
    description?: string;
    logo?: string;
  }) {
    try {
      const result = await createProject(projectData);
      return result;
    } catch (error) {
      throw new Error(`Project creation failed: ${error.message}`);
    }
  }

  static async getUserProjects(userId: number) {
    try {
      const projects = await getUserProjects(userId);
      return projects;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  }
}
```

### Step 4: Create Custom Hooks

```typescript
// src/hooks/api/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { data, loading, error, execute };
}
```

```typescript
// src/hooks/auth/useAuth.ts
import { useSession, signIn, signOut } from 'next-auth/react';
import { AuthService } from '@/services/auth/auth.service';

export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await AuthService.register(userData);
      // Auto-login after registration
      return await login(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  };

  return {
    session,
    status,
    login,
    logout,
    register,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
  };
}
```

### Step 5: Create Type Definitions

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: 'user' | 'admin';
  role: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}
```

```typescript
// src/types/project.ts
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

export interface CreateProjectData {
  user_id: number;
  folder_name: string;
  title: string;
  description?: string;
  logo?: string;
}
```

### Step 6: Create Constants

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  BILLING: '/billing',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  PROJECTS: {
    CREATE: '/api/projects',
    LIST: '/api/projects',
    GET: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
  },
} as const;
```

```typescript
// src/constants/validation.ts
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
  },
} as const;

export const ERROR_MESSAGES = {
  USERNAME: {
    REQUIRED: 'Username is required',
    MIN_LENGTH: `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`,
    MAX_LENGTH: `Username must be less than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`,
    PATTERN: 'Username can only contain letters, numbers, and underscores',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    PATTERN: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  },
} as const;
```

### Step 7: Update Configuration Files

```typescript
// src/lib/config/database.ts
export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '8889'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'buildora',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
} as const;
```

```typescript
// src/lib/config/auth.ts
export const authConfig = {
  providers: {
    credentials: {
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Implementation here
      },
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} as const;
```

### Step 8: Create Utility Functions

```typescript
// src/lib/utils/validation.ts
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants/validation';

export class ValidationUtils {
  static validateUsername(username: string): string | null {
    if (!username) return ERROR_MESSAGES.USERNAME.REQUIRED;
    if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
      return ERROR_MESSAGES.USERNAME.MIN_LENGTH;
    }
    if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
      return ERROR_MESSAGES.USERNAME.MAX_LENGTH;
    }
    if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
      return ERROR_MESSAGES.USERNAME.PATTERN;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    if (!email) return ERROR_MESSAGES.EMAIL.REQUIRED;
    if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
      return ERROR_MESSAGES.EMAIL.INVALID;
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) return ERROR_MESSAGES.PASSWORD.REQUIRED;
    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD.MIN_LENGTH;
    }
    if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
      return ERROR_MESSAGES.PASSWORD.PATTERN;
    }
    return null;
  }
}
```

```typescript
// src/lib/utils/formatting.ts
export class FormattingUtils {
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  static formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
```

### Step 9: Update Package.json

```json
{
  "name": "buildora",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "db:migrate": "node scripts/database/migrate.js",
    "db:seed": "node scripts/database/seed.js"
  },
  "dependencies": {
    "next": "^15.3.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0-beta.29",
    "mysql2": "^3.14.2",
    "bcryptjs": "^3.0.2",
    "lucide-react": "^0.525.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5",
    "eslint": "^9",
    "tailwindcss": "^4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "playwright": "^1.40.0"
  }
}
```

## 🎯 Migration Priority

1. **High Priority**: Create service layer and migrate business logic
2. **Medium Priority**: Set up proper TypeScript types and constants
3. **Low Priority**: Add comprehensive testing and documentation

This migration guide provides a practical roadmap to transform your current codebase into a scalable, maintainable architecture while preserving existing functionality. 