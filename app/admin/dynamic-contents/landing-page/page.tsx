"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Eye, ArrowRight, Edit2 } from "lucide-react";
import Image from "next/image";
import EditModal from "../_components/EditModal";

interface HeroSection {
  id: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  position: "main" | "topRight" | "bottomRight" | "tallRight";
  discountBadge?: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

interface PreOrderSection {
  id: string;
  enabled: boolean;
  sectionTitle: string;
  viewAllText: string;
  viewAllUrl: string;
  mainFeature: {
    image: string;
    title: string;
    buttonText: string;
    buttonUrl: string;
    saveBadge: {
      enabled: boolean;
      text: string;
      percentage: string;
    };
  };
  gridImages: {
    id: string;
    image: string;
    alt: string;
  }[];
}

interface PromoCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  badge: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

interface PromoCardsSection {
  id: string;
  enabled: boolean;
  cards: PromoCard[];
}

export default function LandingPageManagement() {
  const [sections, setSections] = useState<HeroSection[]>([]);
  const [preOrderSection, setPreOrderSection] = useState<PreOrderSection>({
    id: "preorder",
    enabled: true,
    sectionTitle: "Pre-Order Now & Save Big",
    viewAllText: "View All Preorder Products",
    viewAllUrl: "/pre-order",
    mainFeature: {
      image: "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
      title: "Nordictrack T Series\n10 Treadmill",
      buttonText: "Preorder Now",
      buttonUrl: "/pre-order",
      saveBadge: {
        enabled: true,
        text: "Save",
        percentage: "30%",
      },
    },
    gridImages: [
      { id: "grid1", image: "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png", alt: "Fitness Equipment 1" },
      { id: "grid2", image: "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png", alt: "Fitness Equipment 2" },
      { id: "grid3", image: "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png", alt: "Fitness Equipment 3" },
      { id: "grid4", image: "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png", alt: "Fitness Equipment 4" },
    ],
  });
  const [promoCardsSection, setPromoCardsSection] = useState<PromoCardsSection>({
    id: "promo-cards",
    enabled: true,
    cards: [
      {
        id: "cardio",
        title: "Cardio Equipment's",
        description: "Burn calories and boost endurance with our premium cardio machines",
        buttonText: "Shop Now",
        buttonUrl: "/shop/cardio",
        image: "/images/landing/discounts/a50664626eecf2cf40632e0dbb9e6575a1f03777.jpg",
        badge: {
          enabled: true,
          text: "Sale off",
          percentage: "45%",
        },
      },
      {
        id: "free-weight",
        title: "Free Weight Equipment's",
        description: "Burn calories and boost endurance with our premium cardio machines",
        buttonText: "Shop Now",
        buttonUrl: "/shop/free-weights",
        image: "/images/landing/discounts/90712f9864d66ccaf16d572f3692189ac2991659.jpg",
        badge: {
          enabled: true,
          text: "Up to",
          percentage: "30%",
        },
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      const response = await fetch("/api/admin/hero-sections");
      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || getDefaultSections());
        if (data.preOrderSection) {
          setPreOrderSection(data.preOrderSection);
        }
        if (data.promoCardsSection) {
          setPromoCardsSection(data.promoCardsSection);
        }
      } else {
        setSections(getDefaultSections());
      }
    } catch (error) {
      console.error("Error fetching hero sections:", error);
      setSections(getDefaultSections());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSections = (): HeroSection[] => [
    {
      id: "main",
      position: "main",
      title: "Elevate Your\nFitness Journey",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      image: "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
      discountBadge: {
        enabled: true,
        text: "Up to",
        percentage: "40%",
      },
    },
    {
      id: "topRight",
      position: "topRight",
      title: "Perfect Gear\nAwaits",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      image: "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png",
    },
    {
      id: "bottomRight",
      position: "bottomRight",
      title: "Shine Bright with\nWeights",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      image: "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png",
    },
    {
      id: "tallRight",
      position: "tallRight",
      title: "TOP\nPICKS",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      image: "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png",
    },
  ];

  const handleImageUpload = async (sectionId: string, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/hero-section");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateSection(sectionId, { image: data.url });
        // Reset input so same file can be selected again
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handlePreOrderImageUpload = async (file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/pre-order");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPreOrderSection({
          ...preOrderSection,
          mainFeature: { ...preOrderSection.mainFeature, image: data.url }
        });
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handleGridImageUpload = async (index: number, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/pre-order");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newGridImages = [...preOrderSection.gridImages];
        newGridImages[index] = {
          ...newGridImages[index],
          image: data.url,
        };
        setPreOrderSection({
          ...preOrderSection,
          gridImages: newGridImages,
        });
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handlePromoCardImageUpload = async (cardId: string, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/promo");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newCards = promoCardsSection.cards.map(card =>
          card.id === cardId ? { ...card, image: data.url } : card
        );
        setPromoCardsSection({
          ...promoCardsSection,
          cards: newCards,
        });
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const updateSection = (sectionId: string, updates: Partial<HeroSection>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/hero-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, preOrderSection, promoCardsSection }),
      });

      if (response.ok) {
        alert("Landing page sections saved successfully!");
        setEditingSection(null);
      }
    } catch (error) {
      console.error("Error saving sections:", error);
      alert("Failed to save sections");
    } finally {
      setSaving(false);
    }
  };

  const renderTitle = (title: string) => {
    return title.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const mainSection = sections.find((s) => s.position === "main");
  const topRightSection = sections.find((s) => s.position === "topRight");
  const bottomRightSection = sections.find((s) => s.position === "bottomRight");
  const tallRightSection = sections.find((s) => s.position === "tallRight");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page - Hero Section</h1>
            <p className="mt-2 text-gray-600">Click on any section to edit content and images</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Preview Live
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Hero Section Preview - Exact Replica */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Hero Section Preview</h2>
          
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4">
            
            {/* Main Section */}
            {mainSection && (
              <div 
                className="group relative col-span-1 h-[400px] cursor-pointer overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:h-full"
                onClick={() => setEditingSection(mainSection.id)}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={mainSection.image}
                    alt={mainSection.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Edit Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                    <Edit2 className="h-4 w-4" />
                    Click to Edit
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 max-w-md z-10">
                  <h2 className="mb-6 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-[36px]">
                    {renderTitle(mainSection.title)}
                  </h2>
                  <div className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFD700] px-6 text-[16px] font-semibold text-black">
                    {mainSection.buttonText} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                
                {mainSection.discountBadge?.enabled && (
                  <div className="absolute bottom-8 right-8 z-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#FF5722] shadow-2xl md:h-40 md:w-40">
                    <div className="text-center">
                      <div className="text-sm font-medium text-white md:text-base">
                        {mainSection.discountBadge.text}
                      </div>
                      <div className="text-4xl font-bold leading-none text-white md:text-5xl">
                        {mainSection.discountBadge.percentage}
                      </div>
                      <div className="text-sm font-medium text-white md:text-base">Discounts</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Top Right Section */}
            {topRightSection && (
              <div 
                className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-lg md:col-span-1 md:row-span-1 md:h-full"
                onClick={() => setEditingSection(topRightSection.id)}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={topRightSection.image}
                    alt={topRightSection.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20" />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                    <Edit2 className="h-4 w-4" />
                    Click to Edit
                  </div>
                </div>

                <div className="absolute left-6 top-6 z-10">
                  <h3 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
                    {renderTitle(topRightSection.title)}
                  </h3>
                  <div className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#FFD700]">
                    {topRightSection.buttonText} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Tall Right Section */}
            {tallRightSection && (
              <div 
                className="group relative col-span-1 h-[450px] cursor-pointer overflow-hidden rounded-lg md:col-span-1 md:row-span-2 md:h-full"
                onClick={() => setEditingSection(tallRightSection.id)}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={tallRightSection.image}
                    alt={tallRightSection.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20" />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                    <Edit2 className="h-4 w-4" />
                    Click to Edit
                  </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                  <h3 className="mb-8 text-3xl font-semibold italic tracking-wider text-white sm:text-4xl md:text-[48px]">
                    {renderTitle(tallRightSection.title)}
                  </h3>
                  <div className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFD700] px-6 text-[16px] font-semibold text-black">
                    {tallRightSection.buttonText} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Right Section */}
            {bottomRightSection && (
              <div 
                className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-lg md:col-span-1 md:row-span-1 md:h-full"
                onClick={() => setEditingSection(bottomRightSection.id)}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={bottomRightSection.image}
                    alt={bottomRightSection.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20" />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                    <Edit2 className="h-4 w-4" />
                    Click to Edit
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {renderTitle(bottomRightSection.title)}
                  </h3>
                  <div className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#FFD700]">
                    {bottomRightSection.buttonText} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pre-Order Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Pre-Order Section Preview</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={preOrderSection.enabled}
                onChange={(e) => setPreOrderSection({ ...preOrderSection, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enable Section</span>
            </label>
          </div>

          {preOrderSection.enabled && (
            <div className="mx-auto w-full max-w-[1400px]">
              {/* Header */}
              <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <h2 className="text-3xl font-bold tracking-tight text-black">
                  {preOrderSection.sectionTitle}
                </h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-black">
                  {preOrderSection.viewAllText}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid h-auto w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:h-[600px]">
                {/* Main Feature Item (Left) */}
                <div 
                  className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100 lg:h-full"
                  onClick={() => setEditingSection("preorder-main")}
                >
                  <div className="h-full w-full overflow-hidden">
                    <Image
                      src={preOrderSection.mainFeature.image}
                      alt={preOrderSection.mainFeature.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Edit Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                      <Edit2 className="h-4 w-4" />
                      Click to Edit
                    </div>
                  </div>
                  
                  {/* Badge */}
                  {preOrderSection.mainFeature.saveBadge.enabled && (
                    <div className="absolute left-6 top-6 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#D35400] text-white shadow-lg z-10">
                      <span className="text-xs font-medium">{preOrderSection.mainFeature.saveBadge.text}</span>
                      <span className="text-xl font-bold leading-none">{preOrderSection.mainFeature.saveBadge.percentage}</span>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                  {/* Content */}
                  <div className="absolute bottom-8 left-8 max-w-md text-white z-10">
                    <h3 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
                      {renderTitle(preOrderSection.mainFeature.title)}
                    </h3>
                    <div className="flex items-center gap-2 rounded-md bg-[#FFB800] px-6 py-3 text-sm font-bold text-black">
                      {preOrderSection.mainFeature.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Right Grid (4 Items) */}
                <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
                  {preOrderSection.gridImages.map((item, index) => (
                    <div 
                      key={item.id}
                      className="group relative h-[200px] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-50 lg:h-full"
                      onClick={() => setEditingSection(`preorder-grid-${index}`)}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-lg">
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Promo Cards Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Promo Cards Section Preview</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={promoCardsSection.enabled}
                onChange={(e) => setPromoCardsSection({ ...promoCardsSection, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enable Section</span>
            </label>
          </div>

          {promoCardsSection.enabled && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {promoCardsSection.cards.map((card) => (
                <div
                  key={card.id}
                  className="group relative h-[360px] cursor-pointer overflow-hidden rounded-xs sm:h-[430px]"
                  onClick={() => setEditingSection(`promo-card-${card.id}`)}
                >
                  {/* Background Image */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay Gradient - matching DiscountsSection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Edit Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                      <Edit2 className="h-4 w-4" />
                      Click to Edit
                    </div>
                  </div>

                  {/* Discount Badge - matching DiscountsSection style */}
                  {card.badge.enabled && (
                    <div className="absolute left-8 top-8 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#3E2405]/90 text-center text-primary backdrop-blur-sm z-10">
                      <span className="text-xs font-medium text-primary/80">{card.badge.text}</span>
                      <span className="text-xl font-bold">{card.badge.percentage}</span>
                    </div>
                  )}

                  {/* Content - matching DiscountsSection layout */}
                  <div className="absolute bottom-0 left-0 p-8 z-10">
                    <h3 className="mb-2 text-3xl font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="mb-6 max-w-md text-gray-200">
                      {card.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-[16px] font-semibold text-primary transition-colors hover:text-white">
                      {card.buttonText} <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal for Hero Sections */}
        <EditModal
          isOpen={!!(editingSection && (editingSection === "main" || editingSection === "topRight" || editingSection === "bottomRight" || editingSection === "tallRight"))}
          onClose={() => setEditingSection(null)}
          title={`Edit ${sections.find(s => s.id === editingSection)?.position === "main" ? "Main Section" :
                     sections.find(s => s.id === editingSection)?.position === "topRight" ? "Top Right Section" :
                     sections.find(s => s.id === editingSection)?.position === "bottomRight" ? "Bottom Right Section" :
                     "Tall Right Section"}`}
        >
          {sections.filter(s => s.id === editingSection).map((section) => (
              <div key={section.id} className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Section Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    {section.image && (
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {!section.image && (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {/* Overlay for changing image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                      <div className="text-center text-white">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">
                          {section.image ? "Change Image" : "Upload Image"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(section.id, file, e.target);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {section.image ? "Click to change image" : "Click to upload a new image"}
                  </p>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title (use \n for line breaks)
                    </label>
                    <textarea
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter title..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={section.buttonText}
                      onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Shop Now"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={section.buttonUrl}
                      onChange={(e) => updateSection(section.id, { buttonUrl: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="/shop"
                    />
                  </div>

                  {/* Discount Badge (only for main section) */}
                  {section.position === "main" && section.discountBadge && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={section.discountBadge.enabled}
                          onChange={(e) =>
                            updateSection(section.id, {
                              discountBadge: {
                                ...section.discountBadge!,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Show Discount Badge
                        </label>
                      </div>
                      {section.discountBadge.enabled && (
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs text-gray-600">Badge Text</label>
                            <input
                              type="text"
                              placeholder="Up to"
                              value={section.discountBadge.text}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  discountBadge: {
                                    ...section.discountBadge!,
                                    text: e.target.value,
                                  },
                                })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-600">Discount Percentage</label>
                            <input
                              type="text"
                              placeholder="40%"
                              value={section.discountBadge.percentage}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  discountBadge: {
                                    ...section.discountBadge!,
                                    percentage: e.target.value,
                                  },
                                })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </EditModal>

        {/* Edit Modal for Pre-Order Main Feature */}
        <EditModal
          isOpen={editingSection === "preorder-main"}
          onClose={() => setEditingSection(null)}
          title="Edit Pre-Order Main Feature"
        >
          <div className="grid gap-6 md:grid-cols-2">
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Feature Image
                </label>
                <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                  <Image
                    src={preOrderSection.mainFeature.image}
                    alt={preOrderSection.mainFeature.title}
                    fill
                    className="object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePreOrderImageUpload(file, e.target);
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              {/* Content Fields */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={preOrderSection.sectionTitle}
                    onChange={(e) => setPreOrderSection({ ...preOrderSection, sectionTitle: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Title (use \n for line breaks)
                  </label>
                  <textarea
                    value={preOrderSection.mainFeature.title}
                    onChange={(e) => setPreOrderSection({
                      ...preOrderSection,
                      mainFeature: { ...preOrderSection.mainFeature, title: e.target.value }
                    })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={preOrderSection.mainFeature.buttonText}
                    onChange={(e) => setPreOrderSection({
                      ...preOrderSection,
                      mainFeature: { ...preOrderSection.mainFeature, buttonText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={preOrderSection.mainFeature.buttonUrl}
                    onChange={(e) => setPreOrderSection({
                      ...preOrderSection,
                      mainFeature: { ...preOrderSection.mainFeature, buttonUrl: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    View All Link Text
                  </label>
                  <input
                    type="text"
                    value={preOrderSection.viewAllText}
                    onChange={(e) => setPreOrderSection({ ...preOrderSection, viewAllText: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    View All URL
                  </label>
                  <input
                    type="text"
                    value={preOrderSection.viewAllUrl}
                    onChange={(e) => setPreOrderSection({ ...preOrderSection, viewAllUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {/* Save Badge */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preOrderSection.mainFeature.saveBadge.enabled}
                      onChange={(e) => setPreOrderSection({
                        ...preOrderSection,
                        mainFeature: {
                          ...preOrderSection.mainFeature,
                          saveBadge: { ...preOrderSection.mainFeature.saveBadge, enabled: e.target.checked }
                        }
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Show Save Badge
                    </label>
                  </div>
                  {preOrderSection.mainFeature.saveBadge.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Badge Text</label>
                        <input
                          type="text"
                          placeholder="Save"
                          value={preOrderSection.mainFeature.saveBadge.text}
                          onChange={(e) => setPreOrderSection({
                            ...preOrderSection,
                            mainFeature: {
                              ...preOrderSection.mainFeature,
                              saveBadge: { ...preOrderSection.mainFeature.saveBadge, text: e.target.value }
                            }
                          })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Percentage</label>
                        <input
                          type="text"
                          placeholder="30%"
                          value={preOrderSection.mainFeature.saveBadge.percentage}
                          onChange={(e) => setPreOrderSection({
                            ...preOrderSection,
                            mainFeature: {
                              ...preOrderSection.mainFeature,
                              saveBadge: { ...preOrderSection.mainFeature.saveBadge, percentage: e.target.value }
                            }
                          })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </EditModal>

        {/* Edit Modal for Pre-Order Grid Images */}
        <EditModal
          isOpen={!!(editingSection?.startsWith("preorder-grid-"))}
          onClose={() => setEditingSection(null)}
          title={`Edit Grid Image ${editingSection ? parseInt(editingSection.split("-")[2]) + 1 : ""}`}
        >
          {editingSection?.startsWith("preorder-grid-") && (() => {
              const index = parseInt(editingSection.split("-")[2]);
              const gridItem = preOrderSection.gridImages[index];
              
              return (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Image Upload */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Grid Image
                    </label>
                    <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                      <Image
                        src={gridItem.image}
                        alt={gridItem.alt}
                        fill
                        className="object-cover"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleGridImageUpload(index, file, e.target);
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  {/* Content Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={gridItem.alt}
                        onChange={(e) => {
                          const newGridImages = [...preOrderSection.gridImages];
                          newGridImages[index] = {
                            ...newGridImages[index],
                            alt: e.target.value,
                          };
                          setPreOrderSection({
                            ...preOrderSection,
                            gridImages: newGridImages,
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Fitness Equipment"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
        </EditModal>

        {/* Edit Modal for Promo Cards */}
        <EditModal
          isOpen={!!(editingSection?.startsWith("promo-card-"))}
          onClose={() => setEditingSection(null)}
          title={`Edit ${promoCardsSection.cards.find(c => editingSection === `promo-card-${c.id}`)?.title || "Promo Card"}`}
        >
          {editingSection?.startsWith("promo-card-") && (() => {
            const cardId = editingSection.replace("promo-card-", "");
            const card = promoCardsSection.cards.find(c => c.id === cardId);
            
            if (!card) return null;

            return (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Card Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    {card.image && (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {!card.image && (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                      <div className="text-center text-white">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">
                          {card.image ? "Change Image" : "Upload Image"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePromoCardImageUpload(cardId, file, e.target);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                  </div>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = promoCardsSection.cards.map(c =>
                          c.id === cardId ? { ...c, title: e.target.value } : c
                        );
                        setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={card.description}
                      onChange={(e) => {
                        const newCards = promoCardsSection.cards.map(c =>
                          c.id === cardId ? { ...c, description: e.target.value } : c
                        );
                        setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                      }}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={card.buttonText}
                      onChange={(e) => {
                        const newCards = promoCardsSection.cards.map(c =>
                          c.id === cardId ? { ...c, buttonText: e.target.value } : c
                        );
                        setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={card.buttonUrl}
                      onChange={(e) => {
                        const newCards = promoCardsSection.cards.map(c =>
                          c.id === cardId ? { ...c, buttonUrl: e.target.value } : c
                        );
                        setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  {/* Badge Settings */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={card.badge.enabled}
                        onChange={(e) => {
                          const newCards = promoCardsSection.cards.map(c =>
                            c.id === cardId ? { ...c, badge: { ...c.badge, enabled: e.target.checked } } : c
                          );
                          setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Show Discount Badge
                      </label>
                    </div>
                    {card.badge.enabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Badge Text</label>
                          <input
                            type="text"
                            value={card.badge.text}
                            onChange={(e) => {
                              const newCards = promoCardsSection.cards.map(c =>
                                c.id === cardId ? { ...c, badge: { ...c.badge, text: e.target.value } } : c
                              );
                              setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Percentage</label>
                          <input
                            type="text"
                            value={card.badge.percentage}
                            onChange={(e) => {
                              const newCards = promoCardsSection.cards.map(c =>
                                c.id === cardId ? { ...c, badge: { ...c.badge, percentage: e.target.value } } : c
                              );
                              setPromoCardsSection({ ...promoCardsSection, cards: newCards });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </EditModal>

      </div>
    </div>
  );
}
