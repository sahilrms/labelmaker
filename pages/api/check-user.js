// pages/api/check-user.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email: /a@b.com/i }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      email: user.email,
      passwordHash: user.password,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error fetching user',
      error: error.message 
    });
  }
}