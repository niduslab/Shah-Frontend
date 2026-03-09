"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface ProductAccordionsProps {
  product: any;
}

export function ProductAccordions({ product }: ProductAccordionsProps) {
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  const sections = [
    {
      id: "details",
      title: "Product Details",
      content: product.description || product.short_description || "No description available."
    },
    {
      id: "specs",
      title: "Product Specifications",
      content: `
        ${product.sku ? `SKU: ${product.sku}` : ''}
        ${product.weight ? `\nWeight: ${product.weight} ${product.weight_unit || 'kg'}` : ''}
        ${product.brand?.name ? `\nBrand: ${product.brand.name}` : ''}
        ${product.category?.name ? `\nCategory: ${product.category.name}` : ''}
        ${product.stock_status ? `\nStock Status: ${product.stock_status.replace('_', ' ')}` : ''}
        ${product.quantity ? `\nAvailable Quantity: ${product.quantity}` : ''}
      `.trim() || "No specifications available."
    },
    {
      id: "shipping",
      title: "Shipping & Return",
      content: product.shipping_notes || "Free shipping on all orders over $50. We offer a 30-day money-back guarantee on all products. If you are not satisfied with your purchase, you can return it for a full refund within 30 days of delivery. Return shipping costs may apply."
    }
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col border-t border-gray-200">
        {sections.map((section) => (
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
                openSection === section.id ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
