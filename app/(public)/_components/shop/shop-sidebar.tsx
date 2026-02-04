"use client";

import { useState } from "react";
import { Minus, Plus, Search } from "lucide-react";

const FILTERS = {
  availability: [
    { label: "In Stock", count: 55 },
    { label: "Out of Stock", count: 8 },
  ],
  brand: [
    { label: "Addidas", count: 24 },
    { label: "Shua", count: 37 },
    { label: "Reebok", count: 20 },
    { label: "NordicTrack", count: 12 },
    { label: "UFC", count: 35 },
    { label: "Wave", count: 10 },
    { label: "Spirit", count: 73 },
    { label: "XPD", count: 10 },
  ],
  color: [
    { label: "Black", color: "#000000", count: 22 },
    { label: "Green", color: "#22c55e", count: 14 },
    { label: "Purple", color: "#a855f7", count: 11 },
    { label: "Blue", color: "#3b82f6", count: 7 },
    { label: "Red", color: "#ef4444", count: 25 },
    { label: "Brown", color: "#a16207", count: 10 },
    { label: "Teal", color: "#14b8a6", count: 6 },
    { label: "Orange", color: "#f97316", count: 32 },
  ],
  size: [
    { label: "XS", count: 14 },
    { label: "S", count: 13 },
    { label: "M", count: 12 },
    { label: "L", count: 17 },
    { label: "XL", count: 16 },
  ],
  categories: {
    cardio: [
      { label: "Bike", count: 14 },
      { label: "Treadmill", count: 13 },
      { label: "Elliptical", count: 12 },
      { label: "Rowing Machine", count: 17 },
    ],
    strength: [
      { label: "Setectorized Series", count: 14 },
      { label: "Plate Loaded Series", count: 14 },
      { label: "Hammer Series", count: 13 },
      { label: "Multi Station Gym", count: 12 },
      { label: "Functional Trainer", count: 17 },
    ],
    freeWeight: [
      { label: "Dumbbell", count: 14 },
      { label: "Barbell", count: 14 },
      { label: "Bench", count: 13 },
      { label: "Weight Plate", count: 12 },
      { label: "Fitness Accessories", count: 36 },
    ],
    sports: [
      { label: "Cricket", count: 14 },
      { label: "Football", count: 14 },
      { label: "Table Tennis", count: 12 },
      { label: "Hockey", count: 36 },
      { label: "Basketball", count: 13 },
      { label: "Boxing", count: 36 },
      { label: "Billiards", count: 36 },
      { label: "Swimming", count: 36 },
    ],
  },
};

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

function CheckboxItem({ label, count }: { label: string; count: number }) {
  return (
    <label className="flex cursor-pointer items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input type="checkbox" className="peer h-5 w-5 appearance-none rounded-sm border border-gray-200 checked:bg-black checked:border-black transition-colors" />
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
      <span className="text-sm text-gray-400">({count < 10 ? `0${count}` : count})</span>
    </label>
  );
}

export function ShopSidebar() {
  const [priceRange, setPriceRange] = useState([0, 0]);

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      {/* Availability */}
      <FilterSection title="Availability">
        {FILTERS.availability.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <div className="relative mb-6 h-1 w-full rounded-full bg-gray-200">
            <div className="absolute left-0 right-0 h-full rounded-full bg-black"></div>
            <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow-sm"></div>
            <div className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white shadow-sm"></div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value="$0.00"
                readOnly
                className="w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-center text-gray-600"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value="$0.00"
                readOnly
                className="w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-center text-gray-600"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        {FILTERS.brand.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
        <button className="text-sm font-medium text-black underline mt-2">Show More</button>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        {FILTERS.color.map((item) => (
          <label key={item.label} className="flex cursor-pointer items-center justify-between group">
            <div className="flex items-center gap-3">
              <div
                className="h-5 w-5 rounded-sm border border-gray-200"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[15px] text-gray-600 group-hover:text-black">{item.label}</span>
            </div>
            <span className="text-sm text-gray-400">({item.count < 10 ? `0${item.count}` : item.count})</span>
          </label>
        ))}
        <button className="text-sm font-medium text-black underline mt-2">Show More</button>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        {FILTERS.size.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>

      {/* Cardio */}
      <FilterSection title="Cardio">
        {FILTERS.categories.cardio.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>

      {/* Strength */}
      <FilterSection title="Strength">
        {FILTERS.categories.strength.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>

      {/* Free Weight */}
      <FilterSection title="Free Weight">
        {FILTERS.categories.freeWeight.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>

      {/* Sports */}
      <FilterSection title="Sports">
        {FILTERS.categories.sports.map((item) => (
          <CheckboxItem key={item.label} label={item.label} count={item.count} />
        ))}
      </FilterSection>
    </div>
  );
}
