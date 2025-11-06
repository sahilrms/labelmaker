// utils/api.js
export async function createDailySale(saleData) {
  const response = await fetch('/api/sales/daily', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create sale');
  }

  return response.json();
}

export async function getDailySales({ startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetch(`/api/sales/daily?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch sales');
  }

  return response.json();
}

export async function createIndividualSale(saleData) {
  const response = await fetch('/api/sales/individual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create individual sale');
  }

  return response.json();
}

export async function getIndividualSales({ startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetch(`/api/sales/individual?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch individual sales');
  }

  return response.json();
}