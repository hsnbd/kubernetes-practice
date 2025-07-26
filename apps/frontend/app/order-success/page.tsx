"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/Header/TopBar";
import Navigation from "@/components/Header/Navigation";
import Footer from "@/components/Footer/Footer";
import { 
  FaCheckCircle, 
  FaEnvelope, 
  FaTruck, 
  FaFileInvoice,
  FaArrowLeft
} from "react-icons/fa";
import { HERO_CONTENT } from "@/constants";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState(`ORD-${Date.now().toString().slice(-8)}`);

  // Clear cart when reaching success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Change order number periodically
  useEffect(() => {
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-8);
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD-${timestamp}${randomSuffix}`.slice(0, 12);
    };

    const interval = setInterval(() => {
      setOrderNumber(generateOrderNumber());
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate order details
  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
      <Navigation />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium font-mono">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">•••• •••• •••• 1234</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">{getEstimatedDelivery()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="font-medium">Standard Shipping</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="font-medium text-emerald-600">Will be provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-blue-600" size={14} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Order Confirmation</div>
                  <div className="text-gray-600">Check your email</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaFileInvoice className="text-blue-600" size={14} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Order Processing</div>
                  <div className="text-gray-600">1-2 business days</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-blue-600" size={14} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Shipped</div>
                  <div className="text-gray-600">Tracking provided</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                variant="outline"
                className="px-8 py-3 rounded-full font-semibold"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href={`/order-details/${orderNumber.replace('ORD-', '')}`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold">
                <FaEnvelope className="mr-2" />
                View Order Details
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-gray-100 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Link 
                href="/contact"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Contact Support
              </Link>
              <Link 
                href="/faq"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View FAQ
              </Link>
              <Link 
                href="/returns"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
