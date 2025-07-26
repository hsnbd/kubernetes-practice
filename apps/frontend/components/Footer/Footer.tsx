import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { COMPANY_INFO } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-emerald-600">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
            <p className="mb-6 text-emerald-100">Get gardening tips, exclusive offers, and new arrivals delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌿</span>
              </div>
              <h3 className="text-xl font-bold">{COMPANY_INFO.name}</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {COMPANY_INFO.description}. Transform your space with our premium collection of plants and gardening essentials.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="w-5 h-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <FaTwitter className="w-5 h-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <FaInstagram className="w-5 h-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <FaPinterest className="w-5 h-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Contact", "FAQ", "Shipping Info", "Returns", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {["Indoor Plants", "Outdoor Plants", "Seeds", "Pots & Planters", "Tools", "Fertilizers"].map((category) => (
                <li key={category}>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{COMPANY_INFO.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{COMPANY_INFO.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{COMPANY_INFO.contact.email}</span>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Business Hours</h5>
              <div className="text-gray-400 text-sm space-y-1">
                <div>Mon - Fri: 9:00 AM - 6:00 PM</div>
                <div>Sat: 10:00 AM - 4:00 PM</div>
                <div>Sun: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 {COMPANY_INFO.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
