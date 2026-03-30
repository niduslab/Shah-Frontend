"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { useBrands } from "@/lib/hooks/public/useBrands";
import { useCategories } from "@/lib/hooks/public/useCategories";

const FILTERS = {
  availability: [
    { label: "In Stock", value: true },
    { label: "Out of Stock", value: false },
  ],
};

interface ShopSidebarProps {
  onPriceRangeChange?: (min: number | undefined, max: number | undefined) => void;
  onAvailabilityChange?: (inStock: boolean | undefined) => void;
  onBrandChange?: (brandId: number | undefined) => void;
  onCategoryChange?: (categoryId: number | undefined) => void;
  onPreorderChange?: (isPreorder: boolean | undefined) => void;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-lg font-bold text-black">{title}</h3>
        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
      <div className={`mt-4 space-y-3 ${isOpen ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

function CheckboxItem({ label, count, checked, onChange }: { label: string; count?: number; checked?: boolean; onChange?: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input 
            type="checkbox" 
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            className="peer h-5 w-5 appearance-none rounded-sm border border-gray-200 checked:bg-black checked:border-black transition-colors" 
          />
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="12"
            height="12"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span className="text-[15px] text-gray-600 group-hover:text-black">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-400">({count < 10 ? `0${count}` : count})</span>
      )}
    </label>
  );
}

export function ShopSidebar({ onPriceRangeChange, onAvailabilityChange, onBrandChange, onCategoryChange, onPreorderChange }: ShopSidebarProps) {
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState<boolean | undefined>();
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedPreorder, setSelectedPreorder] = useState<boolean | undefined>();
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Fetch brands and categories
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const brands = (brandsData as any)?.data || [];
  const categories = (categoriesData as any)?.data || [];

  const handlePriceChange = () => {
    const min = minPriceInput ? parseFloat(minPriceInput) : undefined;
    const max = maxPriceInput ? parseFloat(maxPriceInput) : undefined;
    onPriceRangeChange?.(min, max);
  };

  const handleAvailabilityClick = (value: boolean) => {
    if (selectedAvailability === value) {
      setSelectedAvailability(undefined);
      onAvailabilityChange?.(undefined);
    } else {
      setSelectedAvailability(value);
      onAvailabilityChange?.(value);
    }
  };

  const handleBrandClick = (brandId: number) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined);
      onBrandChange?.(undefined);
    } else {
      setSelectedBrand(brandId);
      onBrandChange?.(brandId);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
      onCategoryChange?.(undefined);
    } else {
      setSelectedCategory(categoryId);
      onCategoryChange?.(categoryId);
    }
  };

  const handlePreorderClick = (value: boolean) => {
    if (selectedPreorder === value) {
      setSelectedPreorder(undefined);
      onPreorderChange?.(undefined);
    } else {
      setSelectedPreorder(value);
      onPreorderChange?.(value);
    }
  };

  // Trigger price change when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePriceChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [minPriceInput, maxPriceInput]);

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      {/* Availability */}
      <FilterSection title="Availability">
        {FILTERS.availability.map((item) => (
          <CheckboxItem 
            key={item.label} 
            label={item.label} 
            checked={selectedAvailability === item.value}
            onChange={() => handleAvailabilityClick(item.value)}
          />
        ))}
      </FilterSection>

      {/* Pre-Order */}
      <FilterSection title="Pre-Order">
        <CheckboxItem 
          label="Pre-Order Items" 
          checked={selectedPreorder === true}
          onChange={() => handlePreorderClick(true)}
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Min Price</label>
              <input
                type="number"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="$0"
                className="w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-600 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Max Price</label>
              <input
                type="number"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="$1000"
                className="w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-600 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
          {(minPriceInput || maxPriceInput) && (
            <button
              onClick={() => {
                setMinPriceInput("");
                setMaxPriceInput("");
                onPriceRangeChange?.(undefined, undefined);
              }}
              className="mt-3 text-xs text-gray-500 hover:text-black underline"
            >
              Clear price filter
            </button>
          )}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        {brands.length > 0 ? (
          <>
            {(showAllBrands ? brands : brands.slice(0, 8)).map((brand: any) => (
              <CheckboxItem 
                key={brand.id} 
                label={brand.name} 
                count={brand.products_count}
                checked={selectedBrand === brand.id}
                onChange={() => handleBrandClick(brand.id)}
              />
            ))}
            {brands.length > 8 && (
              <button 
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-sm font-medium text-black underline mt-2"
              >
                {showAllBrands ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">No brands available</p>
        )}
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && categories.map((category: any) => (
        <FilterSection key={category.id} title={category.name}>
          {/* Parent Category */}
          <CheckboxItem 
            label={`All ${category.name}`}
            count={category.products_count}
            checked={selectedCategory === category.id}
            onChange={() => handleCategoryClick(category.id)}
          />
          
          {/* Child Categories */}
          {category.children && category.children.length > 0 && (
            <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
              {category.children.map((child: any) => (
                <CheckboxItem 
                  key={child.id}
                  label={child.name}
                  count={child.products_count}
                  checked={selectedCategory === child.id}
                  onChange={() => handleCategoryClick(child.id)}
                />
              ))}
            </div>
          )}
        </FilterSection>
      ))}
    </div>
  );
}
