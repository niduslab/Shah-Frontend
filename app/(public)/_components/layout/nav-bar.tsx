import { Search, ShoppingBag, User, ChevronDown } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="w-full bg-primary text-black">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black italic tracking-tight">
            Shah Sports
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <button className="flex items-center gap-1 hover:text-black/70">
              Shop <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 hover:text-black/70">
              Fitness <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 hover:text-black/70">
              Sports <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 hover:text-black/70">
              Brands <ChevronDown className="h-4 w-4" />
            </button>
            <Link href="/about" className="hover:text-black/70">
              About
            </Link>
            <Link href="/contact" className="hover:text-black/70">
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
              className="h-10 w-full rounded-xs border-none bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-500"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/cart" className="flex items-center gap-2 hover:text-black/70">
              <ShoppingBag className="h-5 w-5" />
              <span>Cart</span>
            </Link>
            <Link href="/login" className="flex items-center gap-2 hover:text-black/70">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
