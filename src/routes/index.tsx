import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  FileText,
  Search,
  Handshake,
  Clock,
  DollarSign,
  Star,
  Quote,
  BarChart3,
} from "lucide-react";
import { FAQSection } from "~/components/FAQSection";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Move Your Deals in{" "}
                <span className="text-primary-600 relative">
                  Days, Not Weeks
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10C50 5 150 5 198 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                Tap into a nationwide system built to get your contract in front of real buyers fast.
              </p>

              <p className="text-sm text-gray-500 mb-8 italic flex items-center justify-center lg:justify-start gap-2">
                <Zap className="h-4 w-4 text-primary-600" />
                Powered by InvestorLift and our private network of millions of active buyers nationwide
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/submit-deal"
                  className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl group"
                >
                  Submit a Deal
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/our-process"
                  className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-primary-600"
                >
                  Learn Our Process
                </Link>
              </div>

              {/* Quick stats under CTA */}
              <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-primary-600">1M+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Buyers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">7-14</div>
                  <div className="text-sm text-gray-600 mt-1">Days Average</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">50</div>
                  <div className="text-sm text-gray-600 mt-1">States Covered</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Professional real estate transaction"
                className="relative rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              {/* Floating stat card removed per user request */}
            </div>
          </div>
        </div>
      </section>

      {/* How DealNest Works Section - Enhanced */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How DealNest Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process gets your deals in front of qualified buyers quickly
            </p>
          </div>

          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600" style={{ width: '85%', margin: '0 auto' }}></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-primary-600 text-primary-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Submit Your Deal
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Send us the property details, photos, pricing, and contract information through our quick form.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <Search className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-primary-600 text-primary-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Review and Approval
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We check the deal for accuracy and reach out if we need anything.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-primary-600 text-primary-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Blast to Buyers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your deal gets pushed to over 1,000,000 active cash buyers nationwide plus our private buyers list.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                    <Handshake className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-primary-600 text-primary-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
                    4
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Close Fast
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We handle buyer communication and assignment coordination so you can close quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With DealNest Section - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work With DealNest
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools, network, and expertise to help you succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fast Turnaround
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Most deals get assigned in 7 to 14 days, helping you move on to your next opportunity quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Access to Millions of Active Buyers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your deals reach a massive nationwide network of cash buyers ready to close.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Professional Service
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A clean white glove dispo experience from start to finish with dedicated support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Upfront Fees
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You only pay when the deal closes. No risk, no hidden costs, just results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nationwide Coverage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Active in all 50 states with strong buyer demand across all major markets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Increased Assignment Fees
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our massive buyer network creates competition for your deals, driving up offers and maximizing your assignment fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Success Stories Section - New */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we've helped real estate investors close deals faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <Quote className="h-10 w-10 text-primary-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "DealNest helped me move a tough wholesale deal in Phoenix in just 9 days. Their buyer network is incredible, and the team kept me updated every step of the way. Highly recommend!"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                <img
                  src="/austin-profile.png"
                  alt="Austin"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-200"
                />
                <div>
                  <div className="font-bold text-gray-900">Austin</div>
                  <div className="text-sm text-gray-600">Detroit, MI</div>
                  <div className="text-xs text-primary-600 font-semibold mt-1 bg-primary-50 px-2 py-1 rounded-full inline-block">
                    $45K • 9 Days
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <Quote className="h-10 w-10 text-primary-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "I've used other disposition services before, but DealNest is by far the best. They closed my Atlanta deal in under a week and got me top dollar. The process was seamless and professional."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Jesse"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-200"
                />
                <div>
                  <div className="font-bold text-gray-900">Jesse</div>
                  <div className="text-sm text-gray-600">Atlanta, GA</div>
                  <div className="text-xs text-primary-600 font-semibold mt-1 bg-primary-50 px-2 py-1 rounded-full inline-block">
                    $32K • 6 Days
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <Quote className="h-10 w-10 text-primary-200 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "As a new wholesaler, I was nervous about my first deal. DealNest made it easy and found a qualified buyer in Dallas within 11 days. Their support team answered all my questions. Will definitely use again!"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Marc"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-200"
                />
                <div>
                  <div className="font-bold text-gray-900">Marc</div>
                  <div className="text-sm text-gray-600">Dallas, TX</div>
                  <div className="text-xs text-primary-600 font-semibold mt-1 bg-primary-50 px-2 py-1 rounded-full inline-block">
                    $28K • 11 Days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section - Enhanced */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Submit your deal today and get connected with over 1,000,000 active cash buyers.
            Join thousands of successful investors who trust DealNest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/submit-deal"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-12 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl text-lg group transform hover:scale-105"
            >
              Submit a Deal Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/our-process"
              className="inline-flex items-center justify-center bg-primary-500/50 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-bold hover:bg-primary-500/60 transition-all shadow-xl border-2 border-white/30 text-lg transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-primary-100">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">No Upfront Fees</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">7-14 Day Average</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Nationwide Coverage</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
