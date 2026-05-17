// ការកំណត់រចនាសម្ព័ន្ធ NextAuth.js
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// អ៊ីមែល Admin តែមួយគត់ដែលអាចចូលផ្ទាំងគ្រប់គ្រង
export const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export function isAdminUser(user: { email?: string | null; role?: string } | undefined | null): boolean {
  if (!user?.email) return false
  return user.email === ADMIN_EMAIL || user.role === 'ADMIN'
}

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
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const googleEmail = (profile as { email?: string })?.email || user.email
        if (!googleEmail) return false

        // Check if this Google account is linked to a different user
        const linkedAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          include: { user: true },
        })

        if (linkedAccount && linkedAccount.user.email !== googleEmail) {
          // Google account is linked to the wrong user — delete the stale link
          await prisma.account.delete({
            where: { id: linkedAccount.id },
          })
        }

        // Ensure a User record exists for this Google email
        const existingUser = await prisma.user.findUnique({
          where: { email: googleEmail },
        })
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: googleEmail,
              name: user.name || googleEmail.split('@')[0],
              image: user.image,
              role: googleEmail === ADMIN_EMAIL ? 'ADMIN' : 'USER',
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
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'USER'
        token.id = user.id
      }
      // Use Google's email directly to prevent stale DB email in token
      if (account?.provider === 'google' && (profile as { email?: string })?.email) {
        token.email = (profile as { email?: string }).email
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
