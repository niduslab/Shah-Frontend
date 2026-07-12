"use client";

import { useState, useEffect, useRef } from "react";
import { Save, ArrowLeft, Plus, Trash2, Search, ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useBrands } from "@/lib/hooks/public/useBrands";
import { useCategories } from "@/lib/hooks/public/useCategories";
import { toast } from "sonner";

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
  promoBanner?: {
    enabled: boolean;
    badge: string;
    title: string;
    highlightedText: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
    textColor: string;
  };
  featureSection1: {
    enabled: boolean;
    layout: "image-left" | "image-right";
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
  featureSection2: {
    enabled: boolean;
    layout: "image-left" | "image-right";
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
}

function CategorySearchSelect({
  flatCategories,
  value,
  onChange,
}: {
  flatCategories: { id: number; name: string; slug: string; label: string }[];
  value: string;
  onChange: (cat: { id: number; name: string; slug: string; label: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = flatCategories.find((c) => c.slug === value);
  const filtered = query.trim()
    ? flatCategories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : flatCategories;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-gray-500">Select Category</label>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setQuery(""); }}
        className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:border-gray-400"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.name : "— pick a category —"}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="relative border-b border-gray-100 px-3 py-2">
            <Search className="absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded border border-gray-200 py-1.5 pl-7 pr-3 text-sm focus:border-orange-400 focus:outline-none"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-400">No categories found</li>
            ) : (
              filtered.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => { onChange(cat); setOpen(false); setQuery(""); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-orange-50 hover:text-orange-700 ${
                      cat.slug === value ? "bg-orange-50 font-medium text-orange-700" : "text-gray-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function BrandPageEditor() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;

  const { data: brandsData, isLoading: brandsLoading, error: brandsError } = useBrands();
  const brands = brandsData?.data || [];
  const brand = brands.find((b: any) => b.id === parseInt(brandId));

  const { data: categoriesData } = useCategories();

  // Flatten nested category tree into a single list for the selector
  const flatCategories = (() => {
    const result: { id: number; name: string; slug: string; label: string }[] = [];
    const walk = (cats: any[], depth: number) => {
      for (const cat of cats) {
        result.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          label: "—".repeat(depth) + (depth > 0 ? " " : "") + cat.name,
        });
        if (cat.children?.length) walk(cat.children, depth + 1);
      }
    };
    walk((categoriesData as any)?.data || [], 0);
    return result;
  })();

  const [content, setContent] = useState<BrandPageContent>({
    hero: {
      enabled: true,
      backgroundImage: "/images/brand-page/brand-page-hero-img.png",
      title: "Turn Your Home\nInto A Complete",
      highlightedText: "Fitness Space",
      description: "",
      buttonText: "Shop Now",
      buttonUrl: "",
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
    promoBanner: {
      enabled: true,
      badge: "LIMITED-TIME EVENT",
      title: "Fitness",
      highlightedText: "30% off",
      subtitle: "Essentials",
      description: "Save on select NordicTrack equipment during the Winter Sale Event",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      backgroundColor: "#3D2817",
      textColor: "#FFFFFF",
    },
    featureSection1: {
      enabled: true,
      layout: "image-left",
      image: "",
      title: "Smart Rowing. Full-Body Results. Real Progress.",
      description: "Experience a powerful, low-impact workout that engages your entire body. Smart rowing machines automatically adjust resistance to match your trainer's intensity, helping you build strength, endurance, and consistency— every session, every stroke.",
      buttonText: "Shop Rowers",
      buttonUrl: "/shop",
      backgroundColor: "#E8DED3",
    },
    featureSection2: {
      enabled: true,
      layout: "image-right",
      image: "",
      title: "Where Refined Design meets uncompromising power.",
      description: "Experience a powerful, low-impact workout that engages your entire body. Smart rowing machines automatically adjust resistance to match your trainer's intensity, helping you build strength, endurance, and consistency— every session, every stroke.",
      buttonText: "Shop Rowers",
      buttonUrl: "/shop",
      backgroundColor: "#E8DED3",
    },
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      setContent((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          buttonUrl: `/shop?brand=${brand.slug}`,
        },
      }));
      fetchBrandContent();
    }
  }, [brand]);

  const fetchBrandContent = async () => {
    try {
      console.log('[Brand Page Editor] Fetching content for brand:', brandId);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/brand-pages/${brandId}?t=${timestamp}`, {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Brand Page Editor] Content loaded:', data);
        
        if (data.content) {
          // Merge loaded content with defaults to ensure new fields exist
          setContent((prev) => ({
            ...prev,
            ...data.content,
            hero: {
              ...prev.hero,
              ...data.content.hero,
              buttonUrl: prev.hero.buttonUrl,
            },
            promoBanner: data.content.promoBanner || prev.promoBanner,
            featureSection1: data.content.featureSection1 || prev.featureSection1,
            featureSection2: data.content.featureSection2 || prev.featureSection2,
          }));
          console.log('[Brand Page Editor] Content set successfully');
        } else {
          console.log('[Brand Page Editor] No content found, using defaults');
        }
      } else {
        console.error('[Brand Page Editor] Failed to fetch content:', response.status);
      }
    } catch (error) {
      console.error("[Brand Page Editor] Error fetching brand content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('[Brand Page Editor] Saving content for brand:', brandId);
      console.log('[Brand Page Editor] Content:', content);
      
      const response = await fetch(`/api/admin/brand-pages/${brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const responseData = await response.json();
      console.log('[Brand Page Editor] Save response:', responseData);

      if (response.ok) {
        toast.success("Brand page saved successfully!", {
          description: `Content saved to brand-pages/${brandId}.json`,
          duration: 3000,
        });
        
        // Refresh the content to verify it was saved
        await fetchBrandContent();
      } else {
        console.error('[Brand Page Editor] Save failed:', responseData);
        toast.error("Failed to save brand page", {
          description: responseData.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("[Brand Page Editor] Error saving:", error);
      toast.error("Error saving brand page", {
        description: "Check console for details",
      });
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

  if (loading || brandsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading brand data...</p>
        </div>
      </div>
    );
  }

  if (brandsError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Connection Error</h2>
          <p className="mb-4 text-gray-600">
            Unable to connect to the backend API. Please make sure your backend server is running.
          </p>
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4 text-left">
            <p className="text-sm text-red-800">
              <strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/brands")}
            className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="max-w-2xl text-center px-4">
          <div className="mb-6 text-6xl">🔍</div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Brand Not Found in Database</h2>
          <p className="mb-6 text-gray-600">
            Brand ID <code className="bg-gray-200 px-2 py-1 rounded">{brandId}</code> doesn't exist in your backend database.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">💡 How to Fix:</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Go to the <strong>Brands</strong> page</li>
              <li>Click <strong>"Add Brand"</strong> button</li>
              <li>Fill in brand details (name, slug, logo)</li>
              <li>Save the brand</li>
              <li>Then come back here to customize the page</li>
            </ol>
          </div>

          {brands.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">📋 Available Brands:</h3>
              <div className="space-y-2">
                {brands.slice(0, 5).map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between bg-white rounded p-3">
                    <div>
                      <p className="font-medium text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-500">ID: {b.id} | Slug: {b.slug}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/dynamic-contents/brand-pages-db/${b.id}`)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Edit Page →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/admin/brands")}
              className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
            >
              Go to Brands
            </button>
            {brands.length > 0 && (
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/brands")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{brand.name} - Brand Page</h1>
            <p className="mt-2 text-gray-600">Manage content for {brand.name} brand page</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => {
                const timestamp = new Date().getTime();
                window.open(`/brand/${brand.slug}?t=${timestamp}`, '_blank');
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-6 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
              title="Open public page in new tab with fresh content"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Public Page
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Brand Page Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Brand ID:</strong> {brand.id}</p>
                <p><strong>Brand Slug:</strong> {brand.slug}</p>
                <p><strong>Public URL:</strong> <a href={`/brand/${brand.slug}`} target="_blank" className="underline hover:text-blue-600">/brand/{brand.slug}</a></p>
                <p className="mt-2 text-xs text-blue-700">
                  💡 <strong>Tip:</strong> After saving, click "View Public Page" to see your changes. The page always loads fresh content.
                </p>
                <p className="text-xs text-blue-700">
                  📁 Content is saved to: <code className="bg-blue-100 px-1 rounded">public/content/brand-pages/{brand.id}.json</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
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
                    <img
                      src={content.hero.backgroundImage}
                      alt="Hero background"
                      className="absolute inset-0 h-full w-full object-cover"
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
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-400">Auto-set to the brand shop URL</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Categories Section</h2>
            <div className="flex flex-wrap items-center gap-4">
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
                          href: brand ? `/shop?brand=${brand.slug}` : "/shop",
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
                      {/* Searchable category selector — auto-fills name + href */}
                      <CategorySearchSelect
                        flatCategories={flatCategories}
                        value={new URLSearchParams(item.href.split("?")[1] ?? "").get("category") ?? ""}
                        onChange={(cat) => {
                          const newItems = [...content.categories.items];
                          const brandParam = brand ? `&brand=${brand.slug}` : "";
                          newItems[index] = {
                            ...newItems[index],
                            name: cat.name,
                            href: `/shop?category=${cat.slug}${brandParam}`,
                          };
                          setContent({
                            ...content,
                            categories: { ...content.categories, items: newItems },
                          });
                        }}
                      />

                      <div className="relative h-32 overflow-hidden rounded-lg border border-gray-300">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />
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
                        readOnly
                        placeholder="Select a category above"
                        className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Behind The Work Section */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
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
                        <img
                          src={content.behindTheWork.images.left}
                          alt="Left"
                          className="absolute inset-0 h-full w-full object-cover"
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
                        <img
                          src={content.behindTheWork.images.center}
                          alt="Center"
                          className="absolute inset-0 h-full w-full object-cover"
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
                        <img
                          src={content.behindTheWork.images.right}
                          alt="Right"
                          className="absolute inset-0 h-full w-full object-cover"
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
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Shop By Section</h2>
            <div className="flex flex-wrap items-center gap-4">
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
                        <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
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

        {/* Promo Banner Section */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Promotional Banner</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.promoBanner?.enabled || false}
                onChange={(e) => setContent({
                  ...content,
                  promoBanner: { 
                    ...(content.promoBanner || {
                      badge: "LIMITED-TIME EVENT",
                      title: "Fitness",
                      highlightedText: "30% off",
                      subtitle: "Essentials",
                      description: "Save on select NordicTrack equipment during the Winter Sale Event",
                      buttonText: "Shop Now",
                      buttonUrl: "/shop",
                      backgroundColor: "#3D2817",
                      textColor: "#FFFFFF",
                    }),
                    enabled: e.target.checked 
                  }
                })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>

          {content.promoBanner?.enabled && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Badge Text</label>
                <input
                  type="text"
                  value={content.promoBanner?.badge || ""}
                  onChange={(e) => setContent({
                    ...content,
                    promoBanner: { ...content.promoBanner!, badge: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="LIMITED-TIME EVENT"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Title (Before Highlight)</label>
                  <input
                    type="text"
                    value={content.promoBanner?.title || ""}
                    onChange={(e) => setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner!, title: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Fitness"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Highlighted Text (Yellow)</label>
                  <input
                    type="text"
                    value={content.promoBanner?.highlightedText || ""}
                    onChange={(e) => setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner!, highlightedText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="30% off"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle (After Highlight)</label>
                <input
                  type="text"
                  value={content.promoBanner?.subtitle || ""}
                  onChange={(e) => setContent({
                    ...content,
                    promoBanner: { ...content.promoBanner!, subtitle: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Essentials"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={content.promoBanner?.description || ""}
                  onChange={(e) => setContent({
                    ...content,
                    promoBanner: { ...content.promoBanner!, description: e.target.value }
                  })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Save on select equipment during the Winter Sale Event"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={content.promoBanner?.buttonText || ""}
                    onChange={(e) => setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner!, buttonText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Shop Now"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={content.promoBanner?.buttonUrl || ""}
                    onChange={(e) => setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner!, buttonUrl: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.promoBanner?.backgroundColor || "#3D2817"}
                      onChange={(e) => setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner!, backgroundColor: e.target.value }
                      })}
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={content.promoBanner?.backgroundColor || "#3D2817"}
                      onChange={(e) => setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner!, backgroundColor: e.target.value }
                      })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                      placeholder="#3D2817"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.promoBanner?.textColor || "#FFFFFF"}
                      onChange={(e) => setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner!, textColor: e.target.value }
                      })}
                      className="h-10 w-20 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={content.promoBanner?.textColor || "#FFFFFF"}
                      onChange={(e) => setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner!, textColor: e.target.value }
                      })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 rounded-lg border-2 border-gray-200 p-1">
                <div 
                  className="rounded-lg py-16 text-center"
                  style={{ 
                    backgroundColor: content.promoBanner?.backgroundColor || "#3D2817",
                    color: content.promoBanner?.textColor || "#FFFFFF"
                  }}
                >
                  <p className="mb-4 text-xs font-medium uppercase tracking-wider opacity-80">
                    {content.promoBanner?.badge || "LIMITED-TIME EVENT"}
                  </p>
                  <h2 className="mb-2 text-4xl font-bold">
                    {content.promoBanner?.title || "Fitness"}{" "}
                    <span className="text-yellow-400">
                      {content.promoBanner?.highlightedText || "30% off"}
                    </span>
                  </h2>
                  <h3 className="mb-4 text-4xl font-bold">
                    {content.promoBanner?.subtitle || "Essentials"}
                  </h3>
                  <p className="mb-6 text-sm opacity-90">
                    {content.promoBanner?.description || "Save on select equipment during the Winter Sale Event"}
                  </p>
                  <button className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-gray-900">
                    {content.promoBanner?.buttonText || "Shop Now"} →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Section 1 */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Feature Section 1</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.featureSection1?.enabled || false}
                onChange={(e) => setContent({
                  ...content,
                  featureSection1: { 
                    ...(content.featureSection1 || {
                      layout: "image-left",
                      image: "",
                      title: "Smart Rowing. Full-Body Results. Real Progress.",
                      description: "Experience a powerful, low-impact workout that engages your entire body. Smart rowing machines automatically adjust resistance to match your trainer's intensity, helping you build strength, endurance, and consistency— every session, every stroke.",
                      buttonText: "Shop Rowers",
                      buttonUrl: "/shop",
                      backgroundColor: "#E8DED3",
                    }),
                    enabled: e.target.checked 
                  }
                })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>

          {content.featureSection1?.enabled && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Layout</label>
                <select
                  value={content.featureSection1?.layout || "image-left"}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection1: { ...content.featureSection1!, layout: e.target.value as "image-left" | "image-right" }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="image-left">Image Left, Text Right</option>
                  <option value="image-right">Text Left, Image Right</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Feature Image</label>
                <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {content.featureSection1?.image && (
                    <img
                      src={content.featureSection1.image}
                      alt="Feature"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file, "brand-page/features");
                        if (url) {
                          setContent({
                            ...content,
                            featureSection1: { ...content.featureSection1!, image: url }
                          });
                        }
                      }
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={content.featureSection1?.title || ""}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection1: { ...content.featureSection1!, title: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Smart Rowing. Full-Body Results. Real Progress."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={content.featureSection1?.description || ""}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection1: { ...content.featureSection1!, description: e.target.value }
                  })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Experience a powerful, low-impact workout..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={content.featureSection1?.buttonText || ""}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection1: { ...content.featureSection1!, buttonText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Shop Rowers"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={content.featureSection1?.buttonUrl || ""}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection1: { ...content.featureSection1!, buttonUrl: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.featureSection1?.backgroundColor || "#E8DED3"}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection1: { ...content.featureSection1!, backgroundColor: e.target.value }
                    })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={content.featureSection1?.backgroundColor || "#E8DED3"}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection1: { ...content.featureSection1!, backgroundColor: e.target.value }
                    })}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="#E8DED3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Section 2 */}
        <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Feature Section 2</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.featureSection2?.enabled || false}
                onChange={(e) => setContent({
                  ...content,
                  featureSection2: { 
                    ...(content.featureSection2 || {
                      layout: "image-right",
                      image: "",
                      title: "Where Refined Design meets uncompromising power.",
                      description: "Experience a powerful, low-impact workout that engages your entire body. Smart rowing machines automatically adjust resistance to match your trainer's intensity, helping you build strength, endurance, and consistency— every session, every stroke.",
                      buttonText: "Shop Rowers",
                      buttonUrl: "/shop",
                      backgroundColor: "#E8DED3",
                    }),
                    enabled: e.target.checked 
                  }
                })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          </div>

          {content.featureSection2?.enabled && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Layout</label>
                <select
                  value={content.featureSection2?.layout || "image-right"}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection2: { ...content.featureSection2!, layout: e.target.value as "image-left" | "image-right" }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="image-left">Image Left, Text Right</option>
                  <option value="image-right">Text Left, Image Right</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Feature Image</label>
                <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {content.featureSection2?.image && (
                    <img
                      src={content.featureSection2.image}
                      alt="Feature"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file, "brand-page/features");
                        if (url) {
                          setContent({
                            ...content,
                            featureSection2: { ...content.featureSection2!, image: url }
                          });
                        }
                      }
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={content.featureSection2?.title || ""}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection2: { ...content.featureSection2!, title: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Where Refined Design meets uncompromising power."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={content.featureSection2?.description || ""}
                  onChange={(e) => setContent({
                    ...content,
                    featureSection2: { ...content.featureSection2!, description: e.target.value }
                  })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Experience a powerful, low-impact workout..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={content.featureSection2?.buttonText || ""}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection2: { ...content.featureSection2!, buttonText: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Shop Rowers"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={content.featureSection2?.buttonUrl || ""}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection2: { ...content.featureSection2!, buttonUrl: e.target.value }
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.featureSection2?.backgroundColor || "#E8DED3"}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection2: { ...content.featureSection2!, backgroundColor: e.target.value }
                    })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={content.featureSection2?.backgroundColor || "#E8DED3"}
                    onChange={(e) => setContent({
                      ...content,
                      featureSection2: { ...content.featureSection2!, backgroundColor: e.target.value }
                    })}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="#E8DED3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
