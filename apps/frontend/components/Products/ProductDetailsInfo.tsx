"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToastContext } from "@/contexts/ToastContext";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";
import { Product } from "@/types";

interface ProductDetailsInfoProps {
  product: Product;
}

export default function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCart, openCart } = useCart();
  const { success, error } = useToastContext();

  // Generate demo data
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 142;
  const isOnSale = Math.random() > 0.7;
  const originalPrice = isOnSale ? product.price * 1.3 : null;
  const discount = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      // Check if size is required but not selected
      if (product.tags?.includes("apparel") && !selectedSize) {
        error("Please select a size before adding to cart");
        return;
      }

      // Add to cart
      addToCart(product, quantity, selectedSize || undefined);
      
      // Show success message
      success(`Added ${quantity} ${product.name} to cart!`);
      
      // Open cart after a short delay
      setTimeout(() => {
        openCart();
      }, 1000);
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600">SKU: {product.sku || `PRD-${product.id.toString().padStart(6, '0')}`}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {renderStars(rating)}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-900">
          ${product.price}
        </span>
        {originalPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
              Save {discount}%
            </div>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <FaCheck className="text-green-500" />
        <span className="text-green-600 font-medium">In Stock</span>
        <span className="text-gray-500">({product.stockCount || 25} available)</span>
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700">
                <FaCheck className="text-green-500 text-xs" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Size Selection (if applicable) */}
      {product.tags?.includes("apparel") && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Size:</h3>
          <div className="flex gap-2">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 border-2 rounded-lg font-medium transition-colors ${
                  selectedSize === size
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Quantity:</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaShoppingCart className="mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
              isWishlisted
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FaHeart />
          </button>
          <button className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center">
            <FaShare />
          </button>
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="border-t pt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FaTruck className="text-emerald-600" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FaUndo className="text-emerald-600" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FaShieldAlt className="text-emerald-600" />
          <span>2-year warranty included</span>
        </div>
      </div>
    </div>
  );
}
