import { API_BASE_URL } from './apiConfig';

async function request(endpoint: string, options: any = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(id);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(error.message || response.statusText);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  }
}

export const apiService = {
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getRecentActivity: () => request('/dashboard/recent-activity'),
    getAnalytics: () => request('/dashboard/analytics'),
  },
  customers: {
    getAll: (search?: string) => request(`/customers${search ? `?search=${search}` : ''}`),
    getById: (id: string) => request(`/customers/${id}`),
    create: (data: any) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
    getByPhone: (phone: string) => request(`/customers/search-by-phone/${phone}`),
  },
  vehicles: {
    add: (customerId: string, data: any) => request(`/customers/${customerId}/vehicles`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  services: {
    getAll: (status?: string) => request(`/services${status ? `?status=${status}` : ''}`),
    getById: (id: string) => request(`/services/${id}`),
    create: (data: any) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => request(`/services/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getUpcoming: () => request('/services/upcoming'),
  },
  parts: {
    getAll: () => request('/parts'),
  }
};
