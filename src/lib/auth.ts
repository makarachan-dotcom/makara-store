// ការកំណត់រចនាសម្ព័ន្ធ NextAuth.js
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// អ៊ីមែល Admin តែមួយគត់ដែលអាចចូលផ្ទាំងគ្រប់គ្រង
const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // ការផ្ទៀងផ្ទាត់ដោយអ៊ីមែល និងពាក្យសម្ងាត់
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('InvalidCredentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('InvalidCredentials')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error('InvalidCredentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    // Google OAuth 2.0
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.image,
              role: user.email === ADMIN_EMAIL ? 'ADMIN' : 'USER',
            },
          })
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'USER'
        token.id = user.id
      }
      if (token.email === ADMIN_EMAIL) {
        token.role = 'ADMIN'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
