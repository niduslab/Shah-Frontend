import { Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="w-full bg-[#00072D] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black italic tracking-tight">
            Shah Sports
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <button className="group flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e]">
              Shop <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <button className="group flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e]">
              Fitness <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <button className="group flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e]">
              Sports <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <button className="group flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e]">
              Brands <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <Link href="/about" className="transition-colors duration-200 hover:text-[#ffb81e]">
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
