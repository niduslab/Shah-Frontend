"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const SECTIONS = [
  {
    id: "details",
    title: "Product Details",
    content: "The NordicTrack Commercial 1750 Treadmill is designed to provide a premium fitness experience at home. With a powerful 3.5 CHP motor, a spacious 22\" x 60\" running deck, and a 14\" HD touchscreen, you can stream on-demand workouts and track your progress in real-time. The incline range of -3% to 15% allows you to simulate outdoor terrain, while the Runners Flex cushioning reduces impact on your joints."
  },
  {
    id: "specs",
    title: "Product Specifications",
    content: "Motor: 3.5 CHP | Speed: 0-12 MPH | Incline: -3% to 15% | Display: 14\" HD Touchscreen | Belt: 22\" x 60\" | User Capacity: 300 Lbs | Footprint: 80\" L x 38\" W x 65\" H"
  },
  {
    id: "shipping",
    title: "Shipping & Return",
    content: "Free shipping on all orders over $50. We offer a 30-day money-back guarantee on all products. If you are not satisfied with your purchase, you can return it for a full refund within 30 days of delivery. Return shipping costs may apply."
  }
];

export function ProductAccordions() {
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col border-t border-gray-200">
        {SECTIONS.map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between py-4 text-left hover:text-primary transition-colors"
            >
              <span className="text-base font-medium text-black">{section.title}</span>
              {openSection === section.id ? (
                <Minus className="h-5 w-5 text-gray-500" />
              ) : (
                <Plus className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === section.id ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
