// pages/api/auth/register.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with plain password
    const user = new User({
      email,
      password, // This will be hashed by the pre-save hook
      plainPassword: password, // Store plain text password (for testing only)
      role: 'user',
    });

    await user.save();

    return res.status(201).json({ 
      message: 'User created successfully',
      user: { 
        email: user.email,
        role: user.role,
        // Don't return the plain password in the response
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: error.message || 'Error creating user' 
    });
  }
}