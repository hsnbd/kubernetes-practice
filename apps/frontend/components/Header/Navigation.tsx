import Link from "next/link";
import { RiSearch2Fill } from "react-icons/ri";
import { FaUser, FaHeart } from "react-icons/fa";
import CartIcon from "@/components/Cart/CartIcon";
import { NAVIGATION_LINKS, COMPANY_INFO } from "@/constants";

export default function Navigation() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{COMPANY_INFO.name}</h1>
              <p className="text-xs text-gray-500 -mt-1">{COMPANY_INFO.tagline}</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
            <RiSearch2Fill className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search plants, seeds, accessories..."
              className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <FaHeart size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            
            <CartIcon />
            
            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <FaUser size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
