import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      handleCodeInApp: true,
    });

    return res.status(200).json({ 
      message: 'Password reset email sent. Please check your inbox.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(400).json({ 
      message: error.message || 'Failed to send password reset email' 
    });
  }
}