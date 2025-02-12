const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

interface ApiError extends Error {
  status?: number;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    const error: ApiError = new Error(errorData.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
};

export const OrganizationService = {
  create: async (data: { name: string; description: string; userId: any }) => {
    const response = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Organization>(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE}/organizations`);
    return handleResponse<Organization[]>(response);
  },

  get: async (id: number) => {
    const response = await fetch(`${API_BASE}/organizations/${id}`);
    return handleResponse<Organization>(response);
  },

  getByUserId: async (userId: any) => {
    const response = await fetch(`${API_BASE}/organizations?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    return response.json();
  },
};

export const ReviewService = {
  create: async (data: { rating: number; reviewText: string; organizationId: number; userId: any }) => {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Review>(response);
  },

  getByOrganization: async (organizationId: number) => {
    const response = await fetch(`${API_BASE}/reviews?organizationId=${organizationId}`);
    return handleResponse<Review[]>(response);
  },

  update: async (id: number, data: { rating: number; reviewText: string; userId: number }) => {
    const response = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Review>(response);
  },

  delete: async (id: number, userId: any) => {
    const response = await fetch(`${API_BASE}/reviews/${id}/${userId}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export interface Organization {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  rating: number;
  reviewText?: string;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  userId: any;
}
