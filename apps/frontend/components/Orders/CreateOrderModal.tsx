"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { CreateOrderRequest, Address, OrderItem } from '@/lib/api/orders';

// Default state constants to prevent recreation on every render
const defaultOrderItem: OrderItem = {
  productId: '',
  productName: '',
  productSku: '',
  quantity: 1,
  unitPrice: 0
};

const defaultAddress: Address = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US'
};

const getDefaultOrderData = (): CreateOrderRequest => ({
  userId: 'temp-user-id',
  items: [{ ...defaultOrderItem }],
  shippingAddress: { ...defaultAddress },
  billingAddress: { ...defaultAddress },
  shippingAmount: 0,
  taxAmount: 0,
  discountAmount: 0,
  currency: 'USD',
  paymentMethod: 'credit_card'
});

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: CreateOrderRequest) => Promise<void>;
  isLoading: boolean;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [orderData, setOrderData] = useState<CreateOrderRequest>(getDefaultOrderData);

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate items
    if (orderData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      orderData.items.forEach((item, index) => {
        if (!item.productName.trim()) {
          newErrors[`item_${index}_name`] = 'Product name is required';
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
        }
        if (item.unitPrice <= 0) {
          newErrors[`item_${index}_price`] = 'Unit price must be greater than 0';
        }
      });
    }

    // Validate shipping address
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
      if (!orderData.shippingAddress[field as keyof Address]?.toString().trim()) {
        newErrors[`shipping_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (orderData.shippingAddress.email && !emailRegex.test(orderData.shippingAddress.email)) {
      newErrors.shipping_email = 'Please enter a valid email address';
    }

    // Validate billing address if different
    if (!useSameAddress) {
      requiredFields.forEach(field => {
        if (!orderData.billingAddress[field as keyof Address]?.toString().trim()) {
          newErrors[`billing_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      });

      if (orderData.billingAddress.email && !emailRegex.test(orderData.billingAddress.email)) {
        newErrors.billing_email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [orderData, useSameAddress]);

  // Memoize order totals calculation to prevent recalculation on every render
  const orderTotals = useMemo(() => {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const shipping = orderData.shippingAmount || 0;
    const tax = orderData.taxAmount || 0;
    const discount = orderData.discountAmount || 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
  }, [orderData.items, orderData.shippingAmount, orderData.taxAmount, orderData.discountAmount]);

  const addItem = useCallback(() => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { ...defaultOrderItem }]
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    if (orderData.items.length > 1) {
      setOrderData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  }, [orderData.items.length]);

  const updateItem = useCallback((index: number, field: keyof OrderItem, value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const updateAddress = useCallback((type: 'shipping' | 'billing', field: keyof Address, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address` as keyof CreateOrderRequest] as Address,
        [field]: value
      }
    }));
  }, []);

  const handleUseSameAddressChange = useCallback((checked: boolean) => {
    setUseSameAddress(checked);
    if (checked) {
      setOrderData(prev => ({
        ...prev,
        billingAddress: { ...prev.shippingAddress }
      }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setOrderData(getDefaultOrderData());
    setErrors({});
    setUseSameAddress(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const finalOrderData = {
      ...orderData,
      billingAddress: useSameAddress ? orderData.shippingAddress : orderData.billingAddress
    };

    try {
      await onSubmit(finalOrderData);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }, [orderData, useSameAddress, validateForm, onSubmit, onClose, resetForm]);

  // Memoized handlers for form inputs to prevent recreating functions
  const handleShippingAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData(prev => ({ ...prev, shippingAmount: parseFloat(e.target.value) || 0 }));
  }, []);

  const handleTaxAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData(prev => ({ ...prev, taxAmount: parseFloat(e.target.value) || 0 }));
  }, []);

  const handleDiscountAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }));
  }, []);

  const handlePaymentMethodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Order Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {orderData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Product name"
                      />
                      {errors[`item_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={item.productSku}
                        onChange={(e) => updateItem(index, 'productSku', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Product SKU"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                      {errors[`item_${index}_price`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_price`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Total: ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.firstName}
                  onChange={(e) => updateAddress('shipping', 'firstName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.lastName}
                  onChange={(e) => updateAddress('shipping', 'lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={orderData.shippingAddress.email}
                  onChange={(e) => updateAddress('shipping', 'email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_email && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={orderData.shippingAddress.phone}
                  onChange={(e) => updateAddress('shipping', 'phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.address}
                  onChange={(e) => updateAddress('shipping', 'address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_address && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.city}
                  onChange={(e) => updateAddress('shipping', 'city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_city && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.state}
                  onChange={(e) => updateAddress('shipping', 'state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_state && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={orderData.shippingAddress.zipCode}
                  onChange={(e) => updateAddress('shipping', 'zipCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.shipping_zipCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.shipping_zipCode}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  value={orderData.shippingAddress.country}
                  onChange={(e) => updateAddress('shipping', 'country', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useSameAddress}
                  onChange={(e) => handleUseSameAddressChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Same as shipping address</span>
              </label>
            </div>
            
            {!useSameAddress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Similar fields as shipping address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.firstName}
                    onChange={(e) => updateAddress('billing', 'firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.lastName}
                    onChange={(e) => updateAddress('billing', 'lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_lastName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={orderData.billingAddress.email}
                    onChange={(e) => updateAddress('billing', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_email && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={orderData.billingAddress.phone}
                    onChange={(e) => updateAddress('billing', 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.address}
                    onChange={(e) => updateAddress('billing', 'address', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_address && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_address}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.city}
                    onChange={(e) => updateAddress('billing', 'city', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_city && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.state}
                    onChange={(e) => updateAddress('billing', 'state', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_state && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_state}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={orderData.billingAddress.zipCode}
                    onChange={(e) => updateAddress('billing', 'zipCode', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billing_zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_zipCode}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    value={orderData.billingAddress.country}
                    onChange={(e) => updateAddress('billing', 'country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Order Totals */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Amount
                </label>
                <input
                  type="number"
                  value={orderData.shippingAmount || 0}
                  onChange={handleShippingAmountChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Amount
                </label>
                <input
                  type="number"
                  value={orderData.taxAmount || 0}
                  onChange={handleTaxAmountChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Amount
                </label>
                <input
                  type="number"
                  value={orderData.discountAmount || 0}
                  onChange={handleDiscountAmountChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={orderData.paymentMethod || 'credit_card'}
                  onChange={handlePaymentMethodChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-right space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${orderTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${orderTotals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${orderTotals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${orderTotals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${orderTotals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(CreateOrderModal);
