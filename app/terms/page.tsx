import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — EliteHub NG",
  description:
    "Read EliteHub NG's Terms of Service. By using our platform, you agree to these terms governing buying, selling, and use of our marketplace.",
  alternates: { canonical: "https://elitehubng.com/terms" },
};

const LAST_UPDATED = "January 2025";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="bg-navy-gradient">
        <div className="section py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Terms of Service</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-white/50 text-sm font-body">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="section py-12">
        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] p-8 md:p-12 max-w-4xl mx-auto">
          <div className="prose prose-sm max-w-none text-navy-DEFAULT/75 font-body leading-relaxed space-y-8">

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using EliteHub NG (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;,
                &quot;our&quot;), you agree to be bound by these Terms of Service and all applicable
                laws and regulations in Nigeria. If you do not agree to these terms, you may not use
                our platform.
              </p>
              <p className="mt-3">
                EliteHub NG is operated by EliteHub NG Ltd., registered in Nigeria, with offices at
                589 Thailand Street, Efab Queens, Karsana, Abuja, FCT, Nigeria.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to create an account or make purchases on EliteHub
                NG. By using the platform, you represent that you meet this age requirement and have
                the legal capacity to enter into binding contracts under Nigerian law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">3. Platform Role</h2>
              <p>
                EliteHub NG is a marketplace platform that connects buyers and sellers. We are not
                the seller of record for any item listed on the platform. Each transaction is between
                the buyer and the individual seller. EliteHub NG facilitates transactions through our
                escrow system but is not liable for the products listed by third-party sellers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">4. Escrow & Payments</h2>
              <p>
                All transactions on EliteHub NG are processed through our escrow system. Buyer
                payments are held securely until the buyer confirms receipt of the item in satisfactory
                condition, or until a dispute is resolved. By using the platform, both buyers and sellers
                agree to this payment process.
              </p>
              <p className="mt-3">
                Payment methods accepted on the platform may change from time to time. All payments are
                processed in Nigerian Naira (NGN). EliteHub NG charges a service fee on completed
                transactions, as disclosed in the app at time of checkout.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">5. Buyer Obligations</h2>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Provide accurate delivery information</li>
                <li>Confirm or dispute delivery within 7 days of receipt</li>
                <li>Not abuse the dispute resolution system</li>
                <li>Not attempt to circumvent the escrow system</li>
                <li>Leave honest and accurate reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">6. Seller Obligations</h2>
              <p>
                Sellers must comply with our{" "}
                <a href="/seller-guidelines" className="text-gold-DEFAULT hover:underline">
                  Seller Guidelines
                </a>
                . Key obligations include listing only items in your possession, describing items
                accurately, shipping within 48 hours of payment confirmation, and maintaining a
                minimum 4.0 rating over 30-day rolling periods.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">7. Prohibited Conduct</h2>
              <p>The following are strictly prohibited on EliteHub NG:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Fraud, misrepresentation, or deception of any kind</li>
                <li>Listing or selling counterfeit, stolen, or illegal items</li>
                <li>Creating multiple accounts to circumvent suspensions</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to conduct transactions outside the platform</li>
                <li>Manipulating ratings or reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">8. Disputes</h2>
              <p>
                Disputes between buyers and sellers must first be raised through the EliteHub NG
                dispute resolution system within 7 days of delivery. EliteHub NG will review evidence
                from both parties and make a binding decision. Our decisions may be appealed once
                within 7 days of the initial ruling.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">9. Limitation of Liability</h2>
              <p>
                EliteHub NG&apos;s liability to any user is limited to the transaction value of the
                disputed order. We are not liable for indirect, incidental, or consequential damages
                arising from use of the platform. Our escrow system represents our primary liability
                commitment to buyers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">10. Intellectual Property</h2>
              <p>
                All trademarks, logos, and brand elements of EliteHub NG are our exclusive property.
                Users may not use our branding without written permission. By listing products, sellers
                grant EliteHub NG a licence to display their product images and descriptions on our
                platform and related marketing materials.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">11. Termination</h2>
              <p>
                EliteHub NG reserves the right to suspend or terminate any account at any time for
                violations of these terms or our guidelines. Users may close their account by contacting
                support. Outstanding balances in escrow will be handled according to transaction status
                at time of account closure.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">12. Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of the Federal Republic of Nigeria.
                Any disputes arising from these terms shall be resolved in the courts of Abuja, FCT,
                Nigeria.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of
                significant changes via the app or email. Continued use of the platform after changes
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-navy-DEFAULT mb-3">14. Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@elitehubng.com" className="text-gold-DEFAULT hover:underline">
                  legal@elitehubng.com
                </a>{" "}
                or at our office: 589 Thailand Street, Efab Queens, Karsana, Abuja, FCT, Nigeria.
                Phone:{" "}
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