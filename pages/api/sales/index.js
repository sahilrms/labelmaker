// pages/api/sales/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import Sale from '../../../models/Sale';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    // Get the session on the server side
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: No valid session found' 
      });
    }

    // Connect to database
    await dbConnect();

    // Find sales for the current user
    const sales = await Sale.find({ userId: session.user.id })
      .sort({ date: -1 })
      .populate('counterId', 'name') // Populate counter name
      .populate('items.productId', 'name') // Populate product names
      .lean(); // Convert to plain JavaScript objects
    
    return res.status(200).json({ 
      success: true,
      data: sales 
    });
    
  } catch (error) {
    console.error('Error in /api/sales:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch sales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}