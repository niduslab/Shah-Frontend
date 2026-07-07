import { Metadata } from "next";
import { LegalPageLayout } from "@/app/(public)/_components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Shah Sports",
  description:
    "Read Shah Sports' Return & Refund Policy for eligibility, timelines, and the process for returning or exchanging fitness and sports equipment in Bangladesh.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Return & Refund Policy"
      subtitle="We want you to be completely satisfied with your purchase. Please review our return and refund terms below."
      lastUpdated="7 July 2026"
    >
      <h2>1. Overview</h2>
      <p>
        At Shah Sports, we take pride in the quality of the fitness and sports
        equipment we sell. If you are not fully satisfied with your purchase,
        this policy explains when and how you can request a return, exchange,
        or refund on orders placed through our website or authorised sales
        channels within Bangladesh.
      </p>

      <h2>2. Return Eligibility</h2>
      <p>You may request a return within the following conditions:</p>
      <ul>
        <li>
          The return request is made within <strong>7 days</strong> of the
          delivery date.
        </li>
        <li>
          The product is unused, uninstalled, and in its original condition
          with all tags, manuals, warranty cards, and accessories intact.
        </li>
        <li>
          The product is returned in its original packaging, including outer
          cartons and protective packing material.
        </li>
        <li>
          The item is not listed under our{" "}
          <strong>Non-Returnable Items</strong> (Section 3).
        </li>
        <li>Proof of purchase (invoice or order number) is provided.</li>
      </ul>

      <h2>3. Non-Returnable Items</h2>
      <p>For hygiene, safety, and customisation reasons, the following items cannot be returned unless they arrive damaged or defective:</p>
      <ul>
        <li>Innerwear, gym gloves, and personal-use accessories</li>
        <li>Used or installed treadmills, exercise bikes, and gym equipment</li>
        <li>Items marked as "Final Sale" or purchased during clearance/flash sales</li>
        <li>Custom-built or made-to-order flooring and matting solutions</li>
        <li>Gift cards and downloadable/digital products</li>
      </ul>

      <h2>4. Damaged, Defective, or Incorrect Items</h2>
      <p>
        If you receive a product that is damaged in transit, defective, or
        different from what you ordered, please contact us within{" "}
        <strong>48 hours</strong> of delivery with your order number and clear
        photos or a short video of the item and its packaging. We will
        arrange a free pickup and provide a replacement, repair, or full
        refund, depending on product availability and your preference.
      </p>

      <h2>5. How to Initiate a Return</h2>
      <ol>
        <li>
          Contact our support team via phone, email, or the Contact Us page
          with your order number and reason for return.
        </li>
        <li>Our team will review your request and confirm eligibility within 1–2 business days.</li>
        <li>
          Once approved, we will schedule a pickup (in eligible delivery
          areas) or share drop-off instructions for our nearest service point.
        </li>
        <li>
          The returned item will be inspected upon receipt at our warehouse
          before the refund or exchange is processed.
        </li>
      </ol>

      <h2>6. Refund Method & Timeline</h2>
      <p>Once your return is received and inspected, we will notify you of the approval status. Approved refunds are processed as follows:</p>
      <ul>
        <li>
          <strong>Prepaid orders (bKash, Nagad, card, or bank transfer):</strong>{" "}
          refunded to the original payment method within 7–10 business days.
        </li>
        <li>
          <strong>Cash on Delivery (COD) orders:</strong> refunded via bKash,
          Nagad, or bank transfer to an account you provide, within 7–10
          business days of approval.
        </li>
        <li>
          Original delivery charges are non-refundable unless the return is
          due to our error (damaged, defective, or incorrect item).
        </li>
        <li>
          Return pickup/courier charges for change-of-mind returns may be
          deducted from the refund amount.
        </li>
      </ul>

      <h2>7. Exchanges</h2>
      <p>
        We are happy to offer a size, colour, or model exchange, subject to
        stock availability, under the same eligibility conditions listed in
        Section 2. If the new item has a price difference, the balance will
        either be collected or refunded accordingly.
      </p>

      <h2>8. Warranty Claims</h2>
      <p>
        Many of our products carry a manufacturer or Shah Sports service
        warranty against manufacturing defects. Warranty claims are handled
        separately from returns — please refer to the warranty card included
        with your product or contact our support team for warranty service
        and repair options.
      </p>

      <h2>9. Need Help?</h2>
      <p>
        Our customer support team is here to help with any return, refund, or
        exchange questions:
      </p>
      <ul>
        <li>Phone: 880-1615550080 / 880-1615550079 / 880-1615550014</li>
        <li>Email: info@shahsports.com.bd</li>
        <li>Address: 223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208</li>
      </ul>
      <p>
        You can also track the status of your order anytime from our{" "}
        <a href="/track-order">Track Your Order</a> page.
      </p>
    </LegalPageLayout>
  );
}
