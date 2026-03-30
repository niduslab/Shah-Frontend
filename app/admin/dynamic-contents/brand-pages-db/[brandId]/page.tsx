"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useBrands } from "@/lib/hooks/public/useBrands";
import { toast } from "sonner";
import Image from "next/image";

interface BrandPageContent {
  hero: {
    enabled: boolean;
    backgroundImage: string;
    title: string;
    highlightedText: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  categories: {
    enabled: boolean;
    sectionTitle: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
      href: string;
    }>;
  };
  behindTheWork: {
    enabled: boolean;
    title: string;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    images: {
      left: string;
      center: string;
      right: string;
    };
  };
  shopBy: {
    enabled: boolean;
    cards: Array<{
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
    }>;
  };
}

export default function BrandPageEditor() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;

  const { data: brandsData } = useBrands();
  const brands = brandsData?.data || [];
  const brand = brands.find((b: any) => b.id === parseInt(brandId));

  const [content, setContent] = useState<BrandPageContent>({
    hero: {
      enabled: true,
      backgroundImage: "/images/brand-page/brand-page-hero-img.png",
      title: "Turn Your Home\nInto A Complete",
      highlightedText: "Fitness Space",
      description: "",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
    },
    categories: {
      enabled: true,
      sectionTitle: "Explore Categories",
      items: [],
    },
    behindTheWork: {
      enabled: true,
      title: "Thinking Behind the Work",
      description: "",
      stats: [
        { value: "51+", label: "Years of Experience" },
        { value: "1M+", label: "Happy Customers" },
        { value: "50+", label: "Available In Countries" },
      ],
      images: {
        left: "",
        center: "",
        right: "",
      },
    },
    shopBy: {
      enabled: true,
      cards: [],
    },
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      fetchBrandContent();
    }
  }, [brand]);

  const fetchBrandContent = async () => {
    try {
      const response = await fetch(`/api/admin/brand-pages/${brandId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setContent(data.content);
        }
      }
    } catch (error) {
      console.error("Error fetching brand content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/brand-pages/${brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast.success("Brand page saved successfully!");
      } else {
        toast.error("Failed to save brand page");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving brand page");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, folder: string = "brand-page") => {
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
        return data.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Brand not found</p>
          <button
            onClick={() => router.push("/admin/brands")}
            className="mt-4 text-orange-500 hover:text-orange-600"
          >
            Go back to brands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/brands")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{brand.name} - Brand Page</h1>
            <p className="mt-2 text-gray-600">Manage content for {brand.name} brand page</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Hero Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.hero.enabled}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, enabled: e.target.checked }
                })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>

          {content.hero.enabled && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Background Image</label>
                <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {content.hero.backgroundImage && (
                    <Image
                      src={content.hero.backgroundImage}
                      alt="Hero background"
                      fill
                      className="object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file, "brand-page/hero");
                        if (url) {
                          setContent({
                            ...content,
                            hero: { ...content.hero, backgroundImage: url }
                          });
                        }
                      }
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                  <textarea
                    value={content.hero.title}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value }
                    })}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Use \n for line breaks"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Highlighted Text</label>
                  <input
                    type="text"
                    value={content.hero.highlightedText}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, highlightedText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value }
                    })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={content.hero.buttonText}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, buttonText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={content.hero.buttonUrl}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, buttonUrl: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Categories Section</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    categories: {
                      ...content.categories,
                      items: [
                        ...content.categories.items,
                        {
                          id: `cat-${Date.now()}`,
                          name: "New Category",
                          image: "",
                          href: "/shop",
                        },
                      ],
                    },
                  });
                }}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.categories.enabled}
                  onChange={(e) => setContent({
                    ...content,
                    categories: { ...content.categories, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Enabled</span>
              </label>
            </div>
          </div>

          {content.categories.enabled && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Section Title</label>
                <input
                  type="text"
                  value={content.categories.sectionTitle}
                  onChange={(e) => setContent({
                    ...content,
                    categories: { ...content.categories, sectionTitle: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {content.categories.items.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium">Category {index + 1}</span>
                      <button
                        onClick={() => {
                          setContent({
                            ...content,
                            categories: {
                              ...content.categories,
                              items: content.categories.items.filter((_, i) => i !== index),
                            },
                          });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="relative h-32 overflow-hidden rounded-lg border border-gray-300">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleImageUpload(file, "brand-page/categories");
                              if (url) {
                                const newItems = [...content.categories.items];
                                newItems[index].image = url;
                                setContent({
                                  ...content,
                                  categories: { ...content.categories, items: newItems },
                                });
                              }
                            }
                          }}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>

                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...content.categories.items];
                          newItems[index].name = e.target.value;
                          setContent({
                            ...content,
                            categories: { ...content.categories, items: newItems },
                          });
                        }}
                        placeholder="Category name"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />

                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const newItems = [...content.categories.items];
                          newItems[index].href = e.target.value;
                          setContent({
                            ...content,
                            categories: { ...content.categories, items: newItems },
                          });
                        }}
                        placeholder="Link URL"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Behind The Work Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Behind The Work Section</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.behindTheWork.enabled}
                onChange={(e) => setContent({
                  ...content,
                  behindTheWork: { ...content.behindTheWork, enabled: e.target.checked }
                })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>

          {content.behindTheWork.enabled && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={content.behindTheWork.title}
                    onChange={(e) => setContent({
                      ...content,
                      behindTheWork: { ...content.behindTheWork, title: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Thinking Behind the Work"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={content.behindTheWork.description}
                    onChange={(e) => setContent({
                      ...content,
                      behindTheWork: { ...content.behindTheWork, description: e.target.value }
                    })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Brand story and description..."
                  />
                </div>
              </div>

              {/* Stats */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Statistics</label>
                <div className="grid gap-4 md:grid-cols-3">
                  {content.behindTheWork.stats.map((stat, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <label className="mb-1 block text-xs text-gray-600">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...content.behindTheWork.stats];
                          newStats[index] = { ...newStats[index], value: e.target.value };
                          setContent({
                            ...content,
                            behindTheWork: { ...content.behindTheWork, stats: newStats }
                          });
                        }}
                        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="51+"
                      />
                      <label className="mb-1 block text-xs text-gray-600">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.behindTheWork.stats];
                          newStats[index] = { ...newStats[index], label: e.target.value };
                          setContent({
                            ...content,
                            behindTheWork: { ...content.behindTheWork, stats: newStats }
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Years of Experience"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Images</label>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Left Image */}
                  <div>
                    <label className="mb-2 block text-xs text-gray-600">Left Image</label>
                    <div className="relative h-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      {content.behindTheWork.images.left && (
                        <Image
                          src={content.behindTheWork.images.left}
                          alt="Left"
                          fill
                          className="object-cover"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file, "brand-page/behind-work");
                            if (url) {
                              setContent({
                                ...content,
                                behindTheWork: {
                                  ...content.behindTheWork,
                                  images: { ...content.behindTheWork.images, left: url }
                                }
                              });
                            }
                          }
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  {/* Center Image */}
                  <div>
                    <label className="mb-2 block text-xs text-gray-600">Center Image</label>
                    <div className="relative h-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      {content.behindTheWork.images.center && (
                        <Image
                          src={content.behindTheWork.images.center}
                          alt="Center"
                          fill
                          className="object-cover"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file, "brand-page/behind-work");
                            if (url) {
                              setContent({
                                ...content,
                                behindTheWork: {
                                  ...content.behindTheWork,
                                  images: { ...content.behindTheWork.images, center: url }
                                }
                              });
                            }
                          }
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  {/* Right Image */}
                  <div>
                    <label className="mb-2 block text-xs text-gray-600">Right Image</label>
                    <div className="relative h-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      {content.behindTheWork.images.right && (
                        <Image
                          src={content.behindTheWork.images.right}
                          alt="Right"
                          fill
                          className="object-cover"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file, "brand-page/behind-work");
                            if (url) {
                              setContent({
                                ...content,
                                behindTheWork: {
                                  ...content.behindTheWork,
                                  images: { ...content.behindTheWork.images, right: url }
                                }
                              });
                            }
                          }
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shop By Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Shop By Section</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    shopBy: {
                      ...content.shopBy,
                      cards: [
                        ...content.shopBy.cards,
                        {
                          id: `card-${Date.now()}`,
                          image: "/images/brand-page/shop-by/t-series.png",
                          title: "New Product",
                          buttonText: "Shop Now",
                          buttonUrl: "/shop",
                        },
                      ],
                    },
                  });
                }}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.shopBy.enabled}
                  onChange={(e) => setContent({
                    ...content,
                    shopBy: { ...content.shopBy, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Enabled</span>
              </label>
            </div>
          </div>

          {content.shopBy.enabled && (
            <div className="grid gap-6 md:grid-cols-2">
              {content.shopBy.cards.map((card, index) => (
                <div key={card.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">Card {index + 1}</span>
                    <button
                      onClick={() => {
                        setContent({
                          ...content,
                          shopBy: {
                            ...content.shopBy,
                            cards: content.shopBy.cards.filter((_, i) => i !== index),
                          },
                        });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="relative h-48 overflow-hidden rounded-lg border border-gray-300">
                      {card.image && (
                        <Image src={card.image} alt={card.title} fill className="object-cover" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file, "brand-page/shop-by");
                            if (url) {
                              const newCards = [...content.shopBy.cards];
                              newCards[index].image = url;
                              setContent({
                                ...content,
                                shopBy: { ...content.shopBy, cards: newCards },
                              });
                            }
                          }
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Product Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...content.shopBy.cards];
                          newCards[index].title = e.target.value;
                          setContent({
                            ...content,
                            shopBy: { ...content.shopBy, cards: newCards },
                          });
                        }}
                        placeholder="T Series 16 Treadmill"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Button Text */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Button Text</label>
                      <input
                        type="text"
                        value={card.buttonText}
                        onChange={(e) => {
                          const newCards = [...content.shopBy.cards];
                          newCards[index].buttonText = e.target.value;
                          setContent({
                            ...content,
                            shopBy: { ...content.shopBy, cards: newCards },
                          });
                        }}
                        placeholder="Shop Treadmill"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Button URL */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Button URL</label>
                      <input
                        type="text"
                        value={card.buttonUrl}
                        onChange={(e) => {
                          const newCards = [...content.shopBy.cards];
                          newCards[index].buttonUrl = e.target.value;
                          setContent({
                            ...content,
                            shopBy: { ...content.shopBy, cards: newCards },
                          });
                        }}
                        placeholder="/shop?category=treadmill"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Badge */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={card.badge?.enabled || false}
                          onChange={(e) => {
                            const newCards = [...content.shopBy.cards];
                            newCards[index].badge = {
                              enabled: e.target.checked,
                              value: card.badge?.value || "12",
                              label: card.badge?.label || "MPH Speed",
                            };
                            setContent({
                              ...content,
                              shopBy: { ...content.shopBy, cards: newCards },
                            });
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <label className="text-xs font-medium text-gray-700">Show Badge</label>
                      </div>
                      {card.badge?.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Badge Value (e.g., 12)"
                            value={card.badge.value}
                            onChange={(e) => {
                              const newCards = [...content.shopBy.cards];
                              newCards[index].badge = { ...newCards[index].badge!, value: e.target.value };
                              setContent({
                                ...content,
                                shopBy: { ...content.shopBy, cards: newCards },
                              });
                            }}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Badge Label (e.g., MPH Speed)"
                            value={card.badge.label}
                            onChange={(e) => {
                              const newCards = [...content.shopBy.cards];
                              newCards[index].badge = { ...newCards[index].badge!, label: e.target.value };
                              setContent({
                                ...content,
                                shopBy: { ...content.shopBy, cards: newCards },
                              });
                            }}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
