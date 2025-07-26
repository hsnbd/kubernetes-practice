"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar, FaRegStar, FaThumbsUp, FaUser, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Review } from "@/types";

interface ProductReviewsProps {
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ averageRating, totalReviews }: ProductReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Demo reviews data
  const reviews: Review[] = [
    {
      id: 1,
      user_name: "Sarah Johnson",
      user_avatar: "/images/avatar1.jpg",
      rating: 5,
      comment: "Absolutely love this product! The quality is exceptional and it arrived perfectly packaged. Would definitely recommend to anyone looking for premium quality.",
      created_at: "2024-01-15",
      helpful_count: 12,
      verified_purchase: true
    },
    {
      id: 2,
      user_name: "Mike Chen",
      user_avatar: "/images/avatar2.jpg",
      rating: 4,
      comment: "Great product overall. Good quality and fast shipping. Only minor issue was the packaging could be more eco-friendly, but the product itself is fantastic.",
      created_at: "2024-01-10",
      helpful_count: 8,
      verified_purchase: true
    },
    {
      id: 3,
      user_name: "Emma Thompson",
      user_avatar: "/images/avatar3.jpg",
      rating: 5,
      comment: "Exceeded my expectations! The attention to detail is remarkable. Customer service was also very responsive when I had questions.",
      created_at: "2024-01-08",
      helpful_count: 15,
      verified_purchase: false
    }
  ];

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const stars = [];
    const sizeClass = size === "sm" ? "text-sm" : "text-base";
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? (
            <FaStar className={`text-yellow-400 ${sizeClass}`} />
          ) : (
            <FaRegStar className={`text-gray-300 ${sizeClass}`} />
          )}
        </span>
      );
    }
    return stars;
  };

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 63 },
    { stars: 4, count: 32, percentage: 22 },
    { stars: 3, count: 15, percentage: 11 },
    { stars: 2, count: 4, percentage: 3 },
    { stars: 1, count: 2, percentage: 1 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <Button 
          onClick={() => setShowWriteReview(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(averageRating), "md")}
            </div>
            <p className="text-gray-600">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{item.stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Sort by:</span>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {review.user_avatar ? (
                  <Image 
                    src={review.user_avatar} 
                    alt={review.user_name}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser />
                )}
              </div>

              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                  {review.verified_purchase && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <FaCheckCircle size={12} />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>

                {/* Rating & Date */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                {/* Helpful Button */}
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
                  <FaThumbsUp size={12} />
                  <span>Helpful ({review.helpful_count || 0})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8 py-2 rounded-full">
          Load More Reviews
        </Button>
      </div>

      {/* Write Review Modal would go here */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <p className="text-gray-600 mb-4">Share your experience with this product</p>
            {/* Review form would go here */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Submit Review
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWriteReview(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
