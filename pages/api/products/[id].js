// pages/api/products/[id].js
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        try {
          const product = await Product.findById(id).lean();
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }
          return res.status(200).json({ success: true, data: product });
        } catch (error) {
          console.error('Error fetching product:', error);
          return res.status(400).json({ success: false, message: 'Error fetching product' });
        }

      case 'PUT':
        try {
          const product = await Product.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
          ).lean();
          
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }
          
          return res.status(200).json({ success: true, data: product });
        } catch (error) {
          console.error('Error updating product:', error);
          return res.status(400).json({ success: false, message: 'Error updating product' });
        }

      case 'DELETE':
        try {
          // Check if product exists
          const product = await Product.findById(id);
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          // Check if product has any sales (optional: prevent deletion if product has sales)
          // const salesCount = await Sale.countDocuments({ 'items.product': id });
          // if (salesCount > 0) {
          //   return res.status(400).json({ 
          //     success: false, 
          //     message: 'Cannot delete product with existing sales' 
          //   });
          // }

          await Product.deleteOne({ _id: id });
          return res.status(200).json({ success: true, data: {} });
        } catch (error) {
          console.error('Error deleting product:', error);
          return res.status(400).json({ success: false, message: 'Error deleting product' });
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}