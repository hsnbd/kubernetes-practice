"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { FaTimes, FaTrash, FaShoppingBag, FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar() {
  const { state, removeFromCart, updateQuantity, closeCart } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaShoppingBag className="text-emerald-600" />
            Shopping Cart ({state.totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started
              </p>
              <Button 
                onClick={closeCart}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image_url || "/images/Product_Laptop.webp"}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="font-medium text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-emerald-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:bg-gray-50 transition-colors"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded border hover:bg-gray-50 transition-colors"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-emerald-600">${state.totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button 
                onClick={closeCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-semibold text-lg"
              >
                Proceed to Checkout
              </Button>
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
