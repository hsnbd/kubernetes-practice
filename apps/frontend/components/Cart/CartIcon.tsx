"use client";

import { useCart } from "@/contexts/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const { state, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <FaShoppingCart className="text-gray-700 text-xl" />
      
      {/* Cart Badge */}
      {state.totalItems > 0 && (
        <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {state.totalItems > 99 ? "99+" : state.totalItems}
        </div>
      )}
    </button>
  );
}
