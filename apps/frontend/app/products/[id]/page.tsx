"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useProducts } from "@/hooks/useProducts";
import TopBar from "@/components/Header/TopBar";
import Navigation from "@/components/Header/Navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductImageGallery from "@/components/Products/ProductImageGallery";
import ProductDetailsInfo from "@/components/Products/ProductDetailsInfo";
import ProductSpecifications from "@/components/Products/ProductSpecifications";
import ProductReviews from "@/components/Products/ProductReviews";
import RelatedProducts from "@/components/Products/RelatedProducts";
import Footer from "@/components/Footer/Footer";
import { HERO_CONTENT } from "@/constants";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { product, isLoading, error } = useProduct(productId);
  const { products } = useProducts(); // For related products

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
        <Navigation />
        
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Product Info Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
        <Navigation />
        
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error || "The product you're looking for doesn't exist or has been removed."}
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
    <div className="min-h-screen bg-white">
      <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
      <Navigation />

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6">
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/#products" },
            { label: product.name }
          ]}
        />
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery 
              images={product.images || [product.image_url || "/images/Product_Laptop.webp"]}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            <ProductDetailsInfo product={product} />
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ProductSpecifications product={product} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <ProductReviews 
            averageRating={product.rating || 4.5}
            totalReviews={product.reviewCount || 142}
          />
        </div>
      </div>

      {/* Related Products */}
      {products.length > 1 && (
        <RelatedProducts 
          products={products}
          currentProductId={product.id}
        />
      )}

      <Footer />
    </div>
  );
}
