// API Configuration for microservices
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://kube.ecom.local',
  
  services: {
    user: '/services/users',
    order: '/services/orders',
    product: '/services/products',
    notification: '/services/notifications',
    analytics: '/services/analytics',
  },
  
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
    user: {
      profile: '/api/v1/me',
    },
  }
} as const;

// Helper function to build service URLs
export function buildServiceUrl(service: keyof typeof API_CONFIG.services, endpoint: string): string {
  return `${API_CONFIG.baseUrl}${API_CONFIG.services[service]}${endpoint}`;
}

// Helper function for API requests to microservices
export async function serviceRequest(
  service: keyof typeof API_CONFIG.services,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = buildServiceUrl(service, endpoint);
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
}
