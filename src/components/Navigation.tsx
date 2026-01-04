import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-7">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/dealnest-website-design.png"
              alt="DealNest"
              className="h-16 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - Three Column Layout */}
          <div className="hidden md:grid md:grid-cols-3 md:items-center md:flex-1">
            {/* Left column - empty spacer */}
            <div></div>
            
            {/* Center column - main navigation links */}
            <div className="flex items-center justify-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-all relative group py-2"
                activeProps={{ className: "text-primary-600" }}
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-primary-600 font-medium transition-all relative group py-2"
                activeProps={{ className: "text-primary-600" }}
              >
                FAQs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/our-process"
                className="text-gray-700 hover:text-primary-600 font-medium transition-all relative group py-2"
                activeProps={{ className: "text-primary-600" }}
              >
                Our Process
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>
            
            {/* Right column - CTA button */}
            <div className="flex items-center justify-end">
              <Link
                to="/submit-deal"
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit a Deal
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 py-3 space-y-1.5">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium py-3 px-4 rounded-xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/faqs"
              className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium py-3 px-4 rounded-xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQs
            </Link>
            <Link
              to="/our-process"
              className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium py-3 px-4 rounded-xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Process
            </Link>
            <Link
              to="/submit-deal"
              className="block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold text-center hover:from-primary-700 hover:to-primary-800 transition-all shadow-md mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit a Deal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
