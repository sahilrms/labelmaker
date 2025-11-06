import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';
import Counter from '../../../../models/Counter';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        return handleGetCounter(req, res, id);
      case 'PUT':
        return handleUpdateCounter(req, res, id, session);
      case 'DELETE':
        return handleDeleteCounter(req, res, id, session);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function handleGetCounter(req, res, id) {
  try {
    const counter = await Counter.findById(id).lean();
    if (!counter) {
      return res.status(404).json({ success: false, message: 'Counter not found' });
    }
    return res.status(200).json({ success: true, data: counter });
  } catch (error) {
    console.error('Error fetching counter:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch counter' });
  }
}

async function handleUpdateCounter(req, res, id, session) {
  try {
    const { name, location, isActive } = req.body;
    
    const counter = await Counter.findById(id);
    if (!counter) {
      return res.status(404).json({ success: false, message: 'Counter not found' });
    }

    // Check if the user is authorized to update this counter
    if (counter.createdBy.toString() !== session.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this counter' 
      });
    }

    counter.name = name || counter.name;
    counter.location = location || counter.location;
    if (typeof isActive !== 'undefined') {
      counter.isActive = isActive;
    }
    counter.updatedAt = new Date();

    await counter.save();

    return res.status(200).json({
      success: true,
      data: counter,
      message: 'Counter updated successfully'
    });
  } catch (error) {
    console.error('Error updating counter:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Counter with this name already exists' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to update counter' 
    });
  }
}

async function handleDeleteCounter(req, res, id, session) {
  try {
    const counter = await Counter.findById(id);
    
    if (!counter) {
      return res.status(404).json({ success: false, message: 'Counter not found' });
    }

    // Check if the user is authorized to delete this counter
    if (counter.createdBy.toString() !== session.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this counter' 
      });
    }

    // Check if there are any sales associated with this counter
    const saleCount = await Sale.countDocuments({ counterId: id });
    if (saleCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete counter with associated sales. Please delete the sales first.'
      });
    }

    await Counter.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Counter deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting counter:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete counter' 
    });
  }
}
