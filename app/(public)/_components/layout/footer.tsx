import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import { getSiteSettings } from "@/lib/data/site-settings";

const DEFAULT_CONTACT = {
  email: "info@shahsports.com.bd",
  phone: "880-1615550080 | 880-1615550079 | 880-1615550014",
  address: "223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208",
};

export async function Footer() {
  const settings = await getSiteSettings();

  const contactEmail = settings?.contact_email || DEFAULT_CONTACT.email;
  const contactPhone = settings?.contact_phone || DEFAULT_CONTACT.phone;
  const contactAddress = settings?.contact_address || DEFAULT_CONTACT.address;
  const bannerUrl = settings?.payment_banner_url || "/ssl-payment-banner.png";

  const socialLinks = [
    { label: "Facebook", href: settings?.facebook_url, icon: Facebook },
    { label: "Twitter", href: settings?.twitter_url, icon: Twitter },
    { label: "Instagram", href: settings?.instagram_url, icon: Instagram },
    { label: "YouTube", href: settings?.youtube_url, icon: Youtube },
    { label: "LinkedIn", href: settings?.linkedin_url, icon: Linkedin },
  ].filter((link): link is typeof link & { href: string } => !!link.href);

  return (
    <footer className="bg-black pt-16 pb-8 text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Image
                src="/shah_sports_logo_main.svg"
                alt="Shah Sports"
                width={220}
                height={82}
                className="h-12 object-contain md:h-16"
              />
              <p className="text-sm leading-relaxed text-gray-300">
                Your trusted partner for premium fitness and sports equipment.
                Quality products for champions.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                <span>{contactAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <span>{contactPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <span>{contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-6 lg:pl-8">
            <h4 className="text-lg font-bold text-white">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li>
                <Link href="/about-us" className="hover:text-[#FFB81E] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FFB81E] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFB81E] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFB81E] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Categories</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li>
                <Link href="/kino-map" className="hover:text-[#FFB81E] transition-colors">
                  Kinomap
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FFB81E] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fitness" className="hover:text-[#FFB81E] transition-colors">
                  Fitness Equipment
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sports" className="hover:text-[#FFB81E] transition-colors">
                  Sports Equipment
                </Link>
              </li>
              <li>
                <Link href="/flooring-solution" className="hover:text-[#FFB81E] transition-colors">
                  Floor Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Support</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li>
                <Link href="/track-order" className="hover:text-[#FFB81E] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#FFB81E] transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FFB81E] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFB81E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#FFB81E] transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/10" />

        {/* Payment Methods */}
        <div className="relative h-10 w-full overflow-hidden rounded-md bg-white px-4 py-2 shadow-sm sm:h-12">
          {settings?.payment_banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bannerUrl}
              alt="Secure Payment Methods"
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={bannerUrl}
              alt="Secure Payment Methods"
              fill
              sizes="100vw"
              className="object-contain"
            />
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Copyright */}
          <div className="text-sm text-white text-center sm:text-left">
            © 2026 <span className="text-[#FFB81E] font-semibold italic">SHAH SPORTS</span>. All Rights Reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#FFB81E] hover:text-black"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
