"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToastContext } from "@/contexts/ToastContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TopBar from "@/components/Header/TopBar";
import Navigation from "@/components/Header/Navigation";
import Footer from "@/components/Footer/Footer";
import OrderSummary from "@/components/Checkout/OrderSummary";
import ShippingStep from "@/components/Checkout/ShippingStep";
import PaymentStep from "@/components/Checkout/PaymentStep";
import { 
  FaCheck
} from "react-icons/fa";
import { HERO_CONTENT } from "@/constants";

interface CheckoutFormData {
  // Contact Information
  email: string;
  
  // Shipping Address
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  
  // Billing Address
  sameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingApartment: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  
  // Payment Information
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  
  // Additional Options
  saveInfo: boolean;
  newsletter: boolean;
}

export default function CheckoutPage() {
  const { state, removeFromCart, updateQuantity } = useCart();
  const { success, error } = useToastContext();
  
  const [step, setStep] = useState<'information' | 'shipping' | 'payment'>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveInfo: false,
    newsletter: false
  });

  // Calculate totals
  const subtotal = state.totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (currentStep: string): boolean => {
    switch (currentStep) {
      case 'information':
        return !!(formData.email && formData.firstName && formData.lastName && 
                 formData.address && formData.city && formData.state && formData.zipCode);
      case 'shipping':
        return true; // Shipping validation if needed
      case 'payment':
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      error('Please fill in all required fields');
      return;
    }

    if (step === 'information') {
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    }
  };

  const handleBack = () => {
    if (step === 'shipping') {
      setStep('information');
    } else if (step === 'payment') {
      setStep('shipping');
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateStep('payment')) {
      error('Please fill in all payment information');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('Order placed successfully! Check your email for confirmation.');
      
      // Redirect to success page or clear cart
      setTimeout(() => {
        window.location.href = '/order-success';
      }, 1500);
      
    } catch {
      error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
        <Navigation />
        
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products to proceed to checkout
            </p>
            <Link 
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb 
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order in just a few steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[
                { key: 'information', label: 'Information', icon: '1' },
                { key: 'shipping', label: 'Shipping', icon: '2' },
                { key: 'payment', label: 'Payment', icon: '3' }
              ].map((stepItem, index) => (
                <div key={stepItem.key} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                    ${step === stepItem.key 
                      ? 'bg-emerald-600 text-white' 
                      : index < (['information', 'shipping', 'payment'].indexOf(step)) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {index < (['information', 'shipping', 'payment'].indexOf(step)) ? 
                      <FaCheck size={12} /> : stepItem.icon
                    }
                  </div>
                  <span className="ml-2 font-medium text-gray-700">{stepItem.label}</span>
                  {index < 2 && (
                    <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'information' && (
                <InformationStep 
                  formData={formData} 
                  onChange={handleInputChange}
                  onNext={handleNext}
                />
              )}
              
              {step === 'shipping' && (
                <ShippingStep 
                  formData={formData} 
                  onChange={handleInputChange}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {step === 'payment' && (
                <PaymentStep 
                  formData={formData} 
                  onChange={handleInputChange}
                  onBack={handleBack}
                  onSubmit={handleSubmitOrder}
                  isProcessing={isProcessing}
                />
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary 
                items={state.items}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                removeItem={removeFromCart}
                updateQuantity={updateQuantity}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Information Step Component
function InformationStep({ 
  formData, 
  onChange, 
  onNext 
}: { 
  formData: CheckoutFormData; 
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contact & Shipping Information</h2>
      
      <div className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => onChange('apartment', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                {/* Add more states as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => onChange('zipCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.saveInfo}
              onChange={(e) => onChange('saveInfo', e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Save this information for next time
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => onChange('newsletter', e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Subscribe to our newsletter for exclusive offers
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <Button 
            onClick={onNext}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold text-lg"
          >
            Continue to Shipping
          </Button>
        </div>
      </div>
    </div>
  );
}

// Additional step components would go here...
// I'll create them in separate files for better organization
