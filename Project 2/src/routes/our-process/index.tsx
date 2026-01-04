import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Search,
  Users,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Award,
  MessageSquare,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/our-process/")({
  component: OurProcess,
});

function OurProcess() {
  const steps = [
    {
      number: 1,
      title: "Submit Your Deal",
      description:
        "Fill out our streamlined submission form with your property details, photos, pricing, and contract information. Our simple interface makes it quick and easy to get started.",
      icon: FileText,
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600",
      badgeColor: "text-primary-600",
      gradientFrom: "from-primary-50",
      gradientTo: "to-primary-100",
      iconLargeColor: "text-primary-200",
      features: [
        "Quick 5-minute submission form",
        "Upload photos and documents",
        "Secure and confidential",
      ],
      timeframe: "5 minutes",
    },
    {
      number: 2,
      title: "Review and Approval",
      description:
        "Our experienced team reviews your submission for completeness and accuracy. We'll reach out within 24 hours if we need any additional information or clarification.",
      icon: Search,
      bgColor: "bg-accent-100",
      iconColor: "text-accent-600",
      badgeColor: "text-accent-600",
      gradientFrom: "from-accent-50",
      gradientTo: "to-accent-100",
      iconLargeColor: "text-accent-200",
      features: [
        "Expert deal analysis",
        "24-hour initial review",
        "Professional guidance",
      ],
      timeframe: "24-48 hours",
    },
    {
      number: 3,
      title: "Blast to Buyers",
      description:
        "Your deal is immediately distributed to our network of over 1,000,000 active cash buyers through InvestorLift, plus our exclusive private buyers list. Buyers are matched based on their buy box, budget, and location preferences.",
      icon: Users,
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600",
      badgeColor: "text-primary-600",
      gradientFrom: "from-primary-50",
      gradientTo: "to-primary-100",
      iconLargeColor: "text-primary-200",
      features: [
        "1M+ active buyer reach",
        "Targeted buyer matching",
        "Multiple offer generation",
      ],
      timeframe: "Immediate",
    },
    {
      number: 4,
      title: "Close Fast",
      description:
        "We manage all buyer communications, coordinate showings, handle negotiations, and facilitate the assignment paperwork. You stay informed throughout the process while we do the heavy lifting.",
      icon: Handshake,
      bgColor: "bg-accent-100",
      iconColor: "text-accent-600",
      badgeColor: "text-accent-600",
      gradientFrom: "from-accent-50",
      gradientTo: "to-accent-100",
      iconLargeColor: "text-accent-200",
      features: [
        "Full buyer coordination",
        "Assignment paperwork handled",
        "7-14 day average closing",
      ],
      timeframe: "7-14 days",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Enhanced with better gradients and animations */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-300 rounded-full blur-3xl opacity-15 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-primary-200 mb-8 hover:shadow-xl transition-shadow">
              <Zap className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-800">
                Proven 4-Step System
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Our Simple, Effective{" "}
              <span className="text-primary-600 relative inline-block">
                Process
                <svg className="absolute -bottom-3 left-0 w-full" height="16" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C50 6 150 6 198 12" stroke="#16a34a" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto">
              We've streamlined deal disposition into four easy steps. From
              submission to closing, we're with you every step of the way.
            </p>

            {/* Timeline Overview - Enhanced */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-200 hover:shadow-3xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Typical Timeline
                  </span>
                </div>
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm font-bold">
                    7-14 Days Total
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700 rounded-full -translate-y-1/2 shadow-inner"></div>
                <div className="relative flex justify-between">
                  {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center group">
                      <div className="bg-white border-4 border-primary-600 w-16 h-16 rounded-full flex items-center justify-center font-bold text-primary-600 mb-3 shadow-xl group-hover:scale-110 group-hover:border-primary-700 transition-all">
                        <span className="text-lg">{step.number}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700 mt-1 hidden sm:block bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        {step.timeframe}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - Enhanced with better visuals and animations */}
      <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connecting line for non-last steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 top-full w-1 h-32 bg-gradient-to-b from-primary-400 via-primary-300 to-transparent -translate-x-1/2 z-0"></div>
                )}
                
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-10 items-center relative z-10`}
                >
                  {/* Content Side */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
                        >
                          <step.icon className={`h-12 w-12 ${step.iconColor}`} />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-primary-600 to-primary-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs font-bold ${step.badgeColor} uppercase tracking-wider mb-2 flex items-center gap-2`}
                        >
                          <span>Step {step.number}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-normal">{step.timeframe}</span>
                        </p>
                        <h3 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-600 leading-relaxed pl-30">
                      {step.description}
                    </p>

                    {/* Features list - Enhanced */}
                    <div className="space-y-4 pl-30">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3 group">
                          <div className={`${step.bgColor} p-1.5 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <CheckCircle2 className={`h-5 w-5 ${step.iconColor}`} />
                          </div>
                          <span className="text-gray-700 font-medium pt-0.5">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Side - Enhanced */}
                  <div className="flex-1 w-full">
                    <div
                      className={`bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} p-12 rounded-[2rem] shadow-2xl border-2 border-gray-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 hover:scale-105`}
                    >
                      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                      
                      {/* Animated background orbs */}
                      <div className={`absolute top-0 right-0 w-64 h-64 ${step.bgColor} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      <div className={`absolute bottom-0 left-0 w-48 h-48 ${step.bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                      
                      <div className="relative flex items-center justify-center h-72">
                        <step.icon className={`h-48 w-48 ${step.iconLargeColor} group-hover:scale-110 transition-all duration-500 drop-shadow-2xl`} />
                      </div>
                      
                      {/* Floating badge - Enhanced */}
                      <div className="absolute top-8 right-8 bg-white px-5 py-3 rounded-2xl shadow-xl border-2 border-gray-100 group-hover:scale-110 transition-transform">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-bold text-gray-800">
                            {step.timeframe}
                          </span>
                        </div>
                      </div>

                      {/* Step number indicator */}
                      <div className="absolute bottom-8 left-8 text-6xl font-bold text-white/10">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works - Enhanced with better cards and animations */}
      <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <Target className="h-4 w-4 text-primary-700" />
              <span className="text-sm font-semibold text-primary-800">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Our Process Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our proven approach combines cutting-edge technology, massive reach, and personalized service to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group hover:-translate-y-2 duration-300">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Maximum Exposure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your deal reaches over 1 million buyers through InvestorLift plus our private network, ensuring you get the best offers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group hover:-translate-y-2 duration-300">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Most deals receive initial buyer interest within 24-48 hours of submission, dramatically reducing your holding time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group hover:-translate-y-2 duration-300">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fully Vetted
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We only connect you with serious, qualified buyers who have the resources and intent to close quickly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group hover:-translate-y-2 duration-300">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Higher Fees
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Competition among buyers drives up assignment fees, maximizing your profit on every deal.
              </p>
            </div>
          </div>

          {/* Stats Section - Enhanced with better visual treatment */}
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-[2rem] p-10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900 rounded-full blur-3xl opacity-30"></div>
            
            <div className="relative">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-bold text-white mb-4">
                  Proven Results
                </h3>
                <p className="text-primary-100 text-xl">
                  Our process delivers consistent, measurable outcomes
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-3">98%</div>
                  <div className="text-primary-100 font-semibold">Success Rate</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-3">7-14</div>
                  <div className="text-primary-100 font-semibold">Days Average</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-3">1M+</div>
                  <div className="text-primary-100 font-semibold">Active Buyers</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-3">24hr</div>
                  <div className="text-primary-100 font-semibold">Initial Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section - Enhanced */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent-100 px-4 py-2 rounded-full mb-6">
              <MessageSquare className="h-4 w-4 text-accent-700" />
              <span className="text-sm font-semibold text-accent-800">Transparency First</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What to Expect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transparency and communication throughout the entire process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Regular Updates
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                You'll receive notifications at each stage of the process, from submission confirmation to buyer interest and closing coordination.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="bg-gradient-to-br from-accent-100 to-accent-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-10 w-10 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dedicated Support
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our team is available to answer questions, provide guidance, and ensure your experience is smooth from start to finish.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Multiple Offers
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our extensive buyer network typically generates multiple offers, giving you options and leverage to maximize your assignment fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with better design and animations */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-800 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/30">
            <Zap className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Get Started Today
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed max-w-3xl mx-auto">
            Submit your deal today and experience our streamlined process firsthand. 
            Join thousands of successful investors who trust DealNest.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/submit-deal"
              className="inline-flex items-center justify-center bg-white text-primary-700 px-12 py-6 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl text-lg group hover:scale-105"
            >
              Submit Your Deal
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/faqs"
              className="inline-flex items-center justify-center bg-primary-500/50 backdrop-blur-sm text-white px-12 py-6 rounded-2xl font-bold hover:bg-primary-500/60 transition-all shadow-xl border-2 border-white/30 text-lg hover:scale-105"
            >
              View FAQs
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-100">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">No Upfront Fees</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">7-14 Day Average</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">1M+ Buyers</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">98% Success Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
