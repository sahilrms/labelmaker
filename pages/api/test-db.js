// pages/api/test-db.js
import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
  try {
    // Test the connection
    const mongoose = await dbConnect();
    
    // Check if the connection is successful
    const isConnected = mongoose.connection.readyState === 1; // 1 = connected
    
    res.status(200).json({ 
      success: true, 
      message: 'Successfully connected to MongoDB using Mongoose',
      db: mongoose.connection.name,
      connectionState: {
        isConnected,
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      mongoUri: process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is not set'
    });
  }
}