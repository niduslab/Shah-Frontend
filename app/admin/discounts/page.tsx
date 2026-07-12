'use client';

import Link from 'next/link';
import { Percent, Zap, Ticket, ArrowRight, Tag } from 'lucide-react';

const discountSections = [
  {
    icon: Tag,
    label: 'Promotions',
    description: 'Percentage off, fixed amount, combo offers, and free delivery campaigns',
    href: '/admin/promotions',
    color: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/30',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
  },
  {
    icon: Ticket,
    label: 'Coupons',
    description: 'Generate and manage discount coupon codes for customers',
    href: '/admin/coupons',
    color: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/30',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  {
    icon: Zap,
    label: 'Flash Deals',
    description: 'Time-limited flash sales with countdown timers',
    href: '/admin/flash-deals',
    color: 'from-[#FF6F00] to-[#E65100]',
    shadow: 'shadow-orange-500/30',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
];

export default function DiscountsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discounts</h1>
              <p className="text-sm text-gray-600">Manage all discount mechanisms in one place</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {discountSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} shadow-lg ${section.shadow}`}>
                <section.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-gray-900">{section.label}</h2>
              <p className="mb-4 text-sm text-gray-500 leading-relaxed">{section.description}</p>
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${section.bg} ${section.text}`}>
                Manage {section.label}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
