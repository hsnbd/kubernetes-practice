"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { 
  FaArrowLeft, 
  FaCheck, 
  FaTruck, 
  FaBox, 
  FaMapMarkerAlt,
  FaCreditCard,
  FaDownload,
  FaPrint,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

interface Order {
  id: string;
  number: string;
  status: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
  estimatedDelivery: string;
  trackingNumber?: string;
}

// Move helper functions outside component to prevent recreation on every render
const getStatusColor = (status: string) => {
  switch (status) {
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "shipped":
      return <FaTruck className="text-blue-600" />;
    case "delivered":
      return <FaCheck className="text-green-600" />;
    case "processing":
      return <FaBox className="text-yellow-600" />;
    default:
      return <FaBox className="text-gray-600" />;
  }
};

function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrder = async () => {
      setLoading(true);
      
      // Generate consistent data based on the order ID to prevent rerenders
      const orderId = params.id as string;
      const seedNumber = orderId ? parseInt(orderId.slice(-4), 10) || 1234 : 1234;
      
      // Use seeded random for consistent data
      const isShipped = seedNumber % 2 === 0;
      const baseDate = new Date('2024-01-15'); // Fixed base date
      
      // Mock order data with consistent values
      const mockOrder: Order = {
        id: orderId,
        number: `ORD-${orderId.padStart(8, '0')}`,
        status: isShipped ? "shipped" : "processing",
        date: baseDate.toISOString(),
        items: [
          {
            id: 1,
            name: "Premium Wireless Headphones",
            image: "/api/placeholder/80/80",
            price: 199.99,
            quantity: 1
          },
          {
            id: 2,
            name: "Bluetooth Speaker",
            image: "/api/placeholder/80/80",
            price: 89.99,
            quantity: 2
          },
          {
            id: 3,
            name: "USB-C Cable",
            image: "/api/placeholder/80/80",
            price: 19.99,
            quantity: 1
          }
        ],
        subtotal: 399.97,
        shipping: 15.99,
        tax: 35.99,
        total: 451.95,
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street, Apt 4B",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "United States"
        },
        paymentMethod: {
          type: "Visa",
          last4: "4242"
        },
        estimatedDelivery: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        trackingNumber: isShipped ? `1Z999AA${seedNumber.toString().padStart(9, '0')}` : undefined
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrder(mockOrder);
      setLoading(false);
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">
                Order {order.number} • Placed on {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaDownload />
                Download Invoice
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaPrint />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium text-gray-900">
                    {order.status === "shipped" ? "Your order is on the way!" : 
                     order.status === "delivered" ? "Your order has been delivered!" :
                     order.status === "processing" ? "Your order is being processed" :
                     "Order status updated"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated delivery: {order.estimatedDelivery}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-emerald-600 font-medium">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" />
                Shipping Address
              </h2>
              
              <div className="text-gray-700">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-emerald-600" />
                Payment Method
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  {order.paymentMethod.type.toUpperCase()}
                </div>
                <span className="text-gray-700">
                  •••• •••• •••• {order.paymentMethod.last4}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-emerald-600" />
                  <div>
                    <p className="font-medium">Call us</p>
                    <p className="text-sm">1-800-123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-emerald-600" />
                  <div>
                    <p className="font-medium">Email us</p>
                    <p className="text-sm">support@example.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-center block"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary rerenders
export default React.memo(OrderDetailsPage);
