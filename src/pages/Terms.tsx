import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 prose prose-slate max-w-none dark:prose-invert">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using StateMatch ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              StateMatch provides a quiz-based location recommendation service that analyzes your preferences, lifestyle, and values to suggest U.S. states and cities that may be suitable for you. The Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A 30-question assessment of your preferences</li>
              <li>A free preview of your top 3 state recommendations</li>
              <li>A detailed paid report with your top 10 state matches, including city recommendations and comprehensive insights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Pricing and Payment</h2>
            <p>
              The detailed full report is available for a one-time payment of $7.00 USD. Payment is processed securely through Stripe. By purchasing the report, you agree to pay all applicable fees and taxes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
            <p className="font-semibold mb-2">30-Day Money-Back Guarantee</p>
            <p>
              We offer a full refund within 30 days of purchase if you are not satisfied with your report for any reason. To request a refund:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Contact us at support@statematch.com within 30 days of your purchase</li>
              <li>Include your purchase confirmation email or transaction ID</li>
              <li>Provide a brief reason for the refund request (optional but appreciated)</li>
            </ul>
            <p>
              Refunds will be processed within 5-7 business days and will be returned to your original payment method. Please note that after a refund is issued, you will no longer have access to your detailed report.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Information</h2>
            <p>
              While we strive to provide accurate and up-to-date information about U.S. states and cities, StateMatch's recommendations are based on algorithms and data that may not reflect all factors important to your decision. Our service is intended to provide guidance and should not be the sole basis for making relocation decisions.
            </p>
            <p className="mt-2">
              We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>That the recommended locations will meet all your needs or expectations</li>
              <li>The accuracy, completeness, or currentness of all data points</li>
              <li>That the information reflects real-time conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Use of Service</h2>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service in any way that violates any applicable law or regulation</li>
              <li>Attempt to reverse engineer or extract the algorithm or data used by the Service</li>
              <li>Share, resell, or redistribute your purchased report to others</li>
              <li>Use automated systems or software to extract data from the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, algorithms, and software, are the exclusive property of StateMatch and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, StateMatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any relocation decisions made based on our recommendations</li>
              <li>Any errors or omissions in the content</li>
              <li>Any unauthorized access to or use of our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: support@statematch.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
