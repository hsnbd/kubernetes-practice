import { API_CONFIG } from '../config';

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  attributes?: Record<string, string | number | boolean>;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  discountAmount: string;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: string;
  paymentReference?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  notes?: string;
  changedBy?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  userId: string;
  items: Omit<OrderItem, 'id' | 'totalPrice'>[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  notes?: string;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface TrackingInfo {
  trackingNumber?: string;
  trackingUrl?: string;
  status: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
}

class OrdersAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_CONFIG.ORDER_SERVICE_URL}/api/orders`;
  }

  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }): Promise<OrdersListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    const response = await fetch(`${this.baseUrl}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const result: ApiResponse<OrdersListResponse> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const result: ApiResponse<Order> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const result: ApiResponse<Order> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async updateOrderStatus(orderId: string, statusData: UpdateOrderStatusRequest): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }

    const result: ApiResponse<Order> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async getTrackingInfo(orderId: string): Promise<TrackingInfo> {
    const response = await fetch(`${this.baseUrl}/${orderId}/tracking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tracking info: ${response.statusText}`);
    }

    const result: ApiResponse<TrackingInfo> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async downloadInvoice(orderId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${orderId}/invoice`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to download invoice: ${response.statusText}`);
    }

    return response.blob();
  }

  async processRefund(orderId: string, refundData: { reason: string; amount?: number }): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${orderId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refundData),
    });

    if (!response.ok) {
      throw new Error(`Failed to process refund: ${response.statusText}`);
    }

    const result: ApiResponse<Order> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const queryParams = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    
    const response = await fetch(`${this.baseUrl}/${orderId}${queryParams}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`);
    }

    const result: ApiResponse<Order> = await response.json();
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    return result.data;
  }
}

export const ordersAPI = new OrdersAPI();
