import { CartItem } from "@/contexts/CartContext";
import Image from "next/image";
import { FaTruck, FaEdit, FaTrash, FaShieldAlt } from "react-icons/fa";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export default function OrderSummary({ 
  items, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  removeItem, 
  updateQuantity 
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.product.image_url || "/images/Product_Laptop.webp"}
                alt={item.product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                {item.product.name}
              </h3>
              {item.selectedSize && (
                <p className="text-xs text-gray-600 mt-1">Size: {item.selectedSize}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded border text-xs hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded border text-xs hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-emerald-600">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <FaTruck size={12} />
            Shipping
          </span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-emerald-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <FaShieldAlt />
          <span className="text-sm font-medium">Secure Checkout</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}
