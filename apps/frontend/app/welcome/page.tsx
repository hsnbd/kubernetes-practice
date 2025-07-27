"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaShoppingBag, FaUser, FaEnvelope } from "react-icons/fa";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
            <FaCheckCircle className="h-10 w-10 text-emerald-600" />
          </div>

          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ShopHub!
          </h2>
          
          {user && (
            <p className="text-xl text-gray-700 mb-4">
              Hi {user.firstName}, your account has been created successfully!
            </p>
          )}

          <p className="text-gray-600 mb-8">
            Thank you for joining our community. You&apos;re now ready to explore our amazing products and enjoy a seamless shopping experience.
          </p>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUser className="mr-2 text-emerald-600" />
              Your Account Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <span className="font-medium w-20">Name:</span>
                <span>{user.firstName} {user.lastName}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span className="font-medium w-16">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to do next?
          </h3>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
            >
              <FaShoppingBag className="mr-2" />
              Start Shopping
            </Link>
            
            <Link
              href="/profile"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
            >
              <FaUser className="mr-2" />
              Complete Your Profile
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-emerald-800 mb-2">
            📧 Check Your Email
          </h4>
          <p className="text-emerald-700 text-sm">
            We&apos;ve sent a welcome email to your inbox with important account information and exclusive offers.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Member Benefits
          </h3>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <FaCheckCircle className="mr-2 text-emerald-500 text-sm" />
              <span className="text-sm">Free shipping on orders over $50</span>
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="mr-2 text-emerald-500 text-sm" />
              <span className="text-sm">Early access to sales and new products</span>
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="mr-2 text-emerald-500 text-sm" />
              <span className="text-sm">Exclusive member-only discounts</span>
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="mr-2 text-emerald-500 text-sm" />
              <span className="text-sm">Easy order tracking and history</span>
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="mr-2 text-emerald-500 text-sm" />
              <span className="text-sm">24/7 customer support</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Need help? Visit our{' '}
            <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contact Page
            </Link>{' '}
            or check out our{' '}
            <Link href="/faq" className="text-emerald-600 hover:text-emerald-700 font-medium">
              FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
