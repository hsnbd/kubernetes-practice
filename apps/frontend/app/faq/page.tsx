"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I track my order?",
    answer: "You can track your order by visiting the order details page using the link in your confirmation email, or by checking your order history if you have an account.",
    category: "Orders"
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all items in original condition. Items must be unworn, unwashed, and in original packaging with tags attached.",
    category: "Returns"
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Free shipping is available on orders over $50.",
    category: "Shipping"
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay.",
    category: "Payment"
  },
  {
    id: 5,
    question: "Can I change or cancel my order?",
    answer: "You can change or cancel your order within 1 hour of placing it. After that, orders are processed and cannot be modified. Please contact customer service for assistance.",
    category: "Orders"
  },
  {
    id: 6,
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the United States. International shipping may be available in the future.",
    category: "Shipping"
  },
  {
    id: 7,
    question: "How do I contact customer service?",
    answer: "You can reach our customer service team by phone at 1-800-123-4567, email at support@example.com, or through our contact form. We're available Mon-Fri 9AM-6PM EST.",
    category: "Support"
  },
  {
    id: 8,
    question: "What if I receive a damaged or defective item?",
    answer: "If you receive a damaged or defective item, please contact us immediately. We'll provide a prepaid return label and send a replacement or full refund.",
    category: "Returns"
  },
  {
    id: 9,
    question: "Do you offer price matching?",
    answer: "We don't currently offer price matching, but we regularly review our prices to ensure they're competitive. Sign up for our newsletter to be notified of sales and promotions.",
    category: "Pricing"
  },
  {
    id: 10,
    question: "How do I create an account?",
    answer: "You can create an account during checkout or by clicking the 'Sign Up' button in the top right corner of our website. An account helps you track orders and save shipping information.",
    category: "Account"
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

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
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Find answers to common questions about our products and services.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 mt-1">
                    {item.question}
                  </h3>
                </div>
                {openItems.includes(item.id) ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-4">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
