import { Button } from "@/components/ui/button";
import { FaCreditCard, FaLock, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  sameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingApartment: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  saveInfo: boolean;
  newsletter: boolean;
}

interface PaymentStepProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function PaymentStep({ 
  formData, 
  onChange, 
  onBack, 
  onSubmit, 
  isProcessing 
}: PaymentStepProps) {
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    onChange('cardNumber', formatted);
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    onChange('expiryDate', formatted);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
      
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <FaShieldAlt />
          <span className="font-medium">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-600">
          Your payment information is encrypted and secure. We never store your credit card details.
        </p>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="credit-card"
              className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              defaultChecked
            />
            <FaCreditCard className="text-gray-600" />
            <span className="font-medium">Credit / Debit Card</span>
          </label>
        </div>
      </div>

      {/* Card Information */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
            <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleExpiryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="123"
                maxLength={4}
                required
              />
              <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={formData.cardName}
            onChange={(e) => onChange('cardName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      {/* Billing Address Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Billing Address:</h3>
        <div className="text-sm text-gray-700">
          {formData.sameAsShipping ? (
            <>
              <p>{formData.firstName} {formData.lastName}</p>
              <p>{formData.address}</p>
              {formData.apartment && <p>{formData.apartment}</p>}
              <p>{formData.city}, {formData.state} {formData.zipCode}</p>
            </>
          ) : (
            <>
              <p>{formData.billingFirstName} {formData.billingLastName}</p>
              <p>{formData.billingAddress}</p>
              {formData.billingApartment && <p>{formData.billingApartment}</p>}
              <p>{formData.billingCity}, {formData.billingState} {formData.billingZipCode}</p>
            </>
          )}
        </div>
        <button 
          onClick={onBack}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2"
        >
          Change billing address
        </button>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5"
            required
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex-1 py-4 rounded-lg font-semibold text-lg"
          disabled={isProcessing}
        >
          Back to Shipping
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isProcessing}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <>
              <FaLock className="mr-2" />
              Complete Order
            </>
          )}
        </Button>
      </div>

      {/* Security Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <FaShieldAlt />
          <span>SSL Secure</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <FaLock />
          <span>256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
}
