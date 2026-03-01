import { Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShopMegaMenu } from "./shop-mega-menu";
import { ShopMainMegaMenu } from "./shop-main-mega-menu";
import { SportsMegaMenu } from "./sports-mega-menu";
import { BrandsMegaMenu } from "./brands-mega-menu";

export function NavBar() {
  return (
    <header className="relative w-full bg-[#00072D] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Shah Sports.png"
              alt="Shah Sports"
              width={180}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e]">
                Shop <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMainMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e]">
                Fitness <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e]">
                Sports <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <SportsMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e]">
                Brands <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <BrandsMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <Link href="/about-us" className="transition-colors duration-200 hover:text-[#ffb81e]">
              About
            </Link>
            <Link href="/contact" className="transition-colors duration-200 hover:text-[#ffb81e]">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative hidden w-[300px] lg:block">
            <input
              type="text"
              placeholder="Search Products"
              className="h-10 w-full rounded-xs border-none bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-500 text-black"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/cart" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
              <ShoppingBag className="h-5 w-5" />
              <span>Cart</span>
            </Link>
            <Link href="/login" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
