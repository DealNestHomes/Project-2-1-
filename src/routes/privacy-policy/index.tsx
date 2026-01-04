import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy/")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We collect information you provide directly to us, including but not limited to: name, email address, phone number, property details, and business information. This information is necessary to provide our disposition services and connect you with potential buyers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Marketing Communications</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By providing your contact information, you consent to receive marketing communications from DealNest via email and SMS. We use Constant Contact and other platforms to manage our marketing campaigns. You may opt out at any time using the unsubscribe link in emails or by replying STOP to text messages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Information Sharing</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We may share your information with our network of buyers and partners to facilitate transactions. We do not sell your personal information to third parties for their direct marketing purposes without your explicit consent.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Data Security</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no internet transmission is ever fully secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Your Rights</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact us at contact@dealnesthomes.com.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Contact Us</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at contact@dealnesthomes.com or call (248) 946-1721.
            </p>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mt-8 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a simplified version of our Privacy Policy. For complete details, please contact our team directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
