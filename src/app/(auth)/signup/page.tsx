'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignupSuccess from '../../components/SignupSuccess';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<{ username: string; email: string } | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  if (session) {
    router.push('/dashboard');
    return null;
  }

  // Show success screen if account was created
  if (showSuccess && createdUser) {
    return <SignupSuccess user={createdUser} />;
  }

  // Clear field-specific error when user starts typing
  const clearFieldError = (field: keyof FormErrors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 30) {
      newErrors.name = 'Name must be less than 30 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.password = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Client-side validation
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Call the signup API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle field-specific errors from server
        if (data.field) {
          setErrors({ [data.field]: data.error });
        } else {
          setErrors({ general: data.error || 'Failed to create account' });
        }
        return;
      }

      // Store created user data
      setCreatedUser({
        username: name.trim(),
        email: email.trim()
      });

      // Show success screen
      setShowSuccess(true);

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      console.error('Signup error:', err);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Form Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fadeIn">
          Rejoignez Buildora
        </h1>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-6">

          {/* General Error Display */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg animate-fadeIn">
              {errors.general}
            </div>
          )}

          <div className="flex flex-col animate-fadeIn delay-100">
            <label htmlFor="name" className="text-sm text-gray-300 mb-2">Nom complet</label>
            <input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError('name');
              }}
              required
              disabled={isLoading}
              className={`p-4 rounded-lg bg-white/10 border transition-all disabled:opacity-50 focus:outline-none focus:ring-2 placeholder-gray-400 text-white ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white/20 focus:ring-purple-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col animate-fadeIn delay-200">
            <label htmlFor="email" className="text-sm text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              placeholder="votremail@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
              required
              disabled={isLoading}
              className={`p-4 rounded-lg bg-white/10 border transition-all disabled:opacity-50 focus:outline-none focus:ring-2 placeholder-gray-400 text-white ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white/20 focus:ring-purple-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col animate-fadeIn delay-300">
            <label htmlFor="password" className="text-sm text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe sécurisé"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                required
                disabled={isLoading}
                className={`p-4 pr-12 rounded-lg bg-white/10 border transition-all disabled:opacity-50 focus:outline-none focus:ring-2 placeholder-gray-400 text-white w-full ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 animate-fadeIn">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col animate-fadeIn delay-400">
            <label htmlFor="confirmPassword" className="text-sm text-gray-300 mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="p-4 pr-12 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-white w-full transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-full transition-all transform hover:scale-105 shadow-lg animate-fadeIn delay-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Création du compte...' : 'Créer un compte'}
          </button>

        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-300 animate-fadeIn delay-700">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-pink-400 hover:underline font-semibold">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}
