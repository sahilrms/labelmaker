// Next.js API route for tracking print events
// POST /api/track-print
// Body: { date, batchNumber, items: [{...itemInfo}] }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date, batchNumber, items } = req.body;
  if (!date || !batchNumber || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Store in print history
    const historyResponse = await fetch('http://localhost:3000/api/print-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        batchNumber,
        items,
        totalItems: items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0)
      }),
    });

    if (!historyResponse.ok) {
      throw new Error('Failed to save print history');
    }

    return res.status(200).json({ 
      message: 'Print tracked', 
      data: { date, batchNumber, items } 
    });
  } catch (error) {
    console.error('Error tracking print:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
