// utils/printTracking.js
export const trackPrint = async (batchNumber, items) => {
  try {
    const response = await fetch('/api/track-print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: new Date().toISOString(),
        batchNumber,
        items: items.map(item => ({
          name: item.name,
          netContent: item.netContent,
          mrp: item.mrp,
          quantity: item.quantity,
          packingDate: item.packingDate,
          expiryDate: item.expiryDate,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track print');
    }

    return true;
  } catch (error) {
    console.error('Error tracking print:', error);
    return false;
  }
};
