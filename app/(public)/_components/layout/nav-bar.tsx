"use client";

import { Search, ShoppingBag, User, ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShopMegaMenu } from "./shop-mega-menu";
import { ShopMainMegaMenu } from "./shop-main-mega-menu";
import { SportsMegaMenu } from "./sports-mega-menu";
import { BrandsMegaMenu } from "./brands-mega-menu";
import { FloorSolutionsMegaMenu } from "./floor-solutions-mega-menu";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubMenu(null);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  return (
    <header className="relative w-full bg-[#00072D] text-white z-50">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between py-4 px-4 md:px-6">
        
        {/* Left Section: Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:gap-12">
          {/* Mobile Menu Button */}
          <button 
            className="flex items-center justify-center lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Shah Sports.png"
              alt="Shah Sports"
              width={180}
              height={50}
              className="h-8 w-auto object-contain md:h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Shop <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMainMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Fitness <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Sports <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <SportsMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Brands <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <BrandsMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            <div className="group">
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Floor Solutions <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <FloorSolutionsMegaMenu className="invisible translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
            
            
            <Link href="/about-us" className="transition-colors duration-200 hover:text-[#ffb81e]">
              About
            </Link>
            <Link href="/contact" className="transition-colors duration-200 hover:text-[#ffb81e]">
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Section: Search & Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar (Desktop) */}
          <div className="relative hidden w-[200px] xl:w-[300px] lg:block">
            <input
              type="text"
              placeholder="Search Products"
              className="h-10 w-full rounded-xs border-none bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-500 text-black"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-sm font-medium md:gap-6">
            {/* Search Icon (Mobile/Tablet) */}
            <button 
              className="lg:hidden text-white hover:text-[#ffb81e]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/cart" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
            </Link>
            <Link href="/login" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Content */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[85%] max-w-[320px] bg-white text-[#00072D] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2">
             {/* <Image
              src="/Shah Sports.png"
              alt="Shah Sports"
              width={140}
              height={40}
              className="h-8 w-auto object-contain invert brightness-0" 
            /> */}
            <Image
              src="/Shah Sports.png"
              alt="Shah Sports"
              width={140}
              height={40}
              className="h-8 w-auto object-contain md:h-12"
              priority
            />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Mobile */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search Products..."
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-[#00072D] transition-colors placeholder:text-gray-400"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 flex-1">
            {/* Shop Accordion */}
            <div className="border-b border-gray-100 py-2">
              <button 
                onClick={() => toggleSubMenu('shop')}
                className="flex w-full items-center justify-between py-2 text-base font-bold hover:text-[#ffb81e]"
              >
                Shop
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenu === 'shop' && "rotate-90")} />
              </button>
              <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 pl-4", openSubMenu === 'shop' ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden flex flex-col gap-2 text-sm text-gray-600">
                  <Link href="/shop/all" className="py-1 hover:text-[#00072D]">All Products</Link>
                  <Link href="/shop/new-arrivals" className="py-1 hover:text-[#00072D]">New Arrivals</Link>
                  <Link href="/shop/best-sellers" className="py-1 hover:text-[#00072D]">Best Sellers</Link>
                </div>
              </div>
            </div>

            {/* Fitness Accordion */}
            <div className="border-b border-gray-100 py-2">
              <button 
                onClick={() => toggleSubMenu('fitness')}
                className="flex w-full items-center justify-between py-2 text-base font-bold hover:text-[#ffb81e]"
              >
                Fitness
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenu === 'fitness' && "rotate-90")} />
              </button>
              <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 pl-4", openSubMenu === 'fitness' ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden flex flex-col gap-2 text-sm text-gray-600">
                  <div className="font-semibold text-[#00072D] mt-1">Cardio</div>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Treadmills</Link>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Ellipticals</Link>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Bikes</Link>
                  
                  <div className="font-semibold text-[#00072D] mt-2">Strength</div>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Home Gyms</Link>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Benches</Link>
                  <Link href="#" className="pl-2 py-1 hover:text-[#00072D]">Weights</Link>
                </div>
              </div>
            </div>

            {/* Sports Accordion */}
            <div className="border-b border-gray-100 py-2">
              <button 
                onClick={() => toggleSubMenu('sports')}
                className="flex w-full items-center justify-between py-2 text-base font-bold hover:text-[#ffb81e]"
              >
                Sports
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenu === 'sports' && "rotate-90")} />
              </button>
              <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 pl-4", openSubMenu === 'sports' ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden flex flex-col gap-2 text-sm text-gray-600">
                  <Link href="#" className="py-1 hover:text-[#00072D]">Cricket</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">Football</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">Badminton</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">Table Tennis</Link>
                </div>
              </div>
            </div>

            {/* Floor Solutions Accordion */}
            <div className="border-b border-gray-100 py-2">
              <button 
                onClick={() => toggleSubMenu('floor-solutions')}
                className="flex w-full items-center justify-between py-2 text-base font-bold hover:text-[#ffb81e]"
              >
                Floor Solutions
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenu === 'floor-solutions' && "rotate-90")} />
              </button>
              <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 pl-4", openSubMenu === 'floor-solutions' ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden flex flex-col gap-2 text-sm text-gray-600">
                  <div className="font-semibold text-[#00072D] mt-1">Floor Mats</div>
                  <Link href="/floor-solutions/gym-mats" className="pl-2 py-1 hover:text-[#00072D]">Gym Floor Mats</Link>
                  <Link href="/floor-solutions/rubber-mats" className="pl-2 py-1 hover:text-[#00072D]">Rubber Floor Mats</Link>
                  <Link href="/floor-solutions/yoga-mats" className="pl-2 py-1 hover:text-[#00072D]">Yoga & Pilates Mats</Link>
                  
                  <div className="font-semibold text-[#00072D] mt-2">Flooring Solutions</div>
                  <Link href="/floor-solutions/sports-court" className="pl-2 py-1 hover:text-[#00072D]">Sports Court Flooring</Link>
                  <Link href="/floor-solutions/artificial-turf" className="pl-2 py-1 hover:text-[#00072D]">Artificial Turf</Link>
                  <Link href="/floor-solutions" className="py-1 font-semibold text-[#ffb81e] mt-2">View All Solutions</Link>
                </div>
              </div>
            </div>

             {/* Brands Accordion */}
             <div className="border-b border-gray-100 py-2">
              <button 
                onClick={() => toggleSubMenu('brands')}
                className="flex w-full items-center justify-between py-2 text-base font-bold hover:text-[#ffb81e]"
              >
                Brands
                <ChevronRight className={cn("h-4 w-4 transition-transform", openSubMenu === 'brands' && "rotate-90")} />
              </button>
              <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 pl-4", openSubMenu === 'brands' ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden flex flex-col gap-2 text-sm text-gray-600">
                  <Link href="#" className="py-1 hover:text-[#00072D]">NordicTrack</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">ProForm</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">Reebok</Link>
                  <Link href="#" className="py-1 hover:text-[#00072D]">Adidas</Link>
                  <Link href="/brands" className="py-1 font-semibold text-[#ffb81e] mt-2">View All Brands</Link>
                </div>
              </div>
            </div>

            <Link href="/about-us" className="border-b border-gray-100 py-3 text-base font-bold hover:text-[#ffb81e]">
              About
            </Link>
            <Link href="/contact" className="border-b border-gray-100 py-3 text-base font-bold hover:text-[#ffb81e]">
              Contact
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col gap-3 pt-4">
            <Link href="/login" className="flex items-center justify-center gap-2 rounded-md border border-[#00072D] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#00072D] hover:text-white">
              <User className="h-4 w-4" />
              Login / Register
            </Link>
            <Link href="/cart" className="flex items-center justify-center gap-2 rounded-md bg-[#ffb81e] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#e5a61b]">
              <ShoppingBag className="h-4 w-4" />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
