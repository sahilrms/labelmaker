import dbConnect from '../../lib/mongodb';
import Label from '../../models/Label';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const labels = await Label.find({}).sort({ printDate: -1 });
        res.status(200).json({ success: true, data: labels });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const label = await Label.create(req.body);
        res.status(201).json({ success: true, data: label });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
