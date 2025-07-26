import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  description, 
  ctaPrimary = "Shop Now",
  ctaSecondary = "Learn More"
}: HeroSectionProps) {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        
        <h2 className="text-2xl md:text-3xl text-emerald-100 mb-4 font-light">
          {subtitle}
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {ctaPrimary}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300"
          >
            {ctaSecondary}
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span className="text-sm">4.9/5 (2,847 reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚚</span>
            <span className="text-sm">Free shipping worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <span className="text-sm">10,000+ happy customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
