"use client";

import React from "react";
import TopBar from "@/components/Header/TopBar";
import Navigation from "@/components/Header/Navigation";
import HeroSection from "@/components/Header/HeroSection";
import FeatureOverview from "@/components/Features/FeatureOverview";
import ProductGrid from "@/components/Products/ProductGrid";
import Footer from "@/components/Footer/Footer";
import { useProducts } from "@/hooks/useProducts";
import { HERO_CONTENT } from "@/constants";

export default function Home() {
  const { products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <TopBar message={HERO_CONTENT.TOP_BAR_MESSAGE} />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/images/HeroImage.jpg')] bg-cover bg-center bg-no-repeat"></div>
        <HeroSection
          title={HERO_CONTENT.TITLE}
          subtitle={HERO_CONTENT.SUBTITLE}
          description={HERO_CONTENT.DESCRIPTION}
          ctaPrimary={HERO_CONTENT.CTA_PRIMARY}
          ctaSecondary={HERO_CONTENT.CTA_SECONDARY}
        />
      </div>

      {/* Features Section */}
      <FeatureOverview />
        
      {/* Error State */}
      {error && (
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 mb-6">
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}
        
      {/* Products Section */}
      <ProductGrid products={products} isLoading={isLoading} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
