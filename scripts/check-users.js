import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // List all users
    const users = await User.find({}).select('-password -plainPassword');
    console.log('Users in database:', JSON.stringify(users, null, 2));
    
    // Check if admin@mail.com exists
    const admin = await User.findOne({ email: 'admin@mail.com' });
    console.log('Admin user:', admin ? 'Exists' : 'Not found');
    
    if (admin) {
      console.log('Admin user details:', {
        email: admin.email,
        role: admin.role,
        hasPassword: !!admin.password,
        hasPlainPassword: !!admin.plainPassword
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
