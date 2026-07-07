"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    category: "Orders & Payment",
    items: [
      {
        question: "How do I place an order on Shah Sports?",
        answer:
          "Browse our Shop page, add products to your cart, and proceed to checkout. Fill in your delivery details, choose a payment method, and confirm your order. You'll receive a confirmation via SMS or email once it's placed.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bKash, Nagad, debit/credit cards, bank transfer, and Cash on Delivery (COD) in most serviceable areas across Bangladesh.",
      },
      {
        question: "Can I cancel or change my order after placing it?",
        answer:
          "You can request a cancellation or change as long as the order hasn't been dispatched. Please contact our support team as soon as possible with your order number so we can assist before it ships.",
      },
      {
        question: "Will I get an invoice for my order?",
        answer:
          "Yes, an invoice is generated automatically and is available from your account under Dashboard → Orders, and can also be viewed on our invoice page after checkout.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Inside Dhaka City, delivery usually takes 1–3 business days after dispatch. Outside Dhaka, it typically takes 3–6 business days, and remote areas may take 5–10 business days. See our Shipping Policy for full details.",
      },
      {
        question: "Do you deliver across all of Bangladesh?",
        answer:
          "Yes, we deliver nationwide through our own delivery team and trusted courier partners. Availability for very remote areas will be confirmed at checkout or by our support team.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once dispatched, you'll receive tracking details via SMS or email. You can also check your order status anytime on our Track Your Order page using your order number.",
      },
      {
        question: "Is Cash on Delivery (COD) available?",
        answer:
          "Yes, COD is available in most serviceable areas. Our delivery agent will contact you before arrival, so please ensure someone is available to receive and inspect the package.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "You can request a return within 7 days of delivery, provided the product is unused and in its original packaging with all accessories and tags intact. See our Return & Refund Policy for full eligibility details.",
      },
      {
        question: "What if I receive a damaged or wrong item?",
        answer:
          "Please contact us within 48 hours of delivery with your order number and photos or a short video of the item. We'll arrange a free pickup and provide a replacement, repair, or full refund.",
      },
      {
        question: "How long does a refund take?",
        answer:
          "Once your return is approved, refunds are processed within 7–10 business days — back to your original payment method for prepaid orders, or via bKash/Nagad/bank transfer for COD orders.",
      },
    ],
  },
  {
    category: "Products & Warranty",
    items: [
      {
        question: "Are your products genuine and covered by warranty?",
        answer:
          "Yes, we only sell genuine products sourced from authorised manufacturers and distributors. Most equipment carries a manufacturer or Shah Sports service warranty — details are included with the product at purchase.",
      },
      {
        question: "Do you offer installation for gym equipment?",
        answer:
          "For large equipment such as treadmills, multi-gyms, and flooring solutions, our team may contact you to schedule delivery and, where applicable, arrange installation or setup support.",
      },
      {
        question: "Can I visit a physical store to see the products?",
        answer:
          "Absolutely! You're welcome to visit our showroom at 223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208. See our Our Store page for directions and store hours.",
      },
    ],
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex flex-col gap-10">
      {faqData.map((group) => (
        <div key={group.category}>
          <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
            {group.category}
          </h2>
          <div className="flex flex-col gap-3">
            {group.items.map((item, idx) => {
              const key = `${group.category}-${idx}`;
              const isOpen = openIndex === key;
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-lg border border-border bg-white"
                >
                  <button
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:text-[#a56a00] transition-colors md:text-base"
                    aria-expanded={isOpen}
                  >
                    {item.question}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-[#ffb81e] transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
