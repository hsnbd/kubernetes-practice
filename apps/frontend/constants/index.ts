export const API_CONFIG = {
  BASE_URL: "http://kube.ecom.local/services/products/api",
  ENDPOINTS: {
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
  }
} as const;

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories/plants", label: "Plants" },
  { href: "/categories/seeds", label: "Seeds" },
  { href: "/categories/pots", label: "Pots & Planters" },
  { href: "/categories/accessories", label: "Accessories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const HERO_CONTENT = {
  TOP_BAR_MESSAGE: "🚚 Free shipping on orders over $50 • 🌱 30-day return policy",
  TITLE: "GreenLand",
  SUBTITLE: "Transform Your Space with Nature",
  DESCRIPTION: "Discover premium plants, seeds, and gardening essentials delivered to your doorstep",
  CTA_PRIMARY: "Shop Now",
  CTA_SECONDARY: "Explore Collection",
} as const;

export const FEATURES = [
  {
    title: "Free Worldwide Shipping",
    description: "On orders over $50",
    icon: "🚚"
  },
  {
    title: "24/7 Customer Support", 
    description: "Expert help when you need it",
    icon: "💬"
  },
  {
    title: "30-Day Returns",
    description: "Money-back guarantee",
    icon: "↩️"
  },
  {
    title: "Plant Care Guide",
    description: "Free with every purchase",
    icon: "📖"
  }
] as const;

export const COMPANY_INFO = {
  name: "GreenLand",
  tagline: "Your Garden Paradise",
  description: "Premium plants and gardening supplies since 2020",
  contact: {
    phone: "+1 (555) 123-4567",
    email: "hello@greenland.com",
    address: "123 Garden Street, Plant City, PC 12345"
  }
} as const;
