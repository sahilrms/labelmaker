import dbConnect from '../../lib/dbConnect';
import Label from '../../models/Label';

// Helper function to handle errors consistently
const handleError = (res, statusCode, message, error = null) => {
  console.error(`[${new Date().toISOString()}] Error:`, message, error?.stack || '');
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || message,
    ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
  });
};

export default async function handler(req, res) {
  const { method } = req;

  // Log the incoming request
  console.log(`[${new Date().toISOString()}] ${method} ${req.url}`);

  try {
    // Connect to MongoDB using Mongoose
    await dbConnect();
    console.log('Successfully connected to MongoDB via Mongoose');

    switch (method) {
      case 'GET':
        try {
          console.log('Fetching labels...');
          // Using Mongoose model to find and sort documents
          const labels = await Label.find({}).sort({ printDate: -1 }).lean();
          console.log(`Found ${labels.length} labels`);
          return res.status(200).json(labels);
        } catch (error) {
          console.error('Error fetching labels:', error);
          return handleError(res, 500, 'Failed to fetch labels', error);
        }

      case 'POST':
        try {
          console.log('Creating new label with data:', req.body);
          const label = await Label.create(req.body);
          console.log('Label created successfully:', label._id);
          return res.status(201).json(label);
        } catch (error) {
          console.error('Error creating label:', error);
          return handleError(res, 400, 'Failed to create label', error);
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          message: `Method ${method} Not Allowed`,
          allowedMethods: ['GET', 'POST']
        });
    }
  } catch (error) {
    console.error('Unexpected error in API handler:', error);
    return handleError(res, 500, 'Internal Server Error', error);
  }
}