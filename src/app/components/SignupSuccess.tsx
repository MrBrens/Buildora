'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SignupSuccessProps {
  user: {
    username: string;
    email: string;
  };
}

export default function SignupSuccess({ user }: SignupSuccessProps) {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
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

      {/* Success Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center animate-fadeInUp">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Compte créé avec succès!
        </h1>
        
        <p className="text-gray-300 mb-6">
          Bienvenue <span className="text-purple-300 font-semibold">{user.username}</span>! 
          Votre compte a été créé avec succès.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-300 text-sm">
            📧 Un email de confirmation a été envoyé à <span className="font-medium">{user.email}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoToLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Se connecter maintenant
          </button>
          
          <Link 
            href="/dashboard" 
            className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all duration-300"
          >
            Aller au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
} 