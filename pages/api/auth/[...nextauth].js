import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

// Debug logger
const debug = (message, data) => {
  console.log(`[AUTH_DEBUG] ${message}`, JSON.stringify(data, null, 2));
};

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
          debug('Authorization attempt started', { email: credentials?.email });
          
          if (!credentials?.email || !credentials?.password) {
            const error = new Error('Email and password are required');
            debug('Missing credentials', { error: error.message });
            throw error;
          }

          debug('Connecting to database...');
          await dbConnect();
          
          // Find user by email (case-insensitive)
          debug('Searching for user...', { email: credentials.email });
          const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${credentials.email}$`, 'i') } 
          }).select('+password');
          
          if (!user) {
            const error = new Error('No user found with this email');
            debug('User not found', { email: credentials.email });
            throw error;
          }

          debug('User found', { userId: user._id, email: user.email });
          
          // Check password
          debug('Verifying password...');
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            const error = new Error('Incorrect password');
            debug('Password verification failed', { userId: user._id });
            throw error;
          }

          debug('Authentication successful', { userId: user._id, role: user.role });
          
          // Return user object without password
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role || 'user'
          };
        } catch (error) {
          debug('Authorization error', { 
            error: error.message,
            stack: error.stack 
          });
          throw error; // Re-throw to let NextAuth handle the error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
   pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', { code, metadata });
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', { code, metadata });
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-dev',
};

export default NextAuth(authOptions);