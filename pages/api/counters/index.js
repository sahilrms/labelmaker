import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Counter from '../../../models/Counter';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        return handleGetCounters(req, res, session);
      case 'POST':
        return handleCreateCounter(req, res, session);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function handleGetCounters(req, res, session) {
  try {
    const counters = await Counter.find({}).lean();
    return res.status(200).json({ success: true, data: counters });
  } catch (error) {
    console.error('Error fetching counters:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch counters' });
  }
}

async function handleCreateCounter(req, res, session) {
  try {
    const { name, location } = req.body;
    
    const counter = new Counter({
      name,
      location,
      createdBy: session.user.id
    });

    await counter.save();

    return res.status(201).json({
      success: true,
      data: counter,
      message: 'Counter created successfully'
    });
  } catch (error) {
    console.error('Error creating counter:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Counter with this name already exists' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create counter' 
    });
  }
}
