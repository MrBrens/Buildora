import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUserLastLogin } from "../../../../lib/db";
import type { NextAuthConfig, Session } from "next-auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Partial<Record<'email' | 'password', unknown>>) {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        console.log('[AUTH][DEBUG] Received credentials:', { email, password });
        if (!email || !password) {
          console.log('[AUTH][DEBUG] Missing email or password');
          return null;
        }
        const trimmedEmail = email.trim().toLowerCase();
        const user = await findUserByEmail(trimmedEmail);
        console.log('[AUTH][DEBUG] User found:', !!user, user);
        if (!user) {
          console.log('[AUTH][DEBUG] No user found for email:', trimmedEmail);
          return null;
        }
        console.log('[AUTH][DEBUG] DB hash:', user.password);
        const isValid = await bcrypt.compare(password, user.password);
        console.log('[AUTH][DEBUG] bcrypt.compare result:', isValid);
        if (!isValid) {
          console.log('[AUTH][DEBUG] Password does not match');
          return null;
        }
        await updateUserLastLogin(user.id);
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
          role: user.role,
          is_verified: user.is_verified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.is_verified = user.is_verified;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token?.id) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).is_verified = token.is_verified;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "buildora-secret-key-2024-change-in-production",
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60
  },
  debug: process.env.NODE_ENV === "development"
};

const { handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;