"use client";

import React, { useState } from 'react';
import { useOrders, useOrderActions } from '@/hooks/useOrders';
import { Order, CreateOrderRequest } from '@/lib/api/orders';
import OrderCard from './OrderCard';
import OrderFilters, { OrderFilters as OrderFiltersType } from './OrderFilters';
import CreateOrderModal from './CreateOrderModal';

interface OrdersListProps {
  userId?: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ userId }) => {
  const [apiFilters, setApiFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    userId,
  });
  const [uiFilters, setUIFilters] = useState<OrderFiltersType>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { orders, isLoading, error, refetch } = useOrders(apiFilters);
  const { createOrder, isLoading: isCreating } = useOrderActions();

  const handleUIFilterChange = (newFilters: OrderFiltersType) => {
    setUIFilters(newFilters);
    // Convert UI filters to API filters
    setApiFilters(prev => ({
      ...prev,
      status: newFilters.status || '',
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setApiFilters(prev => ({ ...prev, page }));
  };

  const resetFilters = () => {
    setUIFilters({});
    setApiFilters({
      page: 1,
      limit: 10,
      status: '',
      userId,
    });
  };

  const handleCreateOrder = async (orderData: CreateOrderRequest) => {
    const result = await createOrder(orderData);
    if (result) {
      setShowCreateModal(false);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your orders
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create New Order
        </button>
      </div>

      {/* Filters */}
      <OrderFilters
        filters={uiFilters}
        onFiltersChange={handleUIFilterChange}
        onReset={resetFilters}
      />

      {/* Orders List */}
      <div className="space-y-6">
        {orders?.orders?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600 mb-6">
              {uiFilters.status ? 
                `No orders found with status "${uiFilters.status}"` : 
                "You haven't placed any orders yet"
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Order
            </button>
          </div>
        ) : (
          <>
            {orders?.orders?.map((order: Order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={refetch}
              />
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {orders && orders.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => handlePageChange(apiFilters.page - 1)}
            disabled={apiFilters.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {apiFilters.page} of {orders.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(apiFilters.page + 1)}
            disabled={apiFilters.page === orders.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
          isLoading={isCreating}
        />
      )}
    </div>
  );
};

export default OrdersList;
