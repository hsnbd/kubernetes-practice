import { useEffect, useState } from 'react';
import { adsAPI, type Ad } from '../api';
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdSidebar() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dismissedAds, setDismissedAds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await adsAPI.getTargeted();
      setAds(response.data.ads || []);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch ads:', err);
      setError('Unable to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    try {
      // Track impression with clicked=true
      await adsAPI.trackImpression(ad.id, true);
      // Open in new tab
      window.open(ad.product_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to track ad click:', err);
      // Still open the link even if tracking fails
      window.open(ad.product_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = async (ad: Ad) => {
    // Track impression without click
    try {
      await adsAPI.trackImpression(ad.id, false);
    } catch (err) {
      console.error('Failed to track ad dismissal:', err);
    }
    
    // Mark as dismissed
    setDismissedAds(new Set([...dismissedAds, ad.id]));
  };

  const visibleAds = ads.filter(ad => !dismissedAds.has(ad.id));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail for ads
  }

  if (visibleAds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Recommended For You
      </h3>
      
      {visibleAds.map((ad) => (
        <div
          key={ad.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Dismiss button */}
          <div className="flex justify-end p-2">
            <button
              onClick={() => handleDismiss(ad)}
              className="text-gray-400 hover:text-gray-600"
              title="Dismiss"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Ad image */}
          {ad.image_url && (
            <div className="px-4 pb-3">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-32 object-cover rounded"
              />
            </div>
          )}

          {/* Ad content */}
          <div className="px-4 pb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {ad.title}
            </h4>
            <p className="text-xs text-gray-600 mb-3 line-clamp-3">
              {ad.description}
            </p>

            {/* CTA button */}
            <button
              onClick={() => handleAdClick(ad)}
              className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <span>Learn More</span>
              <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Sponsored label */}
          <div className="px-4 pb-2">
            <span className="text-xs text-gray-400">Sponsored</span>
          </div>
        </div>
      ))}
    </div>
  );
}
