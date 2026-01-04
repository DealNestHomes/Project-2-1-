import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What areas do you cover?",
    answer:
      "We dispo deals nationwide. Your deal will reach active buyers in all 50 states through our systems and private buyer network.",
  },
  {
    question: "How fast can you move a deal?",
    answer:
      "Most deals get assigned in 7 to 14 days depending on pricing, condition, and demand in the area.",
  },
  {
    question: "What types of deals do you take?",
    answer:
      "We work with cash, creative, SubTo, novation, assignment, double close, and wholetail investment opportunities both off market and on market across the United States.",
  },
  {
    question: "Do I need photos?",
    answer:
      "We strongly prefer photos so we can evaluate and move your deal immediately. If you do not have photos yet, we can help coordinate them, but deals submitted with photos are reviewed and moved faster.",
  },
  {
    question: "What's in it for DealNest?",
    answer:
      "We only get paid when your deal closes. We handle all the marketing, buyer outreach, negotiations, and assignment coordination so you can focus on locking up more contracts.",
  },
  {
    question: "How does your profit split work?",
    answer:
      "We discuss the split over the phone based on the specific deal, the market, and the level of work required. Our goal is to structure something that makes sense for both sides and gets the deal closed quickly.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-50 px-5 py-2.5 rounded-full mb-6 shadow-sm border border-primary-200">
            <HelpCircle className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-bold text-primary-700">
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to know about working with DealNest
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-primary-300 shadow-lg"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all group"
              >
                <span className="font-bold text-gray-900 text-lg group-hover:text-primary-700 transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-primary-600 rotate-180"
                      : "bg-primary-100 group-hover:bg-primary-200"
                  }`}
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-colors ${
                      openIndex === index ? "text-white" : "text-primary-600"
                    }`}
                  />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2 bg-gradient-to-b from-primary-50/30 to-transparent">
                  <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
