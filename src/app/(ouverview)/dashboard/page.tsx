'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import AdvancedNavbar from '../../components/UserNavbar';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const userImage = (session?.user as any)?.image || '/default-avatar.png';
  const userName = session?.user?.name || session?.user?.email || 'User';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col w-screen h-screen overflow-hidden text-white">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ left: '20%', top: '10%' }}
          />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-bounce" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        {/* Advanced Navbar */}
        <AdvancedNavbar />
        {/* Main Content with top padding for fixed navbar */}
        <main className="flex-1 flex flex-col min-h-0 w-full h-full pt-20 relative z-10">
          <div className="flex-1 min-h-0 w-full h-full flex flex-col">
            <div className="flex-1 min-h-0 w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Buildora AI Discussion */}
              <div className="relative bg-white/10 backdrop-blur-2xl border-r border-white/10 p-0 flex flex-col h-full min-h-0 overflow-hidden animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-gradient-to-r from-blue-50/10 to-purple-50/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">B</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Buildora AI</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100/10 text-blue-300 font-semibold">Online</span>
                      </div>
                      <span className="text-xs text-gray-300">Powered by Buildora AI</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-300">Active</span>
                  </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-br from-white/10 to-blue-50/0">
                  {/* AI message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">B</div>
                    <div>
                      <div className="bg-purple-500/10 text-purple-100 px-5 py-3 rounded-2xl rounded-bl-none max-w-md shadow-sm">
                        Hi! How can I help you build today?
                      </div>
                      <span className="text-xs text-gray-400 ml-2">09:00</span>
                    </div>
                  </div>
                  {/* User message */}
                  <div className="flex items-start gap-3 justify-end">
                    <div>
                      <div className="bg-white/10 text-white px-5 py-3 rounded-2xl rounded-br-none max-w-md shadow border border-white/10">
                        Show me a Next.js login page example.
                      </div>
                      <span className="text-xs text-gray-400 ml-2 flex justify-end">09:01</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-200/20 rounded-full flex items-center justify-center text-gray-200 font-bold text-lg">U</div>
                  </div>
                  {/* AI message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">B</div>
                    <div>
                      <div className="bg-purple-500/10 text-purple-100 px-5 py-3 rounded-2xl rounded-bl-none max-w-md shadow-sm">
                        Sure! Here is a simple example on the right.
                      </div>
                      <span className="text-xs text-gray-400 ml-2">09:01</span>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <form className="flex items-center gap-2 px-8 py-5 border-t border-white/10 bg-white/5">
                  <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/10 text-white placeholder-gray-400" />
                  <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow transition-all">Send</button>
                </form>
              </div>
              {/* Right: Code Rendering Area */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-none shadow-xl border-l border-white/10 p-0 h-full min-h-0 overflow-hidden flex flex-col animate-fadeInUp">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-gradient-to-r from-gray-900/80 to-purple-900/80">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">AI Generated Code</span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-pink-700/20 text-pink-200">Preview</span>
                  </div>
                                    <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-800/60 transition" title="Copy">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-800/60 transition" title="Publish">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-800/60 transition" title="Download">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12"/></svg>
                    </button>
                  </div>
                </div>
                {/* Code Area */}
                <div className="flex-1 min-h-0 overflow-auto p-8 bg-gradient-to-br from-gray-900/80 to-purple-900/80">
                  <pre className="bg-gray-900/80 rounded-xl p-6 text-pink-200 text-sm overflow-x-auto font-mono shadow-inner">
{`import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>
        <input type="email" placeholder="Email" className="mb-4 w-full px-3 py-2 border rounded" />
        <input type="password" placeholder="Password" className="mb-6 w-full px-3 py-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">Sign In</button>
      </form>
    </div>
  );
}
`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}