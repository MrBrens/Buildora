import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: number
      is_verified: boolean
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    role: number
    is_verified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: number
    is_verified: boolean
  }
} 