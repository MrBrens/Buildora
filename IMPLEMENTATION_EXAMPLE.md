# Implementation Example: Forgot Password Feature

This document shows how to refactor the current forgot password functionality using the advanced architecture.

## 🔄 Before vs After Comparison

### Current Implementation (Before)

```typescript
// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    // ... JSX implementation
  );
}
```

### Refactored Implementation (After)

#### 1. Service Layer

```typescript
// src/services/auth/auth.service.ts
export class AuthService {
  // ... existing methods

  static async forgotPassword(email: string): Promise<void> {
    try {
      // Validate email
      const emailError = ValidationUtils.validateEmail(email);
      if (emailError) {
        throw new Error(emailError);
      }

      // Check if user exists
      const user = await findUserByEmail(email);
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // Generate reset token
      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save reset token to database
      await updateUserResetToken(user.id, resetToken, resetTokenExpiry);

      // Send email (implement email service)
      await EmailService.sendPasswordResetEmail(email, resetToken);

      return;
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}
```

#### 2. Custom Hook

```typescript
// src/hooks/auth/useForgotPassword.ts
import { useState } from 'react';
import { useApi } from '@/hooks/api/useApi';
import { AuthService } from '@/services/auth/auth.service';
import { ROUTES } from '@/constants/routes';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { loading, error, execute } = useApi({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await execute(async () => {
      await AuthService.forgotPassword(email);
    });
  };

  const resetForm = () => {
    setEmail('');
    setIsSubmitted(false);
  };

  return {
    email,
    setEmail,
    isSubmitted,
    loading,
    error,
    handleSubmit,
    resetForm,
  };
}
```

#### 3. Type Definitions

```typescript
// src/types/auth.ts
export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetTokenData {
  token: string;
  expiry: Date;
}
```

#### 4. Constants

```typescript
// src/constants/messages.ts
export const AUTH_MESSAGES = {
  FORGOT_PASSWORD: {
    SUCCESS: 'Password reset link sent to your email',
    ERROR: 'Failed to send reset link',
    NO_ACCOUNT: 'No account found with this email address',
    INVALID_EMAIL: 'Please enter a valid email address',
  },
} as const;
```

#### 5. Refactored Component

```typescript
// src/app/(auth)/forgot-password/page.tsx
'use client';

import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '@/components/features/auth/ForgotPasswordSuccess';
import { AuthLayout } from '@/components/layout/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const {
    email,
    setEmail,
    isSubmitted,
    loading,
    error,
    handleSubmit,
  } = useForgotPassword();

  return (
    <AuthLayout>
      {!isSubmitted ? (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <ForgotPasswordSuccess email={email} />
      )}
    </AuthLayout>
  );
}
```

#### 6. Form Component

```typescript
// src/components/features/auth/ForgotPasswordForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ValidationUtils } from '@/lib/utils/validation';
import { AUTH_MESSAGES } from '@/constants/messages';

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: Error | null;
}

export function ForgotPasswordForm({
  email,
  setEmail,
  onSubmit,
  loading,
  error,
}: ForgotPasswordFormProps) {
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = ValidationUtils.validateEmail(value);
    setEmailError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = ValidationUtils.validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fadeIn">
        Mot de passe oublié ?
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col animate-fadeIn delay-100">
          <label htmlFor="email" className="text-sm text-gray-300 mb-2">
            Adresse Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="votremail@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            error={emailError || error?.message}
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={loading || !!emailError}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
        </Button>
      </form>
    </div>
  );
}
```

#### 7. Success Component

```typescript
// src/components/features/auth/ForgotPasswordSuccess.tsx
import { Button } from '@/components/ui/button';
import { AUTH_MESSAGES } from '@/constants/messages';

interface ForgotPasswordSuccessProps {
  email: string;
}

export function ForgotPasswordSuccess({ email }: ForgotPasswordSuccessProps) {
  return (
    <div className="text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Vérifiez votre email
        </h3>
        <p className="text-gray-300 text-sm">
          {AUTH_MESSAGES.FORGOT_PASSWORD.SUCCESS}
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Email envoyé à <span className="text-purple-300 font-medium">{email}</span>
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Conseil :</strong> Vérifiez votre dossier spam si vous ne voyez pas l'email dans votre boîte de réception.
        </p>
      </div>
    </div>
  );
}
```

#### 8. Layout Component

```typescript
// src/components/layout/auth/AuthLayout.tsx
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ left: '20%', top: '10%' }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {children}
    </div>
  );
}
```

#### 9. Base UI Components

```typescript
// src/components/ui/button/index.tsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    className,
    ...props 
  }, ref) => {
    const baseClasses = 'font-bold py-4 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
      secondary: 'bg-white/10 border border-white/20 hover:bg-white/20 text-white',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Chargement...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```typescript
// src/components/ui/input/index.tsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    error, 
    className,
    ...props 
  }, ref) => {
    return (
      <div className="flex flex-col">
        <input
          ref={ref}
          className={clsx(
            'p-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-white transition-all disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-red-400 text-sm mt-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

## 🎯 Benefits of This Refactoring

1. **Separation of Concerns**: Business logic is separated from UI components
2. **Reusability**: Components can be reused across different pages
3. **Testability**: Each layer can be tested independently
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Maintainability**: Clear structure makes it easy to modify and extend
6. **Error Handling**: Centralized error handling and validation
7. **Performance**: Optimized re-renders with proper hooks

## 📋 Implementation Checklist

- [ ] Create service layer for authentication
- [ ] Implement custom hooks for form handling
- [ ] Create reusable UI components
- [ ] Add proper TypeScript types
- [ ] Implement validation utilities
- [ ] Add error handling
- [ ] Create layout components
- [ ] Add loading states
- [ ] Implement proper routing
- [ ] Add accessibility features

This refactoring transforms a simple component into a scalable, maintainable feature that follows modern React and TypeScript best practices. 