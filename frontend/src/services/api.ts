import type { JourneyPass, RouteOption, Location } from './mockData';
import { getRouteOptions, locations, journeyPasses } from './mockData';

const API_BASE_URL = 'http://localhost:8000';

// Simple helper to check if backend is reachable
async function request<T>(path: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.warn(`FastAPI backend unreachable for ${path}. Falling back to static mock data. Error:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const apiService = {
  // Get predefined locations
  getLocations: async (): Promise<Location[]> => {
    return request<Location[]>('/locations', {}, locations);
  },

  // Plan journey options between source and destination
  planJourney: async (source: string, destination: string, preference: string = 'balanced'): Promise<RouteOption[]> => {
    // Note: using source name/id as required by backend
    const fallback = getRouteOptions(source, destination);
    const response = await request<{ routes: RouteOption[] }>('/routes/search', {
      method: 'POST',
      body: JSON.stringify({ source, destination, preference })
    }, { routes: fallback });

    return response.routes;
  },

  // Create mock booking
  createBooking: async (routeId: string, userId: string = 'demo-user'): Promise<{
    bookingId: string;
    legs: any[];
    totalFare: number;
    status: string;
  }> => {
    const mockResponse = {
      bookingId: `RF-BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      legs: [],
      totalFare: 82,
      status: 'Pending Payment'
    };

    return request('/bookings/create', {
      method: 'POST',
      body: JSON.stringify({ routeId, userId })
    }, mockResponse);
  },

  // Confirm payment & start simulation
  confirmPayment: async (bookingId: string, paymentMethod: string = 'Mock NCMC Wallet'): Promise<{
    paymentStatus: 'Success' | 'Failed';
    journeyPassId: string;
    qrCodeText: string;
    walletBalance: number;
  }> => {
    const mockResponse = {
      paymentStatus: 'Success' as const,
      journeyPassId: `RF-PASS-MOCK`,
      qrCodeText: `RF-PASS-MOCK`,
      walletBalance: 418
    };

    return request('/payments/pay', {
      method: 'POST',
      body: JSON.stringify({ bookingId, paymentMethod })
    }, mockResponse);
  },

  // Fetch transit passes
  getJourneyPasses: async (): Promise<JourneyPass[]> => {
    return request<JourneyPass[]>('/passes', {}, journeyPasses);
  },

  // Get route explanation
  getRouteExplanation: async (routeId: string): Promise<{
    routeId: string;
    explanation: string;
  }> => {
    return request(`/routes/${routeId}/explanation`, {}, {
      routeId,
      explanation: "This route is recommended based on your preference."
    });
  },

  // Get simulated live updates
  getLiveUpdates: async (bookingId: string): Promise<{
    bookingId: string;
    updates: string[];
  }> => {
    return request(`/journey/${bookingId}/updates`, {}, {
      bookingId,
      updates: ["Welcome to your journey!"]
    });
  }
};
