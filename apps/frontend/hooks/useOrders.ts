import { useState, useEffect, useCallback } from 'react';
import { ordersAPI, Order, OrdersListResponse, CreateOrderRequest, UpdateOrderStatusRequest, TrackingInfo } from '@/lib/api/orders';

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}) => {
  const [orders, setOrders] = useState<OrdersListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ordersAPI.getAllOrders(params);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
};

export const useOrder = (orderId?: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ordersAPI.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  return {
    order,
    isLoading,
    error,
    refetch: () => orderId && fetchOrder(orderId),
  };
};

export const useOrderActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const order = await ordersAPI.createOrder(orderData);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, statusData: UpdateOrderStatusRequest): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const order = await ordersAPI.updateOrderStatus(orderId, statusData);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processRefund = async (orderId: string, refundData: { reason: string; amount?: number }): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const order = await ordersAPI.processRefund(orderId, refundData);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const order = await ordersAPI.cancelOrder(orderId, reason);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (orderId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const blob = await ordersAPI.downloadInvoice(orderId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    updateOrderStatus,
    processRefund,
    cancelOrder,
    downloadInvoice,
    isLoading,
    error,
  };
};

export const useTracking = (orderId?: string) => {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingInfo = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ordersAPI.getTrackingInfo(id);
      setTrackingInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracking info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchTrackingInfo(orderId);
    }
  }, [orderId]);

  return {
    trackingInfo,
    isLoading,
    error,
    refetch: () => orderId && fetchTrackingInfo(orderId),
  };
};
