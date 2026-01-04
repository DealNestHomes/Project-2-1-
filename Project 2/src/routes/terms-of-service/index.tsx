import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service/")({
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By accessing and using DealNest's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Description of Service</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              DealNest provides a platform connecting real estate investors with potential buyers for wholesale real estate transactions. We facilitate the disposition of real estate contracts through our nationwide network of buyers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. User Obligations</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Users agree to provide accurate, current, and complete information about properties and contracts submitted through our platform. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Fees and Payment</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              DealNest charges fees upon successful assignment of contracts. Fee structures and payment terms will be clearly communicated prior to service commencement. All fees are non-refundable once services have been rendered.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              DealNest acts as a facilitator and is not responsible for the completion of transactions between parties. We make no warranties regarding the success of any particular transaction or the suitability of any buyer for a particular property.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Modifications to Terms</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              DealNest reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Contact Information</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              For questions about these Terms of Service, please contact us at contact@dealnesthomes.com or call (248) 946-1721.
            </p>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mt-8 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a simplified version of our Terms of Service. For complete legal terms, please contact our team directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
