// pages/api/auth/session.js
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    const token = await getToken({ req, secret });

    if (!session && !token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Return the current session data
    return res.status(200).json({
      accessToken: session?.accessToken || token?.accessToken,
      user: session?.user || token?.user,
      expires: session?.expires || token?.exp,
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}