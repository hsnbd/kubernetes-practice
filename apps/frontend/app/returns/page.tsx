"use client";

import Link from "next/link";
import { 
  FaArrowLeft, 
  FaUndo, 
  FaCheck, 
  FaExclamationTriangle,
  FaShippingFast,
  FaClock,
  FaEnvelope
} from "react-icons/fa";

export default function ReturnsPage() {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Returns & Refunds
          </h1>
          <p className="text-gray-600">
            Easy returns within 30 days. We want you to be completely satisfied with your purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Return Policy */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUndo className="text-emerald-600" />
                Return Policy
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">30-Day Return Window</h3>
                    <p className="text-gray-600">Returns are accepted within 30 days of purchase date.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Original Condition</h3>
                    <p className="text-gray-600">Items must be unworn, unwashed, and in original condition with all tags attached.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Original Packaging</h3>
                    <p className="text-gray-600">Items should be returned in original packaging when possible.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Free Return Shipping</h3>
                    <p className="text-gray-600">We provide prepaid return labels for all eligible returns.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Return */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Return an Item</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Us</h3>
                    <p className="text-gray-600">Email us at returns@example.com or call 1-800-123-4567 to initiate your return.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Receive Return Label</h3>
                    <p className="text-gray-600">We&apos;ll email you a prepaid return shipping label within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Package & Ship</h3>
                    <p className="text-gray-600">Package your item securely, attach the return label, and drop it off at any authorized shipping location.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Receive Refund</h3>
                    <p className="text-gray-600">Once we receive and process your return, your refund will be issued within 3-5 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" />
                Non-Returnable Items
              </h2>
              
              <div className="space-y-2">
                <p className="text-gray-600">• Personalized or customized items</p>
                <p className="text-gray-600">• Intimate apparel and swimwear</p>
                <p className="text-gray-600">• Items damaged by misuse or normal wear</p>
                <p className="text-gray-600">• Items returned after 30 days</p>
                <p className="text-gray-600">• Items without original tags or packaging</p>
              </div>
            </div>

            {/* Exchanges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exchanges</h2>
              
              <p className="text-gray-600 mb-4">
                We don&apos;t offer direct exchanges. To exchange an item for a different size or color, 
                please return the original item for a refund and place a new order for the desired item.
              </p>
              
              <p className="text-gray-600">
                This ensures the fastest processing time and guarantees availability of your desired item.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-center block font-medium"
                >
                  Start a Return
                </Link>
                
                <Link
                  href="/"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block font-medium"
                >
                  Back to Shopping
                </Link>
              </div>
            </div>

            {/* Processing Times */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-emerald-600" />
                Processing Times
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaShippingFast className="text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Return Shipping</p>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaCheck className="text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">1-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaUndo className="text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Refund</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-emerald-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm">returns@example.com</p>
                  </div>
                </div>
                
                <Link
                  href="/faq"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  View FAQ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
