"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Zap, Palette, Code, Users, Star, ArrowRight, Play, CheckCircle, Globe, Rocket, Brain, Wand2 } from 'lucide-react';

const BuildoraLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading Buildora...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Design",
      description: "Our advanced AI understands your brand and creates stunning designs automatically"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Generate professional landing pages in seconds, not hours"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Infinite Customization",
      description: "Fine-tune every element with our intuitive drag-and-drop editor"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      content: "Buildora helped me create a stunning landing page in 5 minutes. The AI understood exactly what I needed!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Director",
      content: "Our conversion rates increased by 240% after switching to Buildora. The AI suggestions are incredibly smart.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Freelance Designer",
      content: "I can now deliver projects 10x faster to my clients. Buildora is a game-changer for my business.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 20,
            top: mousePosition.y / 20,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Wand2 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Buildora
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-purple-300 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-purple-300 transition-colors">Pricing</a>
        </div>
        <Link href="/login" className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 inline-block">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">AI-Powered Landing Page Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Create{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Stunning
              </span>
              <br />
              Landing Pages with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into high-converting landing pages in seconds. 
              No design skills required. Just describe your vision and watch the magic happen.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/login" className="w- group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 inline-block">
                <span>Start Building Free</span>
              </Link>
              
              <button className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <span className="text-lg">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating UI Preview */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 transform hover:scale-105 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 transform ${
                    activeFeature === index 
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 scale-105' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`mb-4 ${activeFeature === index ? 'text-purple-300' : 'text-gray-400'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of web design with our cutting-edge artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12" />,
                title: "Smart Content Generation",
                description: "AI writes compelling copy tailored to your audience and industry"
              },
              {
                icon: <Palette className="w-12 h-12" />,
                title: "Intelligent Design System",
                description: "Automatically selects perfect colors, fonts, and layouts for your brand"
              },
              {
                icon: <Code className="w-12 h-12" />,
                title: "Clean Code Export",
                description: "Export pixel-perfect, production-ready HTML, CSS, and React code"
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Instant Optimization",
                description: "Built-in SEO and performance optimization for maximum conversions"
              },
              {
                icon: <Globe className="w-12 h-12" />,
                title: "Multi-language Support",
                description: "Create landing pages in 50+ languages with AI translation"
              },
              {
                icon: <Rocket className="w-12 h-12" />,
                title: "One-Click Deploy",
                description: "Publish to your domain or our CDN with a single click"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-purple-400 mb-6 group-hover:text-pink-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 lg:px-12 py-32 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-gray-300">See what our users are saying about Buildora</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform
            </span>
            <br />
            Your Ideas?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of creators, marketers, and entrepreneurs who are building stunning landing pages with AI
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link href="/login" className="group bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-5 rounded-full text-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 inline-block">
              <span>Start Your Free Trial</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>7-Day Free Trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Buildora
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Buildora. All rights reserved. Built with AI, designed for humans.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuildoraLanding;
