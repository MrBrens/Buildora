
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Don't render if session is loading or user is already logged in
  if (session) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      if (result?.ok) {
        // On success, redirect to dashboard
        router.push('/dashboard');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
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

      {/* Login Form Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fadeIn">
          Bienvenue chez Buildora
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg animate-fadeIn">
              {error}
            </div>
          )}

          <div className="flex flex-col animate-fadeIn delay-100">
            <label htmlFor="email" className="text-sm text-gray-300 mb-2">Adresse Email</label>
            <input
              id="email"
              type="email"
              placeholder="votremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="p-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-white transition-all disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col animate-fadeIn delay-200">
            <label htmlFor="password" className="text-sm text-gray-300 mb-2">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="p-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-white transition-all disabled:opacity-50"
            />
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-full transition-all transform hover:scale-105 shadow-lg animate-fadeIn delay-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>

        </form>

        {/* Link to Signup */}
        <p className="mt-6 text-center text-sm text-gray-300 animate-fadeIn delay-700">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-pink-400 hover:underline font-semibold">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}
