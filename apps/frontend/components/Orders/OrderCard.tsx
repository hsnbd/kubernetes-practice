"use client";

import React, { useState } from 'react';
import { Order } from '@/lib/api/orders';
import { useOrderActions, useTracking } from '@/hooks/useOrders';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActionsMenu from './OrderActionsMenu';

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateOrderStatus, cancelOrder, processRefund, downloadInvoice, isLoading } = useOrderActions();
  const { trackingInfo } = useTracking(order.id);

  const handleStatusUpdate = async (status: Order['status'], notes?: string) => {
    const result = await updateOrderStatus(order.id, { status, notes });
    if (result && onStatusUpdate) {
      onStatusUpdate();
    }
  };

  const handleCancel = async (reason?: string) => {
    const result = await cancelOrder(order.id, reason);
    if (result && onStatusUpdate) {
      onStatusUpdate();
    }
  };

  const handleRefund = async (reason: string, amount?: number) => {
    const result = await processRefund(order.id, { reason, amount });
    if (result && onStatusUpdate) {
      onStatusUpdate();
    }
  };

  const handleDownloadInvoice = async () => {
    await downloadInvoice(order.id);
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.id.slice(-8)}
              </h3>
              <OrderStatusBadge status={order.status} />
              <div className="text-sm text-gray-500">
                Payment: {order.paymentStatus}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Created: {formatDate(order.createdAt)}</span>
              <span>Total: {formatCurrency(order.totalAmount)}</span>
              <span>Items: {order.items.length}</span>
              {order.trackingNumber && (
                <span>Tracking: {order.trackingNumber}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <OrderActionsMenu
              order={order}
              onStatusUpdate={handleStatusUpdate}
              onCancel={handleCancel}
              onRefund={handleRefund}
              onDownloadInvoice={handleDownloadInvoice}
              isLoading={isLoading}
            />
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    {item.productSku && (
                      <div className="text-sm text-gray-500">SKU: {item.productSku}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatCurrency(item.unitPrice.toString())}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.totalPrice?.toString() || (item.quantity * item.unitPrice).toString())}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                <div>{order.shippingAddress.address}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                <div>{order.shippingAddress.country}</div>
                <div>{order.shippingAddress.email}</div>
                {order.shippingAddress.phone && <div>{order.shippingAddress.phone}</div>}
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Billing Address</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{order.billingAddress.firstName} {order.billingAddress.lastName}</div>
                <div>{order.billingAddress.address}</div>
                <div>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</div>
                <div>{order.billingAddress.country}</div>
                <div>{order.billingAddress.email}</div>
                {order.billingAddress.phone && <div>{order.billingAddress.phone}</div>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-900">{formatCurrency(order.shippingAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
            </div>
            {parseFloat(order.discountAmount) > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Discount:</span>
                <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Status History</h4>
              <div className="space-y-2">
                {order.statusHistory.map((history) => (
                  <div key={history.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-gray-900 capitalize">{history.status}</span>
                      {history.notes && (
                        <span className="text-gray-600 ml-2">- {history.notes}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(history.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Information */}
          {trackingInfo && trackingInfo.trackingNumber && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tracking Information</h4>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <div>Tracking Number: <span className="font-medium">{trackingInfo.trackingNumber}</span></div>
                  {trackingInfo.trackingUrl && (
                    <div className="mt-1">
                      <a 
                        href={trackingInfo.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Track Package
                      </a>
                    </div>
                  )}
                  {trackingInfo.estimatedDelivery && (
                    <div className="mt-1">
                      Estimated Delivery: {formatDate(trackingInfo.estimatedDelivery)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
