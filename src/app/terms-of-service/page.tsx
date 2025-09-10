import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>Please read these Terms of Service ("Terms") carefully before using the WriteBot AI website and services (the "Service") operated by WriteBot AI ("us", "we", or "our").</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This agreement applies to all visitors, users, and others who wish to access or use the Service.</p>

            <h2>2. Use of Services</h2>
            <ul>
              <li>You must provide accurate and complete registration information.</li>
              <li>You are responsible for the security of your account and password.</li>
              <li>You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.</li>
              <li>You are responsible for all content you generate and all activity that occurs under your account.</li>
            </ul>

            <h2>3. Content</h2>
            <p>Our Service allows you to create content using artificial intelligence. You are responsible for the content that you generate, including its legality, reliability, and appropriateness.</p>
            <p>You retain any and all of your rights to any content you create. We take no responsibility and assume no liability for content you or any third-party creates on or through the Service. However, by using the Service, you grant us the right and license to use, modify, and process the content on the Service solely for the purpose of providing the service to you.</p>

            <h2>4. Prohibited Uses</h2>
            <p>You agree not to use the Service to generate content that:</p>
            <ul>
              <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
              <li>Promotes discrimination based on race, sex, religion, nationality, disability, sexual orientation, or age.</li>
              <li>Infringes on any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
              <li>Contains any unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," or any other form of solicitation.</li>
            </ul>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

            <h2>6. Disclaimer</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied. The AI-generated content may contain inaccuracies or errors. We do not guarantee the accuracy, completeness, or usefulness of any information on the Service.</p>

            <h2>7. Limitation of Liability</h2>
            <p>In no event shall WriteBot AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2>8. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: support@writebotai.com</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}