// pages/api/sales/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the session on the server side
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();
    const sales = await db.collection('sales')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return res.status(200).json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}