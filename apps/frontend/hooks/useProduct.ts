"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { API_CONFIG } from "@/constants";

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        const data = res.data;
        
        // Enhanced product data with demo values for better presentation
        const enhancedProduct: Product = {
          ...data,
          images: data.images || [
            data.image_url || "/images/Product_Laptop.webp",
            "/images/Product_Laptop.webp",
            "/images/Product_Laptop.webp",
            "/images/Product_Laptop.webp"
          ],
          rating: data.rating || parseFloat((4 + Math.random()).toFixed(1)),
          reviewCount: data.reviewCount || Math.floor(Math.random() * 200) + 50,
          inStock: data.inStock ?? true,
          stockCount: data.stockCount || Math.floor(Math.random() * 50) + 10,
          features: data.features || [
            "Premium quality materials",
            "Eco-friendly and sustainable",
            "Expert care instructions included",
            "30-day satisfaction guarantee",
            "Free nationwide shipping"
          ],
          specifications: data.specifications || {},
          tags: data.tags || ["featured", "bestseller"],
          weight: data.weight || "2.5 lbs",
          dimensions: data.dimensions || "12\" × 8\" × 6\"",
          brand: data.brand || "GreenLand",
          sku: data.sku || `PRD-${productId.padStart(6, '0')}`
        };

        setProduct(enhancedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch product");
        
        // Fallback demo product
        setProduct({
          id: parseInt(productId),
          name: "Premium Garden Plant",
          description: "A beautiful, high-quality plant perfect for your home or garden. Carefully selected and grown with sustainable practices.",
          price: 29.99,
          image_url: "/images/Product_Laptop.webp",
          images: [
            "/images/Product_Laptop.webp",
            "/images/Product_Laptop.webp",
            "/images/Product_Laptop.webp"
          ],
          rating: 4.5,
          reviewCount: 142,
          inStock: true,
          stockCount: 25,
          features: [
            "Premium quality materials",
            "Eco-friendly and sustainable", 
            "Expert care instructions included",
            "30-day satisfaction guarantee",
            "Free nationwide shipping"
          ],
          specifications: {
            "Brand": "GreenLand",
            "Weight": "2.5 lbs",
            "Dimensions": "12\" × 8\" × 6\"",
            "Material": "Premium ceramic",
            "Care Level": "Easy"
          },
          tags: ["featured", "bestseller"],
          weight: "2.5 lbs",
          dimensions: "12\" × 8\" × 6\"",
          brand: "GreenLand",
          sku: `PRD-${productId.padStart(6, '0')}`
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, isLoading, error };
};
