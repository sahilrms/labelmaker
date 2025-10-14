export const trackPrint = async (batchNumber, items) => {
  try {
    const savePromises = items.map(async (item) => {
      const response = await fetch('/api/print-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: item.name,
          batchNumber: item.batchNumber || batchNumber,
          packingDate: item.packingDate || new Date().toISOString().split('T')[0],
          expiryDate: item.expiryDate,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.mrp || item.price || 0),
          netContent: item.netContent || '',
          barcode: item.barcode || `${batchNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save print record');
      }

      return response.json();
    });

    await Promise.all(savePromises);
    return true;
  } catch (error) {
    console.error('Error tracking print:', error);
    throw error;
  }
};