'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserNavbarProps {
  className?: string;
}

export default function UserNavbar({ className = '' }: UserNavbarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const userImage = (session?.user as any)?.image || '/default-avatar.png';
  const userName = session?.user?.name || session?.user?.email || 'User';

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: null, badge: null },
    { id: 'projects', name: 'Projects', href: '/projects', icon: null, badge: '3' },
    { id: 'analytics', name: 'Analytics', href: '/analytics', icon: null, badge: null },
    { id: 'team', name: 'Team', href: '/team', icon: null, badge: 'New' },
    { id: 'settings', name: 'Settings', href: '/settings', icon: null, badge: null },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20' 
          : 'bg-slate-900/90 backdrop-blur-lg'
      } ${className}`}>
        
        {/* Main Navigation - Full Width */}
        <div className="w-full">
          <div className="max-w-full px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo Section */}
              <div className="flex items-center space-x-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <span className="text-white font-bold text-lg">B</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Buildora
                      </span>
                      <span className="text-xs text-gray-400 -mt-1">Build • Deploy • Scale</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Navigation - Full Width */}
                <div className="hidden lg:flex items-center space-x-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setActiveTab(item.id)}
                      className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            item.badge === 'New' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                              : 'bg-white/10 text-gray-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects, analytics..."
                      className="w-64 pl-10 pr-4 py-2 text-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400"
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                </button>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={userImage}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-lg border-2 border-white/20 object-cover shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-white">{userName}</p>
                      <p className="text-xs text-gray-400">Premium User</p>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50">
                      {/* User Info Header */}
                      <div className="px-6 py-4 border-b border-white/10">
                        <div className="flex items-center space-x-4">
                          <img
                            src={userImage}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{userName}</p>
                            <p className="text-sm text-gray-400">{session?.user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">Premium</span>
                              <span className="text-xs text-gray-400">• Online</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="px-6 py-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button className="flex items-center space-x-2 p-3 text-sm text-gray-300 hover:bg-white/10 rounded-xl transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile</span>
                          </button>
                          <button className="flex items-center space-x-2 p-3 text-sm text-gray-300 hover:bg-white/10 rounded-xl transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                          </button>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <a href="/billing" className="flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors duration-200">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Billing & Plans
                        </a>
                        <a href="/help" className="flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors duration-200">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Help & Support
                        </a>
                        <div className="border-t border-white/10 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.badge === 'New' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-white/10 text-gray-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
} 