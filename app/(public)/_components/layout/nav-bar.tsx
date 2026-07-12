"use client";

import { Search, ShoppingBag, User, ChevronDown, Menu, X, ChevronRight, LogOut, Settings, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/hooks/user/useWishlist";
import { useCategories } from "@/lib/hooks/public/useCategories";
import { useBrands } from "@/lib/hooks/public/useBrands";
import { ShopMegaMenu } from "./shop-mega-menu";
import { ShopMainMegaMenu } from "./shop-main-mega-menu";
import { SportsMegaMenu } from "./sports-mega-menu";
import { BrandsMegaMenu } from "./brands-mega-menu";
import { FloorSolutionsMegaMenu } from "./floor-solutions-mega-menu";
import { UserNotificationBell } from "./UserNotificationBell";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { user, logout, loading } = useAuth();
  const { data: wishlistData } = useWishlist();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const cartCount = isMounted ? getCartCount() : 0;
  const wishlistCount = user && wishlistData?.data?.length ? wishlistData.data.length : 0;

  const fitnessCategory = categoriesData?.data?.find((cat: any) => cat.slug === 'fitness' && cat.is_active);
  const fitnessGroups = (fitnessCategory?.children || [])
    .filter((child: any) => child.is_active && ['fitness-cardio', 'strength', 'free-weight'].includes(child.slug))
    .map((group: any) => ({
      name: group.name,
      slug: group.slug,
      items: (group.children || []).filter((item: any) => item.is_active),
    }));

  const sportsCategory = categoriesData?.data?.find((cat: any) => cat.slug === 'sports' && cat.is_active);
  const sportsItems = (sportsCategory?.children || []).filter((child: any) => child.is_active);

  const mobileBrands = (brandsData?.data || []).slice(0, 4);

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubMenu(null);
    setShowUserMenu(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

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

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Priority: first_name > name > email
    if (user.first_name) {
      return user.first_name;
    }
    if (user.name) {
      return user.name.split(' ')[0]; // Get first part of full name
    }
    return user.email.split('@')[0]; // Use email username as fallback
  };

  const getNavbarLabel = () => {
    if (!user) return 'Login';
    
    if (user.user_type === 'admin') {
      return 'Dashboard';
    }
    
    return getUserDisplayName();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.user_type === 'admin' ? '/admin' : '/dashboard';
  };

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setIsMobileMenuOpen(false);
      window.location.href = `/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 w-full bg-[#00072D] text-white z-50">
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
              src="/shah_sports_logo_main.svg"
              alt="Shah Sports"
              width={220}
              height={82}
              className="h-10 w-auto object-contain md:h-16"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <div 
              className="group"
              onMouseEnter={() => setActiveMegaMenu('shop')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Shop <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMainMegaMenu 
                className={cn(
                  "transition-all duration-300",
                  activeMegaMenu === 'shop' 
                    ? "visible translate-y-0 opacity-100" 
                    : "invisible translate-y-2 opacity-0"
                )}
                onLinkClick={() => setActiveMegaMenu(null)}
              />
            </div>
            <div 
              className="group"
              onMouseEnter={() => setActiveMegaMenu('fitness')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Fitness <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <ShopMegaMenu 
                className={cn(
                  "transition-all duration-300",
                  activeMegaMenu === 'fitness' 
                    ? "visible translate-y-0 opacity-100" 
                    : "invisible translate-y-2 opacity-0"
                )}
                onLinkClick={() => setActiveMegaMenu(null)}
              />
            </div>
            <div 
              className="group"
              onMouseEnter={() => setActiveMegaMenu('sports')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Sports <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <SportsMegaMenu 
                className={cn(
                  "transition-all duration-300",
                  activeMegaMenu === 'sports' 
                    ? "visible translate-y-0 opacity-100" 
                    : "invisible translate-y-2 opacity-0"
                )}
                onLinkClick={() => setActiveMegaMenu(null)}
              />
            </div>
            <div 
              className="group"
              onMouseEnter={() => setActiveMegaMenu('brands')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Brands <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <BrandsMegaMenu 
                className={cn(
                  "transition-all duration-300",
                  activeMegaMenu === 'brands' 
                    ? "visible translate-y-0 opacity-100" 
                    : "invisible translate-y-2 opacity-0"
                )}
                onLinkClick={() => setActiveMegaMenu(null)}
              />
            </div>
            <div 
              className="group"
              onMouseEnter={() => setActiveMegaMenu('flooring')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 transition-colors duration-200 hover:text-[#ffb81e] group-hover:text-[#ffb81e] py-4">
                Flooring <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              <FloorSolutionsMegaMenu 
                className={cn(
                  "transition-all duration-300",
                  activeMegaMenu === 'flooring' 
                    ? "visible translate-y-0 opacity-100" 
                    : "invisible translate-y-2 opacity-0"
                )}
                onLinkClick={() => setActiveMegaMenu(null)}
              />
            </div>
            
            
            {/* <Link href="/about-us" className="transition-colors duration-200 hover:text-[#ffb81e]">
              About
            </Link>
            <Link href="/contact" className="transition-colors duration-200 hover:text-[#ffb81e]">
              Contact
            </Link> */}
          </nav>
        </div>

        {/* Right Section: Search & Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar (Desktop) */}
          <form onSubmit={handleDesktopSearch} className="relative hidden w-[100px] xl:w-[300px] lg:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Products"
              className="h-10 w-full rounded-xs border-none bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-500 text-black"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4 text-sm font-medium md:gap-6">
            {/* Search Icon (Mobile/Tablet) */}
            <button 
              className="lg:hidden text-white hover:text-[#ffb81e]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist - Only show for logged in users */}
            {user && (
              <Link href="/dashboard/wishlist" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>
                {/* <span className="hidden md:inline">Wishlist</span> */}
              </Link>
            )}

            <Link href="/cart" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffb81e] text-xs font-bold text-[#00072D]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              {/* <span className="hidden md:inline">Cart</span> */}
            </Link>

            {/* Notification Bell - Only show for logged in users */}
            {user && <UserNotificationBell />}
            
            {/* User Menu */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative user-menu-container">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">{getNavbarLabel()}</span>
                      <ChevronDown className="h-4 w-4 hidden md:inline" />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link 
                          href={getDashboardLink()}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          {user.user_type === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 transition-colors duration-200 hover:text-[#ffb81e]">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">Login</span>
                  </Link>
                )}
              </>
            )}
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
            <Image
              src="/shah_sports_logo_main.svg"
              alt="Shah Sports"
              width={140}
              height={52}
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
          <form onSubmit={handleMobileSearch} className="relative mb-3">
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search Products..."
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-[#00072D] transition-colors placeholder:text-gray-400"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </form>

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
                  {fitnessGroups.map((group: any) => (
                    <div key={group.slug}>
                      <div className="font-semibold text-[#00072D] mt-1">{group.name}</div>
                      {group.items.length > 0 ? (
                        group.items.map((item: any) => (
                          <Link key={item.slug} href={`/shop?category=${item.slug}`} className="block pl-2 py-1 hover:text-[#00072D]">{item.name}</Link>
                        ))
                      ) : (
                        <Link href={`/shop?category=${group.slug}`} className="block pl-2 py-1 hover:text-[#00072D]">View All</Link>
                      )}
                    </div>
                  ))}
                  {fitnessCategory && (
                    <Link href={`/shop?category=${fitnessCategory.slug}`} className="py-1 font-semibold text-[#ffb81e] mt-2">Shop All Fitness</Link>
                  )}
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
                  {sportsItems.map((item: any) => (
                    <Link key={item.slug} href={`/shop?category=${item.slug}`} className="py-1 hover:text-[#00072D]">{item.name}</Link>
                  ))}
                  {sportsCategory && (
                    <Link href={`/shop?category=${sportsCategory.slug}`} className="py-1 font-semibold text-[#ffb81e] mt-2">Shop All Sports</Link>
                  )}
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
                  {mobileBrands.map((brand: any) => (
                    <Link key={brand.slug} href={`/brand/${brand.slug}`} className="py-1 hover:text-[#00072D]">{brand.name}</Link>
                  ))}
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
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-md mb-3">
                      <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-[#ffb81e] font-medium mt-1">
                        {user.user_type === 'admin' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                    <Link 
                      href={getDashboardLink()}
                      className="flex items-center justify-center gap-2 rounded-md border border-[#00072D] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#00072D] hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      {user.user_type === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-md border border-red-500 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center justify-center gap-2 rounded-md border border-[#00072D] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#00072D] hover:text-white">
                    <User className="h-4 w-4" />
                    Login / Register
                  </Link>
                )}
              </>
            )}
            {user && (
              <Link href="/dashboard/wishlist" className="flex items-center justify-center gap-2 rounded-md border border-[#00072D] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#00072D] hover:text-white">
                <div className="relative">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>
                Wishlist
              </Link>
            )}
            <Link href="/cart" className="flex items-center justify-center gap-2 rounded-md bg-[#ffb81e] py-2.5 text-sm font-bold text-[#00072D] transition-colors hover:bg-[#e5a61b]">
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#00072D] text-[10px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
