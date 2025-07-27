import { serviceRequest, API_CONFIG } from './api-config';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  subscribeNewsletter?: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await serviceRequest('user', API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await serviceRequest('user', API_CONFIG.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }

  async getProfile(token: string): Promise<{ user: User }> {
    const response = await serviceRequest('user', API_CONFIG.endpoints.user.profile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }

    return data;
  }

  // Helper methods for token management
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  storeAuth(user: User, token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export type { User, AuthResponse, LoginCredentials, RegisterData };
