"use client";

import { useState, useEffect } from "react";
import { Save, ArrowRight, Edit2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import EditModal from "../_components/EditModal";
import { useSearchParams } from "next/navigation";

interface BrandHero {
  id: string;
  brandName: string;
  enabled: boolean;
  backgroundImage: string;
  title: string;
  highlightedText: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  categories?: {
    enabled: boolean;
    sectionTitle: string;
    items: {
      id: string;
      name: string;
      image: string;
      href: string;
    }[];
  };
  behindTheWork?: {
    enabled: boolean;
    title: string;
    description: string;
    stats: {
      value: string;
      label: string;
    }[];
    images: {
      left: string;
      center: string;
      right: string;
    };
  };
  shopBy?: {
    enabled: boolean;
    cards: {
      id: string;
      image: string;
      title: string;
      buttonText: string;
      buttonUrl: string;
      badge?: {
        enabled: boolean;
        value: string;
        label: string;
      };
    }[];
  };
}

export default function BrandPagesManagement() {
  const searchParams = useSearchParams();
  const brandIdFromUrl = searchParams.get('brand');
  
  const [brands, setBrands] = useState<BrandHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<"hero" | "category" | "categories-settings" | "behind" | "shop" | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    // Auto-select brand if brand ID is in URL
    if (brandIdFromUrl && brands.length > 0) {
      const brand = brands.find(b => b.id === brandIdFromUrl);
      if (brand) {
        setEditingBrand(brand.id);
      }
    }
  }, [brandIdFromUrl, brands]);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/admin/brand-pages");
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || getDefaultBrands());
      } else {
        setBrands(getDefaultBrands());
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands(getDefaultBrands());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBrands = (): BrandHero[] => [
    {
      id: "nordictrack",
      brandName: "NordicTrack",
      enabled: true,
      backgroundImage: "/images/brand-page/brand-page-hero-img.png",
      title: "Turn Your Home\nInto A Complete",
      highlightedText: "Fitness Space",
      description: "NordicTrack is a leader in home fitness equipment, known for innovative treadmills, ellipticals, and exercise bikes with iFIT technology integration.",
      buttonText: "Shop Nordictrack",
      buttonUrl: "/shop",
      categories: {
        enabled: true,
        sectionTitle: "Explore The Nordictrack Categories",
        items: [
          {
            id: "bikes",
            name: "Bikes",
            image: "/images/brand-page/categories/98003f070b9e4310ce977c412d825b39a66f4a49.png",
            href: "/brand/nordictrack/bikes",
          },
          {
            id: "treadmills",
            name: "Treadmills",
            image: "/images/brand-page/categories/9cb5aaa1137d1d2b316f4e79e0c6cd4907ac3731.png",
            href: "/brand/nordictrack/treadmills",
          },
          {
            id: "ellipticals",
            name: "Ellipticals",
            image: "/images/brand-page/categories/9f7648e870428e544492827c09fc28423f3272aa.png",
            href: "/brand/nordictrack/ellipticals",
          },
          {
            id: "rowers",
            name: "Rowers",
            image: "/images/brand-page/categories/dbd0d8305985321c2a2719424e34067f5902dcc3.png",
            href: "/brand/nordictrack/rowers",
          },
        ],
      },
      behindTheWork: {
        enabled: true,
        title: "Thinking Behind the Work",
        description: "NordicTrack delivers a premium personal training experience at home through expertly crafted fitness equipment and the innovative iFIT platform. With a strong legacy in cardio, NordicTrack designs industry-leading treadmills, bikes, ellipticals, and rowers that combine comfort, performance, and advanced technology. iFIT programs, led by top trainers, offer immersive workouts from iconic global locations while adapting to all fitness levels. By continuously innovating across strength, endurance, and cross-training, NordicTrack provides a complete, interactive home fitness solution—because you deserve the best.",
        stats: [
          { value: "51 +", label: "Years of Experiences" },
          { value: "1M +", label: "Happy Customers" },
          { value: "50 +", label: "Available In Countries" },
        ],
        images: {
          left: "/images/brand-page/behind-the-work/35e52de170a36a04228f64d8d6f6c57f62e3c36a.png",
          center: "/images/brand-page/behind-the-work/6da4e59475159602882c3fabee07c1388d618dbb.png",
          right: "/images/brand-page/behind-the-work/9cb5aaa1137d1d2b316f4e79e0c6cd4907ac3731 (1).png",
        },
      },
      shopBy: {
        enabled: true,
        cards: [
          {
            id: "treadmill",
            image: "/images/brand-page/shop-by/t-series.png",
            title: "T Series 16 Treadmill",
            buttonText: "Shop Treadmill",
            buttonUrl: "/shop?category=treadmill",
            badge: {
              enabled: true,
              value: "12",
              label: "MPH Speed",
            },
          },
          {
            id: "elliptical",
            image: "/images/brand-page/shop-by/setp-climb-xl.png",
            title: "Step Climber XL",
            buttonText: "Shop Ellipticals",
            buttonUrl: "/shop?category=elliptical",
          },
        ],
      },
    },
  ];

  const handleImageUpload = async (brandId: string, file: File, folder: string = "brand-page", inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateBrand(brandId, { backgroundImage: data.url });
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

  const updateBrand = (brandId: string, updates: Partial<BrandHero>) => {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === brandId ? { ...brand, ...updates } : brand
      )
    );
  };

  const addNewBrand = () => {
    const newBrand: BrandHero = {
      id: `brand-${Date.now()}`,
      brandName: "New Brand",
      enabled: true,
      backgroundImage: "/images/brand-page/brand-page-hero-img.png",
      title: "Brand Title",
      highlightedText: "Highlighted Text",
      description: "Brand description goes here...",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      categories: {
        enabled: true,
        sectionTitle: "Explore Categories",
        items: [
          {
            id: "cat1",
            name: "Category 1",
            image: "/images/brand-page/categories/98003f070b9e4310ce977c412d825b39a66f4a49.png",
            href: "/shop",
          },
        ],
      },
    };
    setBrands([...brands, newBrand]);
    setEditingBrand(newBrand.id);
    setEditingSection("hero");
  };

  const addCategory = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand || !brand.categories) return;

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: "New Category",
      image: "/images/brand-page/categories/98003f070b9e4310ce977c412d825b39a66f4a49.png",
      href: "/shop",
    };

    updateBrand(brandId, {
      categories: {
        ...brand.categories,
        items: [...brand.categories.items, newCategory],
      },
    });
  };

  const updateCategory = (brandId: string, categoryId: string, updates: any) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand || !brand.categories) return;

    const updatedItems = brand.categories.items.map((item) =>
      item.id === categoryId ? { ...item, ...updates } : item
    );

    updateBrand(brandId, {
      categories: {
        ...brand.categories,
        items: updatedItems,
      },
    });
  };

  const deleteCategory = (brandId: string, categoryId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand || !brand.categories) return;

    if (confirm("Are you sure you want to delete this category?")) {
      updateBrand(brandId, {
        categories: {
          ...brand.categories,
          items: brand.categories.items.filter((item) => item.id !== categoryId),
        },
      });
    }
  };

  const deleteBrand = (brandId: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter((b) => b.id !== brandId));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/brand-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brands }),
      });

      if (response.ok) {
        alert("Brand pages saved successfully!");
        setEditingBrand(null);
        setEditingSection(null);
        setEditingItemId(null);
      }
    } catch (error) {
      console.error("Error saving brands:", error);
      alert("Failed to save brand pages");
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
            <h1 className="text-3xl font-bold text-gray-900">Brand Pages Management</h1>
            <p className="mt-2 text-gray-600">Manage hero sections for brand pages</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addNewBrand}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </button>
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

        {/* Brand List */}
        <div className="space-y-6">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">{brand.brandName}</h2>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={brand.enabled}
                      onChange={(e) => updateBrand(brand.id, { enabled: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Enabled</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (editingBrand === brand.id && editingSection === "hero") {
                        setEditingBrand(null);
                        setEditingSection(null);
                      } else {
                        setEditingBrand(brand.id);
                        setEditingSection("hero");
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    {editingBrand === brand.id && editingSection === "hero" ? "Close" : "Edit Hero"}
                  </button>
                  {brands.length > 1 && (
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              {brand.enabled && (
                <div 
                  className="relative mb-6 h-[400px] w-full cursor-pointer overflow-hidden rounded-xl bg-black md:h-[500px]"
                  onClick={() => {
                    setEditingBrand(brand.id);
                    setEditingSection("hero");
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={brand.backgroundImage}
                      alt={brand.brandName}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(89.44deg, rgba(0, 0, 0, 0.82) 21.48%, rgba(102, 102, 102, 0) 67.89%)",
                    }}
                  />

                  {/* Edit Overlay */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/20 hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                      <Edit2 className="h-4 w-4" />
                      Click to Edit
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-20 flex h-full items-center px-8 md:px-12">
                    <div className="max-w-xl md:max-w-2xl">
                      <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[56px]">
                        {renderTitle(brand.title)} <br />
                        <span className="italic text-[#FFC107]">{brand.highlightedText}</span>
                      </h1>
                      <p className="mb-8 max-w-lg text-sm text-gray-300 sm:text-base md:text-lg">
                        {brand.description}
                      </p>
                      <div className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFC107] px-8 text-base font-semibold text-black">
                        {brand.buttonText}
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Slider Indicators */}
                  <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-4">
                    <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-12 rounded-full bg-[#FFC107]"></div>
                    <div className="h-1.5 w-12 rounded-full bg-white/40"></div>
                  </div>
                </div>
              )}

              {/* Categories Section Preview */}
              {brand.categories && brand.categories.enabled && (
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Categories Section</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingBrand(brand.id);
                          setEditingSection("categories-settings");
                        }}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Section
                      </button>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brand.categories.enabled}
                          onChange={(e) => updateBrand(brand.id, {
                            categories: { ...brand.categories!, enabled: e.target.checked }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Show Categories</span>
                      </label>
                    </div>
                  </div>

                  <div 
                    className="rounded-xl p-8"
                    style={{
                      background: "radial-gradient(72.28% 72.28% at 53.3% 84.54%, #EC9A24 0%, #1B150F 100%)",
                    }}
                  >
                    <h2 className="mb-8 text-center text-2xl font-semibold text-white md:text-3xl">
                      {brand.categories.sectionTitle}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {brand.categories.items.map((category) => (
                        <div
                          key={category.id}
                          className="group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBrand(brand.id);
                            setEditingSection("category");
                            setEditingItemId(category.id);
                          }}
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-white/5 transition-transform duration-300 group-hover:-translate-y-2">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                              <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-lg">
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </div>
                            </div>
                          </div>
                          <h3 className="mt-4 text-lg font-medium text-white">
                            {category.name}
                          </h3>
                        </div>
                      ))}
                    </div>

                    {editingBrand === brand.id && editingSection === "categories-settings" && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addCategory(brand.id);
                          }}
                          className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                        >
                          <Plus className="h-4 w-4" />
                          Add Category
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Behind The Work Section Preview */}
              {brand.behindTheWork && brand.behindTheWork.enabled && (
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Behind The Work Section</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingBrand(brand.id);
                          setEditingSection("behind");
                        }}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Section
                      </button>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brand.behindTheWork.enabled}
                          onChange={(e) => updateBrand(brand.id, {
                            behindTheWork: { ...brand.behindTheWork!, enabled: e.target.checked }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Show Section</span>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                      {/* Content Side */}
                      <div className="flex-1">
                        <h2 className="mb-4 text-2xl font-bold text-black md:text-3xl">
                          {brand.behindTheWork.title}
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed text-gray-600 md:text-base">
                          {brand.behindTheWork.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                          {brand.behindTheWork.stats.map((stat, index) => (
                            <div key={index}>
                              <div className="mb-1 text-2xl font-bold italic text-black md:text-3xl">
                                {stat.value}
                              </div>
                              <div className="text-xs font-medium text-gray-600 md:text-sm">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Images Side */}
                      <div className="relative flex min-h-[300px] flex-1 items-center justify-center md:min-h-[400px]">
                        {/* Left Image */}
                        <div className="absolute left-1/2 top-1/2 h-[200px] w-[140px] -translate-x-[85%] -translate-y-1/2 overflow-hidden rounded-sm bg-blue-50 shadow-lg md:h-[300px] md:w-[200px]">
                          <Image
                            src={brand.behindTheWork.images.left}
                            alt="Left"
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Right Image */}
                        <div className="absolute left-1/2 top-1/2 h-[200px] w-[140px] -translate-x-[15%] -translate-y-1/2 overflow-hidden rounded-sm bg-gray-50 shadow-lg md:h-[300px] md:w-[200px]">
                          <Image
                            src={brand.behindTheWork.images.right}
                            alt="Right"
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Center Image */}
                        <div className="absolute left-1/2 top-1/2 z-10 h-[240px] w-[160px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm bg-[#E5DCC5] shadow-2xl md:h-[360px] md:w-[220px]">
                          <Image
                            src={brand.behindTheWork.images.center}
                            alt="Center"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shop By Section Preview */}
              {brand.shopBy && brand.shopBy.enabled && (
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Shop By Section</h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const newCard = {
                            id: `card-${Date.now()}`,
                            image: "/images/brand-page/shop-by/t-series.png",
                            title: "New Product",
                            buttonText: "Shop Now",
                            buttonUrl: "/shop",
                          };
                          updateBrand(brand.id, {
                            shopBy: {
                              ...brand.shopBy!,
                              cards: [...brand.shopBy!.cards, newCard],
                            },
                          });
                        }}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        <Plus className="h-3 w-3" />
                        Add Card
                      </button>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brand.shopBy.enabled}
                          onChange={(e) => updateBrand(brand.id, {
                            shopBy: { ...brand.shopBy!, enabled: e.target.checked }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Show Section</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {brand.shopBy.cards.map((card) => (
                      <div
                        key={card.id}
                        className="group relative h-[300px] cursor-pointer overflow-hidden rounded-lg md:h-[400px]"
                        onClick={() => {
                          setEditingBrand(brand.id);
                          setEditingSection("shop");
                          setEditingItemId(card.id);
                        }}
                      >
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Edit Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                            <Edit2 className="h-4 w-4" />
                            Click to Edit
                          </div>
                        </div>

                        {/* Badge */}
                        {card.badge?.enabled && (
                          <div className="absolute bottom-[140px] right-8 flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-[#1A1A1A] text-white shadow-lg">
                            <span className="text-2xl font-bold">{card.badge.value}</span>
                            <span className="text-[10px] font-medium uppercase">{card.badge.label}</span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-6 text-center">
                          <h3 className="mb-4 text-xl font-bold text-white md:text-2xl">
                            {card.title}
                          </h3>
                          
                          <div className="inline-flex h-10 items-center gap-2 rounded-md bg-[#FFC107] px-6 text-sm font-semibold text-black">
                            {card.buttonText}
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Modal for Brand Hero */}
        {editingBrand && editingSection === "hero" && (() => {
          const brand = brands.find((b) => b.id === editingBrand);
          
          if (!brand) return null;

          return (
            <EditModal
              isOpen={true}
              onClose={() => {
                setEditingBrand(null);
                setEditingSection(null);
              }}
              title={`Edit ${brand.brandName} Hero Section`}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Background Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    <Image
                      src={brand.backgroundImage}
                      alt={brand.brandName}
                      fill
                      className="object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(brand.id, file, "brand-page", e.target);
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Click to upload a new image</p>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brand.brandName}
                      onChange={(e) => updateBrand(brand.id, { brandName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="NordicTrack"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title (use \n for line breaks)
                    </label>
                    <textarea
                      value={brand.title}
                      onChange={(e) => updateBrand(brand.id, { title: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Turn Your Home\nInto A Complete"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Highlighted Text (Yellow/Italic)
                    </label>
                    <input
                      type="text"
                      value={brand.highlightedText}
                      onChange={(e) => updateBrand(brand.id, { highlightedText: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Fitness Space"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={brand.description}
                      onChange={(e) => updateBrand(brand.id, { description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Brand description..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={brand.buttonText}
                      onChange={(e) => updateBrand(brand.id, { buttonText: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Shop Nordictrack"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={brand.buttonUrl}
                      onChange={(e) => updateBrand(brand.id, { buttonUrl: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="/shop"
                    />
                  </div>
                </div>
              </div>
            </EditModal>
          );
        })()}

        {/* Edit Modal for Shop By Card */}
        {editingBrand && editingSection === "shop" && editingItemId && (() => {
          const brand = brands.find((b) => b.id === editingBrand);
          const card = brand?.shopBy?.cards.find((c) => c.id === editingItemId);
          
          if (!brand || !card) return null;

          return (
            <EditModal
              isOpen={true}
              onClose={() => {
                setEditingSection(null);
                setEditingItemId(null);
              }}
              title={`Edit Shop By Card: ${card.title}`}
            >
              <div className="mb-6 flex items-center justify-end">
                {brand.shopBy!.cards.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this card?")) {
                        updateBrand(editingBrand, {
                          shopBy: {
                            ...brand.shopBy!,
                            cards: brand.shopBy!.cards.filter((c) => c.id !== editingItemId),
                          },
                        });
                        setEditingSection(null);
                        setEditingItemId(null);
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Card Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const updatedCards = brand.shopBy!.cards.map((c) =>
                              c.id === editingItemId ? { ...c, image: e.target?.result as string } : c
                            );
                            updateBrand(editingBrand, {
                              shopBy: { ...brand.shopBy!, cards: updatedCards },
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Click to upload a new image</p>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updatedCards = brand.shopBy!.cards.map((c) =>
                          c.id === editingItemId ? { ...c, title: e.target.value } : c
                        );
                        updateBrand(editingBrand, {
                          shopBy: { ...brand.shopBy!, cards: updatedCards },
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="T Series 16 Treadmill"
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
                        const updatedCards = brand.shopBy!.cards.map((c) =>
                          c.id === editingItemId ? { ...c, buttonText: e.target.value } : c
                        );
                        updateBrand(editingBrand, {
                          shopBy: { ...brand.shopBy!, cards: updatedCards },
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Shop Treadmill"
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
                        const updatedCards = brand.shopBy!.cards.map((c) =>
                          c.id === editingItemId ? { ...c, buttonUrl: e.target.value } : c
                        );
                        updateBrand(editingBrand, {
                          shopBy: { ...brand.shopBy!, cards: updatedCards },
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="/shop?category=treadmill"
                    />
                  </div>

                  {/* Badge */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={card.badge?.enabled || false}
                        onChange={(e) => {
                          const updatedCards = brand.shopBy!.cards.map((c) =>
                            c.id === editingItemId
                              ? {
                                  ...c,
                                  badge: {
                                    enabled: e.target.checked,
                                    value: c.badge?.value || "12",
                                    label: c.badge?.label || "MPH Speed",
                                  },
                                }
                              : c
                          );
                          updateBrand(editingBrand, {
                            shopBy: { ...brand.shopBy!, cards: updatedCards },
                          });
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Show Badge
                      </label>
                    </div>
                    {card.badge?.enabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Badge Value</label>
                          <input
                            type="text"
                            placeholder="12"
                            value={card.badge.value}
                            onChange={(e) => {
                              const updatedCards = brand.shopBy!.cards.map((c) =>
                                c.id === editingItemId
                                  ? {
                                      ...c,
                                      badge: { ...c.badge!, value: e.target.value },
                                    }
                                  : c
                              );
                              updateBrand(editingBrand, {
                                shopBy: { ...brand.shopBy!, cards: updatedCards },
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Badge Label</label>
                          <input
                            type="text"
                            placeholder="MPH Speed"
                            value={card.badge.label}
                            onChange={(e) => {
                              const updatedCards = brand.shopBy!.cards.map((c) =>
                                c.id === editingItemId
                                  ? {
                                      ...c,
                                      badge: { ...c.badge!, label: e.target.value },
                                    }
                                  : c
                              );
                              updateBrand(editingBrand, {
                                shopBy: { ...brand.shopBy!, cards: updatedCards },
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </EditModal>
          );
        })()}

        {/* Edit Modal for Individual Category */}
        {editingBrand && editingSection === "category" && editingItemId && (() => {
          const brand = brands.find((b) => b.id === editingBrand);
          const category = brand?.categories?.items.find((c) => c.id === editingItemId);
          
          if (!brand || !category) return null;

          return (
            <EditModal
              isOpen={true}
              onClose={() => {
                setEditingSection(null);
                setEditingItemId(null);
              }}
              title={`Edit Category: ${category.name}`}
            >
              <div className="mb-6 flex items-center justify-end">
                <button
                  onClick={() => {
                    deleteCategory(editingBrand, editingItemId);
                    setEditingSection(null);
                    setEditingItemId(null);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category Image
                  </label>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            updateCategory(editingBrand, editingItemId, {
                              image: e.target?.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Click to upload a new image</p>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(editingBrand, editingItemId, { name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Bikes"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category URL
                    </label>
                    <input
                      type="text"
                      value={category.href}
                      onChange={(e) => updateCategory(editingBrand, editingItemId, { href: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="/brand/nordictrack/bikes"
                    />
                  </div>
                </div>
              </div>
            </EditModal>
          );
        })()}

        {/* Edit Modal for Categories Section Settings */}
        {editingBrand && editingSection === "categories-settings" && (() => {
          const brand = brands.find((b) => b.id === editingBrand);
          
          if (!brand || !brand.categories) return null;

          return (
            <EditModal
              isOpen={true}
              onClose={() => {
                setEditingSection(null);
              }}
              title="Edit Categories Section"
            >
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={brand.categories.sectionTitle}
                    onChange={(e) => updateBrand(editingBrand, {
                      categories: { ...brand.categories!, sectionTitle: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Explore The Nordictrack Categories"
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                    <button
                      onClick={() => addCategory(editingBrand)}
                      className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-100"
                    >
                      <Plus className="h-3 w-3" />
                      Add Category
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {brand.categories.items.map((category) => (
                      <div
                        key={category.id}
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3 hover:border-orange-300 hover:bg-orange-50"
                        onClick={() => {
                          setEditingSection("category");
                          setEditingItemId(category.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{category.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{category.href}</p>
                          </div>
                          <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EditModal>
          );
        })()}

        {/* Edit Modal for Behind The Work Section */}
        {editingBrand && editingSection === "behind" && (() => {
          const brand = brands.find((b) => b.id === editingBrand);
          
          if (!brand || !brand.behindTheWork) return null;

          return (
            <EditModal
              isOpen={true}
              onClose={() => {
                setEditingSection(null);
              }}
              title="Edit Behind The Work Section"
            >
              <div className="space-y-6">
                {/* Title and Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={brand.behindTheWork.title}
                    onChange={(e) => updateBrand(editingBrand, {
                      behindTheWork: { ...brand.behindTheWork!, title: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Thinking Behind the Work"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={brand.behindTheWork.description}
                    onChange={(e) => updateBrand(editingBrand, {
                      behindTheWork: { ...brand.behindTheWork!, description: e.target.value }
                    })}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Brand description..."
                  />
                </div>

                {/* Stats */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Statistics
                  </label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {brand.behindTheWork.stats.map((stat, index) => (
                      <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <label className="mb-1 block text-xs text-gray-600">Value</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...brand.behindTheWork!.stats];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            updateBrand(editingBrand, {
                              behindTheWork: { ...brand.behindTheWork!, stats: newStats }
                            });
                          }}
                          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          placeholder="51 +"
                        />
                        <label className="mb-1 block text-xs text-gray-600">Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...brand.behindTheWork!.stats];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            updateBrand(editingBrand, {
                              behindTheWork: { ...brand.behindTheWork!, stats: newStats }
                            });
                          }}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          placeholder="Years of Experiences"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Images
                  </label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Left Image */}
                    <div>
                      <label className="mb-2 block text-xs text-gray-600">Left Image</label>
                      <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                        <Image
                          src={brand.behindTheWork.images.left}
                          alt="Left"
                          fill
                          className="object-cover"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                updateBrand(editingBrand, {
                                  behindTheWork: {
                                    ...brand.behindTheWork!,
                                    images: {
                                      ...brand.behindTheWork!.images,
                                      left: e.target?.result as string,
                                    }
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </div>

                    {/* Center Image */}
                    <div>
                      <label className="mb-2 block text-xs text-gray-600">Center Image (Main)</label>
                      <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                        <Image
                          src={brand.behindTheWork.images.center}
                          alt="Center"
                          fill
                          className="object-cover"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                updateBrand(editingBrand, {
                                  behindTheWork: {
                                    ...brand.behindTheWork!,
                                    images: {
                                      ...brand.behindTheWork!.images,
                                      center: e.target?.result as string,
                                    }
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </div>

                    {/* Right Image */}
                    <div>
                      <label className="mb-2 block text-xs text-gray-600">Right Image</label>
                      <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                        <Image
                          src={brand.behindTheWork.images.right}
                          alt="Right"
                          fill
                          className="object-cover"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                updateBrand(editingBrand, {
                                  behindTheWork: {
                                    ...brand.behindTheWork!,
                                    images: {
                                      ...brand.behindTheWork!.images,
                                      right: e.target?.result as string,
                                    }
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </EditModal>
          );
        })()}

        {brands.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg">
            <p className="mb-4 text-gray-600">No brands added yet</p>
            <button
              onClick={addNewBrand}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add Your First Brand
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
