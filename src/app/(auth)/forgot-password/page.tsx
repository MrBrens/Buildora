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

      {/* Forgot Password Form Container */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fadeIn">
          Mot de passe oublié ?
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-full transition-all transform hover:scale-105 shadow-lg animate-fadeIn delay-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Vérifiez votre email</h3>
                <p className="text-gray-300 text-sm">
                  Nous avons envoyé un lien de réinitialisation à <span className="text-purple-300 font-medium">{email}</span>
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Conseil :</strong> Vérifiez votre dossier spam si vous ne voyez pas l'email dans votre boîte de réception.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
} 