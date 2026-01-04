import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <img
              src="/dealnest-website-design.png"
              alt="DealNest"
              className="h-20 w-auto mb-6 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping real estate investors dispose of their deals fast with
              access to over 1,000,000 buyers nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-500"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/submit-deal"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Submit a Deal
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/our-process"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Our Process
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/staff/login"
                  className="text-sm hover:text-primary-400 transition-all inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all mr-0 group-hover:mr-2"></span>
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm group hover:text-primary-400 transition-colors">
                <div className="bg-primary-500/10 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                </div>
                <span className="pt-1">contact@dealnesthomes.com</span>
              </li>
              <li className="flex items-start space-x-3 text-sm group hover:text-primary-400 transition-colors">
                <div className="bg-primary-500/10 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                </div>
                <span className="pt-1">(248) 946-1721</span>
              </li>
              <li className="flex items-start space-x-3 text-sm group hover:text-primary-400 transition-colors">
                <div className="bg-primary-500/10 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                </div>
                <span className="pt-1">Nationwide Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DealNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
