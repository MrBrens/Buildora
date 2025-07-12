import React from 'react';
import { ButtonProps } from "./create-account-button.type"
import Link from 'next/link';
export default function LoginButton({ 
  label,
  link = '/'
}: ButtonProps) {
  return (
          <Link
        href={link}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-95"
      >
        {label}
      </Link>
  );
}
