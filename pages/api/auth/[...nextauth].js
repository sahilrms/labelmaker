// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('Authenticating user:', credentials.email);
          const { db } = await connectToDatabase();
          const user = await db.collection('users').findOne({
            email: credentials.email,
          });

          if (!user) {
            console.log('No user found with email:', credentials.email);
            return null;
          }

          // In a real app, use proper password hashing
          const isValidPassword = credentials.password === user.password || 
                               credentials.password === user.plainPassword;

          if (!isValidPassword) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('User authenticated successfully:', user.email);
          return { 
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
     return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);