import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  X,
} from "lucide-react";

const paymentIcons = [
  "0dd985e0215b5375d8d573ca2747dca2af836e06.png",
  "2819c9145472451a723c851e22dcce638ea34c69.png",
  "79448ce2dbf0ed6d9067fed09f64cda69dd2ac73.png",
  "849c427528bfc16e5711cbbc588caaba6ba79d59.png",
  "9f8e8aad57ba62f08f2fc5dc9db364f4a95ae67e.png",
  "cb78c8a2edf8aa85749b58131b52675510c4f58e.png",
  "cf64151b6505f59c3c5484f2744b4ec066a4a69f.png",
];

export function Footer() {
  return (
    <footer className="bg-black pt-16 pb-8 text-white">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-bold italic tracking-tight text-[#FFB81E]">
                Shah Sports
              </h2>
              <p className="text-sm leading-relaxed text-gray-300">
                Your trusted partner for premium fitness and sports equipment.
                Quality products for champions.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />
                <span>
                  223/A, Tejgaon Industrial Area, Gulshan Link Road, Dhaka-1208
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <span>880-1615550080 | 880-1615550079 | 880-1615550014</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <span>info@shahsports.com.bd</span>
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
                  Faq
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFB81E] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-[#FFB81E] transition-colors">
                  Our Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white">Categories</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li>
                <Link href="/products" className="hover:text-[#FFB81E] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/cardio" className="hover:text-[#FFB81E] transition-colors">
                  Cardio Equipment
                </Link>
              </li>
              <li>
                <Link href="/category/free-weights" className="hover:text-[#FFB81E] transition-colors">
                  Free Weights
                </Link>
              </li>
              <li>
                <Link href="/category/strength" className="hover:text-[#FFB81E] transition-colors">
                  Strength Training
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="hover:text-[#FFB81E] transition-colors">
                  Sports Equipment
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
                  Refubd & Return
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FFB81E] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFB81E] transition-colors">
                  Terms & Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#FFB81E] transition-colors">
                  Shiping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white hover:text-[#FFB81E] transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-[#FFB81E] transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-[#FFB81E] transition-colors">
              <X className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-white hover:text-[#FFB81E] transition-colors">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white">
            © 2026 <span className="text-[#FFB81E] font-semibold italic">SHAH SPORTS</span>. All Rights Reserved.
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            {paymentIcons.map((icon, index) => (
              <div
                key={index}
                className="relative h-8 w-12 overflow-hidden rounded-xs bg-white"
              >
                <Image
                  src={`/images/payment-icon/${icon}`}
                  alt="Payment Method"
                  fill
                  className="object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
