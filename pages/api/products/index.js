// pages/api/products/index.js
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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
        try {
          const products = await Product.find({ isActive: true })
            .sort({ name: 1 })
            .lean();
          return res.status(200).json({ success: true, data: products });
        } catch (error) {
          console.error('Error fetching products:', error);
          return res.status(400).json({ success: false, message: 'Error fetching products' });
        }

      case 'POST':
        try {
          // Validate required fields
          const { name, price } = req.body;
          
          if (!name || name.trim() === '') {
            return res.status(400).json({ 
              success: false, 
              message: 'Product name is required' 
            });
          }
          
          const productData = {
            ...req.body,
            price: parseFloat(price) || 0,
            stock: parseInt(req.body.stock, 10) || 0,
            isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
          };
          
          const product = await Product.create(productData);
          return res.status(201).json({ success: true, data: product });
        } catch (error) {
          console.error('Error creating product:', error);
          
          // Handle validation errors
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
              success: false, 
              message: 'Validation error',
              errors: messages 
            });
          }
          
          // Handle duplicate key errors
          if (error.code === 11000) {
            return res.status(400).json({ 
              success: false, 
              message: 'A product with this SKU or barcode already exists' 
            });
          }
          
          return res.status(400).json({ 
            success: false, 
            message: error.message || 'Error creating product' 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}