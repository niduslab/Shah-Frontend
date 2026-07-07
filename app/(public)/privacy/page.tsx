import { Metadata } from "next";
import { LegalPageLayout } from "@/app/(public)/_components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Shah Sports",
  description:
    "Learn how Shah Sports collects, uses, stores, and protects your personal information when you shop with us online or in-store.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains how we collect, use, and protect your personal information."
      lastUpdated="7 July 2026"
    >
      <h2>1. Introduction</h2>
      <p>
        Shah Sports ("we", "us", or "our") respects your privacy and is
        committed to protecting the personal information you share with us
        when you visit our website, place an order, or otherwise interact
        with our business. This Privacy Policy explains what information we
        collect, how we use it, and the choices you have.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Personal details:</strong> name, phone number, email
          address, and delivery/billing address provided during account
          registration, checkout, or customer support requests.
        </li>
        <li>
          <strong>Order information:</strong> products purchased, order
          history, payment method (e.g. bKash, Nagad, card, or Cash on
          Delivery), and transaction status.
        </li>
        <li>
          <strong>Device and usage data:</strong> IP address, browser type,
          pages visited, and referring website, collected automatically
          through cookies and similar technologies.
        </li>
        <li>
          <strong>Communications:</strong> messages you send us via contact
          forms, email, phone, or WhatsApp for support or inquiries.
        </li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process, confirm, and deliver your orders</li>
        <li>Provide customer support and respond to inquiries</li>
        <li>Send order updates, delivery notifications, and invoices</li>
        <li>Improve our website, products, and customer experience</li>
        <li>
          Send promotional offers, discounts, and updates, where you have
          opted in to receive them
        </li>
        <li>Detect, prevent, and address fraud, abuse, or security issues</li>
        <li>Comply with applicable legal and regulatory requirements</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use cookies and similar technologies to keep you signed in,
        remember your cart and preferences, and understand how visitors use
        our website so we can improve it. You can control or disable cookies
        through your browser settings; however, some parts of the website may
        not function properly without them.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>We do not sell your personal information. We may share your information only with:</p>
      <ul>
        <li>
          <strong>Delivery and courier partners</strong>, to fulfil and
          deliver your order
        </li>
        <li>
          <strong>Payment processors</strong> (such as bKash, Nagad, or card
          payment gateways), to securely process transactions
        </li>
        <li>
          <strong>Service providers</strong> who support our IT, hosting,
          analytics, and customer support operations
        </li>
        <li>
          <strong>Government or regulatory authorities</strong>, where
          required by law
        </li>
      </ul>

      <h2>6. Data Storage & Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical
        safeguards to protect your personal information from unauthorised
        access, alteration, disclosure, or destruction. Payment details are
        processed through secure, PCI-compliant payment gateways and are not
        stored on our servers.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to
        fulfil the purposes described in this policy, including maintaining
        order records, complying with legal obligations, resolving disputes,
        and enforcing our agreements.
      </p>

      <h2>8. Your Rights & Choices</h2>
      <p>You may, at any time:</p>
      <ul>
        <li>Request access to, or a copy of, the personal information we hold about you</li>
        <li>Request correction of inaccurate or incomplete information</li>
        <li>Request deletion of your account and associated personal data, subject to legal record-keeping requirements</li>
        <li>Opt out of marketing communications by using the unsubscribe link or contacting us directly</li>
      </ul>

      <h2>9. Children's Privacy</h2>
      <p>
        Our website and services are not directed at children under 18. We do
        not knowingly collect personal information from children. If you
        believe a child has provided us with personal information, please
        contact us so we can remove it.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect
        changes in our practices or for legal and regulatory reasons. The
        updated version will be posted on this page with a revised "Last
        updated" date.
      </p>

      <h2>11. Contact Us</h2>
      <p>If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us:</p>
      <ul>
        <li>Phone: 880-1615550080 / 880-1615550079 / 880-1615550014</li>
        <li>Email: info@shahsports.com.bd</li>
        <li>Address: 223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208</li>
      </ul>
    </LegalPageLayout>
  );
}
