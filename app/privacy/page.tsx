import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EliteHub NG",
  description:
    "EliteHub NG's Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with Nigerian data protection laws.",
  alternates: { canonical: "https://elitehubng.com/privacy" },
};

const LAST_UPDATED = "January 2025";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="bg-navy-gradient">
        <div className="section py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Privacy Policy</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm font-body">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="section py-12">
        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-navy-DEFAULT/75 font-body leading-relaxed space-y-8">

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">1. Introduction</h2>
              <p>
                EliteHub NG Ltd. (&quot;EliteHub NG&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to
                protecting your personal information. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our marketplace platform,
                mobile application, and website. We comply with the Nigeria Data Protection Regulation
                (NDPR) and applicable Nigerian data protection laws.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">2. Information We Collect</h2>
              <h3 className="font-semibold text-navy-DEFAULT mb-2 text-base">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-1.5 mb-4">
                <li>Name, email address, and phone number when you register</li>
                <li>Business name, address, and RC number (sellers)</li>
                <li>Profile photo (optional)</li>
                <li>Payment and bank details for withdrawals</li>
                <li>Product listings, photos, and descriptions</li>
                <li>Messages sent via in-app chat</li>
                <li>Reviews and ratings you submit</li>
              </ul>
              <h3 className="font-semibold text-navy-DEFAULT mb-2 text-base">2.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Device identifiers and operating system</li>
                <li>IP address and approximate location (for delivery purposes)</li>
                <li>App usage data and browsing behaviour on our platform</li>
                <li>Transaction history and order data</li>
                <li>Crash reports and performance data</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To create and manage your account</li>
                <li>To process transactions through our escrow system</li>
                <li>To facilitate communication between buyers and sellers</li>
                <li>To verify seller identity and prevent fraud</li>
                <li>To resolve disputes and provide customer support</li>
                <li>To send order updates, notifications, and receipts</li>
                <li>To improve our platform and develop new features</li>
                <li>To comply with Nigerian legal and regulatory obligations</li>
                <li>To send marketing communications (you can opt out any time)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">4. How We Share Your Information</h2>
              <p className="mb-3">We do not sell your personal information. We may share your data:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-navy-DEFAULT">With other users:</strong> Limited profile information (name, rating, location) is visible to facilitate transactions</li>
                <li><strong className="text-navy-DEFAULT">With service providers:</strong> Payment processors, cloud hosting (Firebase/Google Cloud), and analytics tools that help us operate the platform</li>
                <li><strong className="text-navy-DEFAULT">With law enforcement:</strong> When required by Nigerian law or court order</li>
                <li><strong className="text-navy-DEFAULT">In a business transfer:</strong> If we merge with or are acquired by another company, your data may transfer as part of that transaction</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information,
                including encryption in transit and at rest, secure authentication, and regular
                security audits. However, no method of transmission over the internet is 100% secure.
                We encourage you to use a strong, unique password for your account.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as
                needed to provide services. Transaction records are retained for 7 years as required
                by Nigerian financial regulations. You may request deletion of your account and
                associated data, subject to our legal retention obligations.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">7. Your Rights</h2>
              <p className="mb-3">Under the NDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to how we process your data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Lodge a complaint with the Nigeria Data Protection Bureau (NDPB)</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@elitehubng.com" className="text-gold-DEFAULT hover:underline">
                  privacy@elitehubng.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">8. Cookies & Tracking</h2>
              <p>
                Our website uses cookies and similar technologies to improve your browsing experience,
                analyse site traffic, and personalise content. You can control cookie settings through
                your browser. Disabling cookies may affect some features of the website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">9. Children&apos;s Privacy</h2>
              <p>
                EliteHub NG is not intended for users under 18 years of age. We do not knowingly
                collect personal information from minors. If we become aware that a minor has
                provided us with personal information, we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material
                changes via the app or email. Continued use of the platform after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">11. Contact</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact our Data Protection
                Officer at{" "}
                <a href="mailto:privacy@elitehubng.com" className="text-gold-DEFAULT hover:underline">
                  privacy@elitehubng.com
                </a>{" "}
                or: 589 Thailand Street, Efab Queens, Karsana, Abuja, FCT, Nigeria. Phone:{" "}
                <a href="tel:+2348140002708" className="text-gold-DEFAULT hover:underline">
                  +234 814 000 2708
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}