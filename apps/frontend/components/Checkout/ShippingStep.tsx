import { Button } from "@/components/ui/button";
import { FaTruck, FaClock, FaShippingFast } from "react-icons/fa";

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

interface ShippingStepProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingStep({ formData, onChange, onNext, onBack }: ShippingStepProps) {
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 9.99,
      icon: <FaTruck className="text-gray-600" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 19.99,
      icon: <FaClock className="text-blue-600" />
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 39.99,
      icon: <FaShippingFast className="text-red-600" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Method</h2>
      
      {/* Shipping Address Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Shipping to:</h3>
        <div className="text-sm text-gray-700">
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          {formData.apartment && <p>{formData.apartment}</p>}
          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
        </div>
        <button 
          onClick={onBack}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2"
        >
          Change address
        </button>
      </div>

      {/* Shipping Options */}
      <div className="space-y-4 mb-6">
        {shippingOptions.map((option) => (
          <label key={option.id} className="block">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    defaultChecked={option.id === 'standard'}
                  />
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {option.price === 9.99 ? 'Free*' : `$${option.price.toFixed(2)}`}
                  </div>
                  {option.price === 9.99 && (
                    <div className="text-xs text-gray-500">on orders over $50</div>
                  )}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Billing Address */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Billing Address</h3>
        
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.sameAsShipping}
            onChange={(e) => onChange('sameAsShipping', e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Same as shipping address
          </span>
        </label>

        {!formData.sameAsShipping && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.billingFirstName}
                  onChange={(e) => onChange('billingFirstName', e.target.value)}
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
                  value={formData.billingLastName}
                  onChange={(e) => onChange('billingLastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.billingAddress}
                onChange={(e) => onChange('billingAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.billingCity}
                  onChange={(e) => onChange('billingCity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={formData.billingState}
                  onChange={(e) => onChange('billingState', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.billingZipCode}
                  onChange={(e) => onChange('billingZipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex-1 py-4 rounded-lg font-semibold text-lg"
        >
          Back to Information
        </Button>
        <Button 
          onClick={onNext}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold text-lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
