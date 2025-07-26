import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToastContext } from "@/contexts/ToastContext";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use product rating or generate random rating for demo
  const rating = product.rating || parseFloat((4 + Math.random()).toFixed(1));
  const reviews = product.reviewCount || Math.floor(Math.random() * 200) + 10;
  const isOnSale = Math.random() > 0.7;
  const originalPrice = isOnSale ? product.price * 1.3 : null;
  
  const { addToCart, openCart } = useCart();
  const { success } = useToastContext();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    addToCart(product, 1);
    success(`Added ${product.name} to cart!`);
    setTimeout(() => openCart(), 1000);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            SALE
          </div>
        )}
        
        <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group/heart">
          <FaHeart className="text-gray-400 group-hover/heart:text-red-500 transition-colors" size={14} />
        </button>
        
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.image_url || "/images/Product_Laptop.webp"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
        
        {/* Quick Add Button - Shows on hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            onClick={handleQuickAdd}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2 text-sm font-semibold shadow-lg"
          >
            <FaShoppingCart className="mr-2" size={14} />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < Math.floor(rating) 
                    ? "text-yellow-400" 
                    : "text-gray-200"
                } w-3 h-3`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">
              ${product.price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full px-4"
            >
              View
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500">In Stock</span>
        </div>
      </div>
    </div>
  );
}
