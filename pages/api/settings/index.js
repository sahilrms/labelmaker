import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Settings from '../../../models/Settings';

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
          const settings = await Settings.getSettings();
          return res.status(200).json({ success: true, data: settings });
        } catch (error) {
          console.error('Error fetching settings:', error);
          return res.status(400).json({ success: false, message: 'Error fetching settings' });
        }

      case 'PUT':
        try {
          const settings = await Settings.getSettings();
          
          // Only update allowed fields
          const updates = {
            currency: {
              code: req.body.currency?.code || settings.currency.code,
              symbol: req.body.currency?.symbol || settings.currency.symbol,
              name: req.body.currency?.name || settings.currency.name,
              decimalDigits: req.body.currency?.decimalDigits ?? settings.currency.decimalDigits
            },
            updatedBy: session.user.id
          };

          const updatedSettings = await Settings.findByIdAndUpdate(
            settings._id,
            { $set: updates },
            { new: true, runValidators: true }
          );

          return res.status(200).json({ success: true, data: updatedSettings });
        } catch (error) {
          console.error('Error updating settings:', error);
          return res.status(400).json({ 
            success: false, 
            message: error.message || 'Error updating settings' 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ 
          success: false, 
          message: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}
