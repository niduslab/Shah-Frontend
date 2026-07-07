import { Metadata } from "next";
import { LegalPageLayout } from "@/app/(public)/_components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Shipping Policy | Shah Sports",
  description:
    "Shah Sports Shipping Policy — delivery areas, timelines, charges, and order tracking for fitness and sports equipment across Bangladesh.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping Policy"
      subtitle="Everything you need to know about how we pack, ship, and deliver your order across Bangladesh."
      lastUpdated="7 July 2026"
    >
      <h2>1. Delivery Coverage</h2>
      <p>
        We currently deliver across Bangladesh, including Dhaka and all major
        divisions and districts, through our own delivery team and trusted
        courier partners. Delivery availability for remote areas may vary and
        will be confirmed at checkout or by our support team.
      </p>

      <h2>2. Processing Time</h2>
      <p>
        Orders are typically processed and dispatched within{" "}
        <strong>1–2 business days</strong> of confirmation. Orders placed on
        Fridays, government holidays, or during high-demand campaigns (such
        as flash sales) may require additional processing time.
      </p>

      <h2>3. Estimated Delivery Time</h2>
      <ul>
        <li>
          <strong>Inside Dhaka City:</strong> 1–3 business days after
          dispatch
        </li>
        <li>
          <strong>Outside Dhaka (major districts):</strong> 3–6 business days
          after dispatch
        </li>
        <li>
          <strong>Remote or hard-to-reach areas:</strong> 5–10 business days
          after dispatch
        </li>
        <li>
          <strong>Large or bulky items</strong> (e.g. treadmills, gym
          equipment, flooring): may require additional time for freight
          scheduling and installation coordination
        </li>
      </ul>
      <p>
        Delivery timelines are estimates and may be affected by weather,
        courier delays, public holidays, or circumstances beyond our control.
      </p>

      <h2>4. Shipping Charges</h2>
      <p>
        Shipping charges are calculated based on the delivery location,
        product size/weight, and order value, and will be clearly shown at
        checkout before you confirm your order. We may offer free or
        discounted shipping during promotional campaigns, which will be
        indicated on the relevant product or offer page.
      </p>

      <h2>5. Order Tracking</h2>
      <p>
        Once your order is dispatched, you will receive a confirmation with
        your courier and tracking details (where applicable) via SMS, email,
        or phone call. You can also check your order status anytime on our{" "}
        <a href="/track-order">Track Your Order</a> page using your order
        number.
      </p>

      <h2>6. Large Equipment & Installation</h2>
      <p>
        For heavy or large equipment such as treadmills, multi-gyms, and
        flooring solutions, our team may contact you in advance to schedule a
        convenient delivery time and, where applicable, arrange installation
        or setup support.
      </p>

      <h2>7. Cash on Delivery (COD)</h2>
      <p>
        Cash on Delivery is available in most serviceable areas across
        Bangladesh. Our delivery agent will contact you before arrival —
        please ensure someone is available to receive and inspect the
        package upon delivery.
      </p>

      <h2>8. Delayed or Missing Deliveries</h2>
      <p>
        If your order has not arrived within the estimated delivery window,
        please contact our support team with your order number so we can
        investigate with our courier partner and provide an update as
        quickly as possible.
      </p>

      <h2>9. Failed Delivery Attempts</h2>
      <p>
        If a delivery attempt is unsuccessful due to an incorrect address,
        unreachable phone number, or the recipient being unavailable, our
        courier partner will attempt to reschedule. Repeated failed attempts
        may result in the order being returned to our warehouse, and
        additional re-delivery charges may apply.
      </p>

      <h2>10. Questions About Your Delivery</h2>
      <p>For any shipping-related questions, feel free to reach out:</p>
      <ul>
        <li>Phone: 880-1615550080 / 880-1615550079 / 880-1615550014</li>
        <li>Email: info@shahsports.com.bd</li>
        <li>Address: 223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208</li>
      </ul>
    </LegalPageLayout>
  );
}
