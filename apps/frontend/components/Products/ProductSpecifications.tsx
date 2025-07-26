"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Product } from "@/types";

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    specifications: true,
    shipping: false,
    care: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate demo specifications if none provided
  const specifications = product.specifications || {
    "Brand": product.brand || "GreenLand",
    "Weight": product.weight || "2.5 lbs",
    "Dimensions": product.dimensions || "12\" × 8\" × 6\"",
    "Material": "Premium ceramic",
    "Color": "Natural earth tones",
    "Care Level": "Easy",
    "Light Requirements": "Bright, indirect light",
    "Water Frequency": "Weekly"
  };

  const shippingInfo = {
    "Processing Time": "1-2 business days",
    "Shipping Time": "3-7 business days",
    "Shipping Cost": "Free on orders over $50",
    "International": "Available to most countries",
    "Packaging": "Eco-friendly materials",
    "Tracking": "Provided with all orders"
  };

  const careInstructions = {
    "Watering": "Water when top inch of soil is dry",
    "Light": "Place in bright, indirect sunlight",
    "Temperature": "65-75°F (18-24°C)",
    "Humidity": "40-60% relative humidity",
    "Fertilizing": "Monthly during growing season",
    "Pruning": "Remove dead or yellowing leaves"
  };

  const Section = ({ 
    title, 
    data, 
    sectionKey 
  }: { 
    title: string; 
    data: Record<string, string>; 
    sectionKey: string; 
  }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? 
          <FaChevronUp className="text-gray-400" /> : 
          <FaChevronDown className="text-gray-400" />
        }
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid gap-3 mt-3">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">{key}:</span>
                <span className="text-gray-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
      
      <Section 
        title="Specifications" 
        data={specifications} 
        sectionKey="specifications" 
      />
      
      <Section 
        title="Shipping & Delivery" 
        data={shippingInfo} 
        sectionKey="shipping" 
      />
      
      <Section 
        title="Care Instructions" 
        data={careInstructions} 
        sectionKey="care" 
      />
    </div>
  );
}
