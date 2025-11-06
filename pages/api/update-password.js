// pages/api/update-password.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;

  try {
    await dbConnect();
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error updating password'
    });
  }
}