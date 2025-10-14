// pages/api/print-history.js
let printHistory = []; // In-memory storage - replace with a database in production

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(printHistory);
  } else if (req.method === 'POST') {
    const printRecord = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString()
    };
    printHistory.unshift(printRecord); // Add to beginning of array
    return res.status(201).json(printRecord);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
