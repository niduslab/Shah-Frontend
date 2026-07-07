import { Metadata } from "next";
import { LegalPageLayout } from "@/app/(public)/_components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Shah Sports",
  description:
    "Read the Terms & Conditions governing the use of the Shah Sports website and the purchase of fitness and sports equipment in Bangladesh.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our website or placing an order with Shah Sports."
      lastUpdated="7 July 2026"
    >
      <h2>1. Introduction</h2>
      <p>
        These Terms & Conditions ("Terms") govern your access to and use of
        the Shah Sports website, and any purchase you make through it. By
        browsing our website, creating an account, or placing an order, you
        agree to be bound by these Terms. If you do not agree with any part
        of these Terms, please do not use our website.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years of age, or place orders under the
        supervision of a parent or legal guardian, to use our website and
        make purchases. By placing an order, you confirm that the
        information you provide is accurate and that you have the legal
        capacity to enter into a binding contract.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        Some features of our website, such as order tracking and order
        history, require you to create an account. You are responsible for
        maintaining the confidentiality of your login credentials and for all
        activity that occurs under your account. Please notify us immediately
        if you suspect any unauthorised use of your account.
      </p>

      <h2>4. Products & Pricing</h2>
      <ul>
        <li>
          All products are subject to availability. We reserve the right to
          limit quantities, discontinue products, or refuse orders at our
          discretion.
        </li>
        <li>
          Product images are for illustration purposes; actual colour,
          packaging, or minor design details may vary slightly.
        </li>
        <li>
          Prices are listed in Bangladeshi Taka (BDT) and are subject to
          change without prior notice. The price applicable to your order is
          the price displayed at the time of checkout.
        </li>
        <li>
          In the event of a pricing or listing error, we reserve the right to
          cancel the affected order and issue a full refund.
        </li>
      </ul>

      <h2>5. Orders & Payment</h2>
      <p>
        Placing an order constitutes an offer to purchase, which we may
        accept or decline. We accept payment via bKash, Nagad, debit/credit
        card, bank transfer, and Cash on Delivery (COD) where available. We
        reserve the right to cancel any order suspected of fraud,
        unauthorised activity, or a pricing/inventory error, and will notify
        you if this occurs.
      </p>

      <h2>6. Shipping & Delivery</h2>
      <p>
        Orders are delivered across Bangladesh in accordance with our{" "}
        <a href="/shipping">Shipping Policy</a>. Delivery timelines are
        estimates and may vary due to courier delays, weather, public
        holidays, or other circumstances beyond our control.
      </p>

      <h2>7. Returns, Refunds & Warranty</h2>
      <p>
        Returns, exchanges, and refunds are handled in accordance with our{" "}
        <a href="/returns">Return & Refund Policy</a>. Certain products may
        also carry a separate manufacturer or Shah Sports service warranty,
        details of which are provided with the product at the time of
        purchase.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        All content on this website, including text, graphics, logos,
        product images, and software, is the property of Shah Sports or its
        licensors and is protected by applicable intellectual property laws.
        You may not reproduce, distribute, or use any content from this
        website for commercial purposes without our prior written consent.
      </p>

      <h2>9. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our website for any unlawful purpose or in violation of these Terms</li>
        <li>Attempt to gain unauthorised access to our systems, accounts, or data</li>
        <li>Interfere with the security or normal operation of the website</li>
        <li>Submit false, misleading, or fraudulent information when placing an order</li>
        <li>Use automated means (bots, scrapers) to access or extract data from our website without permission</li>
      </ul>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Shah Sports shall not be
        liable for any indirect, incidental, or consequential damages arising
        from your use of our website or products, including but not limited
        to loss of data, loss of profits, or business interruption. Our total
        liability for any claim relating to a purchase shall not exceed the
        amount paid for the relevant product.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites or services,
        such as payment gateways or social media platforms. We are not
        responsible for the content, privacy practices, or terms of any
        third-party website, and access to such links is at your own risk.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Your use of our website is also governed by our{" "}
        <a href="/privacy">Privacy Policy</a>, which explains how we collect,
        use, and protect your personal information.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time to reflect changes in
        our business practices or applicable law. Any changes will be
        posted on this page with a revised "Last updated" date, and your
        continued use of our website after such changes constitutes
        acceptance of the updated Terms.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the People's Republic of Bangladesh. Any disputes arising
        from these Terms or your use of our website shall be subject to the
        exclusive jurisdiction of the courts of Dhaka, Bangladesh.
      </p>

      <h2>15. Contact Us</h2>
      <p>If you have any questions about these Terms & Conditions, please contact us:</p>
      <ul>
        <li>Phone: 880-1615550080 / 880-1615550079 / 880-1615550014</li>
        <li>Email: info@shahsports.com.bd</li>
        <li>Address: 223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208</li>
      </ul>
    </LegalPageLayout>
  );
}
