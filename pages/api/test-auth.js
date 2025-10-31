import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.status(200).json({
      authenticated: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        },
        expires: session.expires
      }
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({ 
      error: 'Authentication test failed',
      details: error.message 
    });
  }
}
