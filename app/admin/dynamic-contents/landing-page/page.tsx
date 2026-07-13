"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Eye, ArrowRight, Edit2, LayoutGrid, Video, ChevronDown } from "lucide-react";
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

type HeroLayout = "grid" | "video";

interface HeroVideo {
  video: string;
  title: string;
  buttonText: string;
  buttonUrl: string;
  discountBadge?: {
    enabled: boolean;
    text: string;
    percentage: string;
  };
}

// Must stay in sync with the server-side limits in /api/admin/upload.
const MAX_VIDEO_MB = 50;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

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

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

interface RdxGallerySection {
  id: string;
  enabled: boolean;
  sectionTitle: string;
  items: GalleryItem[];
}

interface SuccessStory {
  id: string;
  name: string;
  media: string;
  mediaType: "image" | "video";
  description: string;
}

interface SuccessStoriesSection {
  id: string;
  enabled: boolean;
  sectionTitle: string;
  stories: SuccessStory[];
}

interface PerformanceFrame {
  id: string;
  image: string;
  alt: string;
}

interface PerformanceFrameSection {
  id: string;
  enabled: boolean;
  sectionTitle: string;
  frames: PerformanceFrame[];
}

export default function LandingPageManagement() {
  const [sections, setSections] = useState<HeroSection[]>([]);
  const [heroLayout, setHeroLayout] = useState<HeroLayout>("grid");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [heroVideo, setHeroVideo] = useState<HeroVideo>({
    video: "",
    title: "Elevate Your\nFitness Journey",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
    discountBadge: {
      enabled: false,
      text: "Up to",
      percentage: "40%",
    },
  });
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
  const [rdxGallerySection, setRdxGallerySection] = useState<RdxGallerySection>({
    id: "rdx-gallery",
    enabled: true,
    sectionTitle: "Shop From Our New RDX Gallery",
    items: [
      {
        id: "training",
        title: "Training",
        image: "/images/landing/rdx-gallery/9006e7dd80ecf645e78b83702112aee120de3a11.png",
        href: "/shop/training",
      },
      {
        id: "apparel",
        title: "Apparel",
        image: "/images/landing/rdx-gallery/12297c9eef97e322f7c7a0fa9318ed7d1d10ec28.png",
        href: "/shop/apparel",
      },
      {
        id: "boxing",
        title: "Boxing",
        image: "/images/landing/rdx-gallery/9126b5c957ee5df27dff7a87011a99f338fd0203.png",
        href: "/shop/boxing",
      },
      {
        id: "yoga",
        title: "Yoga",
        image: "/images/landing/rdx-gallery/09869b02227fe933f21baa27ed5b13a449885fed.png",
        href: "/shop/yoga",
      },
      {
        id: "weight-lifting",
        title: "Weight Lifting",
        image: "/images/landing/rdx-gallery/eed8082ab239304497367efe632ede29a9b94f41.png",
        href: "/shop/weight-lifting",
      },
    ],
  });
  const [successStoriesSection, setSuccessStoriesSection] = useState<SuccessStoriesSection>({
    id: "success-stories",
    enabled: true,
    sectionTitle: "Success Stories That Inspire Us",
    stories: [
      {
        id: "bangladesh-navy",
        name: "Bangladesh Navy",
        media: "/images/landing/success-stories/536c8bf6ec7eb35b36b1b8ec1953f4c098029a49.png",
        mediaType: "image",
        description: "The quality of equipment is exceptional, and their customer service is outstanding.",
      },
      {
        id: "huawei",
        name: "Huawei Enterprise",
        media: "/images/landing/success-stories/91409c62d10476f009ceb549f50a2ad82eecdbf1.png",
        mediaType: "image",
        description: "The durability and performance of their equipment is unmatched in the market.",
      },
      {
        id: "gulshan-club",
        name: "Gulshan Club",
        media: "/images/landing/success-stories/c720ec2c5e57a0bc8d6ddfb287ceee26a9140229.png",
        mediaType: "image",
        description: "The yoga and flexibility equipment from Shah Sports is top-notch. Great value for money!",
      },
      {
        id: "cocord",
        name: "Cocord Real-Estate",
        media: "/images/landing/success-stories/cfa8138ad5135723dcedad5236627bc4d080c002.png",
        mediaType: "image",
        description: "The quality of equipment is exceptional, and their customer service is outstanding.",
      },
    ],
  });
  const [performanceFrameSection, setPerformanceFrameSection] = useState<PerformanceFrameSection>({
    id: "performance-frame",
    enabled: true,
    sectionTitle: "Performance in Every Frame",
    frames: [
      { id: "frame-1", image: "/images/landing/performance-frame/image-1.jpg", alt: "Strength Training" },
      { id: "frame-2", image: "/images/landing/performance-frame/image-2.jpg", alt: "Boxing" },
      { id: "frame-3", image: "/images/landing/performance-frame/image-3.jpg", alt: "Cycling" },
      { id: "frame-4", image: "/images/landing/performance-frame/image-4.jpg", alt: "Cardio" },
      { id: "frame-5", image: "/images/landing/performance-frame/image-5.png", alt: "Tennis" },
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
        if (data.heroLayout === "video" || data.heroLayout === "grid") {
          setHeroLayout(data.heroLayout);
        }
        if (data.heroVideo) {
          setHeroVideo((prev) => ({ ...prev, ...data.heroVideo }));
        }
        if (data.preOrderSection) {
          setPreOrderSection(data.preOrderSection);
        }
        if (data.promoCardsSection) {
          setPromoCardsSection(data.promoCardsSection);
        }
        if (data.rdxGallerySection) {
          setRdxGallerySection(data.rdxGallerySection);
        }
        if (data.successStoriesSection) {
          setSuccessStoriesSection(data.successStoriesSection);
        }
        if (data.performanceFrameSection) {
          setPerformanceFrameSection(data.performanceFrameSection);
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

  const handleHeroVideoUpload = async (file: File, inputElement?: HTMLInputElement) => {
    // Validate before sending: uploading 50MB only to be rejected server-side is a
    // slow way to find out, and this box has little headroom.
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      alert("Please choose an MP4 or WebM video.");
      if (inputElement) inputElement.value = "";
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_VIDEO_MB) {
      alert(
        `That video is ${Math.round(sizeMb)}MB. The limit is ${MAX_VIDEO_MB}MB — ` +
          `please compress it before uploading.`
      );
      if (inputElement) inputElement.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/hero-video");

    setUploadingVideo(true);
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setHeroVideo((prev) => ({ ...prev, video: data.url }));
        if (inputElement) inputElement.value = "";
      } else {
        alert(data.error || "Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
    } finally {
      setUploadingVideo(false);
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

  const handleRdxGalleryImageUpload = async (itemId: string, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/rdx-gallery");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newItems = rdxGallerySection.items.map(item =>
          item.id === itemId ? { ...item, image: data.url } : item
        );
        setRdxGallerySection({
          ...rdxGallerySection,
          items: newItems,
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

  const handleSuccessStoryImageUpload = async (storyId: string, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/success-stories");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
        const newStories = successStoriesSection.stories.map(story =>
          story.id === storyId ? { ...story, media: data.url, mediaType } : story
        );
        setSuccessStoriesSection({
          ...successStoriesSection,
          stories: newStories,
        });
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert("Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Error uploading media");
    }
  };

  const handlePerformanceFrameImageUpload = async (frameId: string, file: File, inputElement?: HTMLInputElement) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "landing/performance-frame");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newFrames = performanceFrameSection.frames.map(frame =>
          frame.id === frameId ? { ...frame, image: data.url } : frame
        );
        setPerformanceFrameSection({
          ...performanceFrameSection,
          frames: newFrames,
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

  const handleAddPerformanceFrame = () => {
    const newFrame: PerformanceFrame = {
      id: `frame-${Date.now()}`,
      image: "/images/landing/performance-frame/image-1.jpg",
      alt: "New Frame",
    };
    setPerformanceFrameSection({
      ...performanceFrameSection,
      frames: [...performanceFrameSection.frames, newFrame],
    });
  };

  const handleRemovePerformanceFrame = (frameId: string) => {
    if (performanceFrameSection.frames.length <= 3) {
      alert("You must have at least 3 frames in the carousel");
      return;
    }
    const newFrames = performanceFrameSection.frames.filter(frame => frame.id !== frameId);
    setPerformanceFrameSection({
      ...performanceFrameSection,
      frames: newFrames,
    });
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
        body: JSON.stringify({ heroLayout, heroVideo, sections, preOrderSection, promoCardsSection, rdxGallerySection, successStoriesSection, performanceFrameSection }),
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landing Page - Hero Section</h1>
            <p className="mt-2 text-gray-600">Click on any section to edit content and images</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Preview Live
            </a>
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

        {/* Hero Section Preview - Exact Replica */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section Preview</h2>

            {/* Layout mode toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setHeroLayout("grid")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  heroLayout === "grid"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid Layout
              </button>
              <button
                type="button"
                onClick={() => setHeroLayout("video")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  heroLayout === "video"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Video className="h-4 w-4" />
                Full Video
              </button>
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600">
            {heroLayout === "grid"
              ? "Showing the 4-tile image grid. Click any tile to edit it."
              : "Showing a single full-width video. Upload an MP4 or WebM and set the overlay text."}
          </p>

          {/* ---------- VIDEO MODE ---------- */}
          {heroLayout === "video" && (
            <div className="mx-auto w-full max-w-[1400px]">
              {/* Live preview */}
              <div className="relative mb-6 h-[300px] w-full overflow-hidden rounded-lg bg-gray-100 md:h-[500px]">
                {heroVideo.video ? (
                  // No `controls` — the live hero has none, and the overlay must be
                  // what the admin actually sees.
                  <video
                    key={heroVideo.video}
                    src={heroVideo.video}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400">
                    <Video className="mb-3 h-12 w-12" />
                    <p className="text-sm font-medium">No video uploaded yet</p>
                    <p className="mt-1 text-xs">
                      The homepage will keep showing the grid layout until you upload one.
                    </p>
                  </div>
                )}

                {heroVideo.video && (
                  <>
                    {/* Mirrors the live full-bleed hero so the preview is accurate. */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-8 pb-14">
                      <div className="max-w-2xl">
                        {heroVideo.title && (
                          <h2 className="mb-5 text-3xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-5xl">
                            {renderTitle(heroVideo.title)}
                          </h2>
                        )}
                        {heroVideo.buttonText && (
                          <div className="inline-flex h-12 items-center gap-2 rounded-md bg-[#FFD700] px-7 text-[16px] font-semibold text-black shadow-xl">
                            {heroVideo.buttonText} <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                    {heroVideo.discountBadge?.enabled && (
                      <div className="pointer-events-none absolute bottom-14 right-8 z-10 flex h-28 w-28 items-center justify-center rounded-full bg-[#FF5722] shadow-2xl md:h-32 md:w-32">
                        <div className="text-center">
                          <div className="text-xs font-medium text-white">
                            {heroVideo.discountBadge.text}
                          </div>
                          <div className="text-3xl font-bold leading-none text-white">
                            {heroVideo.discountBadge.percentage}
                          </div>
                          <div className="text-xs font-medium text-white">Discounts</div>
                        </div>
                      </div>
                    )}
                    <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
                      <ChevronDown className="h-6 w-6 animate-bounce text-white/70" />
                    </div>
                  </>
                )}
              </div>

              {/* Video controls */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hero Video
                  </label>
                  <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    <div className="text-center text-gray-500">
                      <Upload className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm font-medium">
                        {uploadingVideo
                          ? "Uploading..."
                          : heroVideo.video
                          ? "Change Video"
                          : "Upload Video"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      disabled={uploadingVideo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroVideoUpload(file, e.target);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    MP4 or WebM, up to {MAX_VIDEO_MB}MB. The video is muted and looped, so
                    it should work without sound.
                  </p>
                  {heroVideo.video && (
                    <button
                      type="button"
                      onClick={() => setHeroVideo({ ...heroVideo, video: "" })}
                      className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove video
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title (use a new line for line breaks)
                    </label>
                    <textarea
                      value={heroVideo.title}
                      onChange={(e) => setHeroVideo({ ...heroVideo, title: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Elevate Your&#10;Fitness Journey"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={heroVideo.buttonText}
                        onChange={(e) => setHeroVideo({ ...heroVideo, buttonText: e.target.value })}
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
                        value={heroVideo.buttonUrl}
                        onChange={(e) => setHeroVideo({ ...heroVideo, buttonUrl: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="/shop"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={heroVideo.discountBadge?.enabled ?? false}
                        onChange={(e) =>
                          setHeroVideo({
                            ...heroVideo,
                            discountBadge: {
                              text: heroVideo.discountBadge?.text ?? "Up to",
                              percentage: heroVideo.discountBadge?.percentage ?? "40%",
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
                    {heroVideo.discountBadge?.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Badge Text</label>
                          <input
                            type="text"
                            placeholder="Up to"
                            value={heroVideo.discountBadge.text}
                            onChange={(e) =>
                              setHeroVideo({
                                ...heroVideo,
                                discountBadge: {
                                  ...heroVideo.discountBadge!,
                                  text: e.target.value,
                                },
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-600">Percentage</label>
                          <input
                            type="text"
                            placeholder="40%"
                            value={heroVideo.discountBadge.percentage}
                            onChange={(e) =>
                              setHeroVideo({
                                ...heroVideo,
                                discountBadge: {
                                  ...heroVideo.discountBadge!,
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
                </div>
              </div>
            </div>
          )}

          {/* ---------- GRID MODE ---------- */}
          {heroLayout === "grid" && (
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
          )}
        </div>

        {/* Pre-Order Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {/* RDX Gallery Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">RDX Gallery Section Preview</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rdxGallerySection.enabled}
                onChange={(e) => setRdxGallerySection({ ...rdxGallerySection, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enable Section</span>
            </label>
          </div>

          {rdxGallerySection.enabled && (
            <div className="mx-auto w-full max-w-[1400px]">
              <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
                {rdxGallerySection.sectionTitle}
              </h2>

              {/* Grid Layout matching the public view */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
                {/* Left side: 2x2 grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[60fr_40fr] md:grid-rows-2">
                  {/* Training - Top Left */}
                  <div
                    className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[2px] bg-gray-100"
                    onClick={() => setEditingSection(`rdx-gallery-${rdxGallerySection.items[0].id}`)}
                  >
                    <Image
                      src={rdxGallerySection.items[0].image}
                      alt={rdxGallerySection.items[0].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        <Edit2 className="h-4 w-4" />
                        Click to Edit
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {rdxGallerySection.items[0].title}
                      </h3>
                    </div>
                  </div>

                  {/* Apparel - Top Right */}
                  <div
                    className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[2px] bg-gray-100"
                    onClick={() => setEditingSection(`rdx-gallery-${rdxGallerySection.items[1].id}`)}
                  >
                    <Image
                      src={rdxGallerySection.items[1].image}
                      alt={rdxGallerySection.items[1].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        <Edit2 className="h-4 w-4" />
                        Click to Edit
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {rdxGallerySection.items[1].title}
                      </h3>
                    </div>
                  </div>

                  {/* Yoga - Bottom Left */}
                  <div
                    className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[2px] bg-gray-100"
                    onClick={() => setEditingSection(`rdx-gallery-${rdxGallerySection.items[3].id}`)}
                  >
                    <Image
                      src={rdxGallerySection.items[3].image}
                      alt={rdxGallerySection.items[3].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        <Edit2 className="h-4 w-4" />
                        Click to Edit
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {rdxGallerySection.items[3].title}
                      </h3>
                    </div>
                  </div>

                  {/* Weight Lifting - Bottom Right */}
                  <div
                    className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[2px] bg-gray-100"
                    onClick={() => setEditingSection(`rdx-gallery-${rdxGallerySection.items[4].id}`)}
                  >
                    <Image
                      src={rdxGallerySection.items[4].image}
                      alt={rdxGallerySection.items[4].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        <Edit2 className="h-4 w-4" />
                        Click to Edit
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {rdxGallerySection.items[4].title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Boxing - Right side tall card */}
                <div
                  className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[2px] bg-gray-100 md:h-full"
                  onClick={() => setEditingSection(`rdx-gallery-${rdxGallerySection.items[2].id}`)}
                >
                  <Image
                    src={rdxGallerySection.items[2].image}
                    alt={rdxGallerySection.items[2].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                      <Edit2 className="h-4 w-4" />
                      Click to Edit
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 md:bottom-6 md:left-6">
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {rdxGallerySection.items[2].title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Stories Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Success Stories Section Preview</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={successStoriesSection.enabled}
                onChange={(e) => setSuccessStoriesSection({ ...successStoriesSection, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Enable Section</span>
            </label>
          </div>

          {successStoriesSection.enabled && (
            <div className="mx-auto w-full max-w-[1400px]">
              <h2 className="mb-10 max-w-lg text-4xl font-semibold leading-tight text-black md:text-5xl">
                {successStoriesSection.sectionTitle}
              </h2>

              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {successStoriesSection.stories.map((story) => (
                  <div
                    key={story.id}
                    className="group relative h-[400px] cursor-pointer overflow-hidden rounded-xs bg-gray-100"
                    onClick={() => setEditingSection(`success-story-${story.id}`)}
                  >
                    {story.mediaType === "video" ? (
                      <video
                        src={story.media}
                        className="h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <Image
                        src={story.media}
                        alt={story.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Edit Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                        <Edit2 className="h-4 w-4" />
                        Click to Edit
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <h3 className="mb-2 text-xl font-bold text-white">{story.name}</h3>
                      <p className="text-sm leading-relaxed text-gray-200">{story.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Performance Frame Section Preview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Performance Frame Section Preview</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddPerformanceFrame}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                <Upload className="h-4 w-4" />
                Add Frame
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={performanceFrameSection.enabled}
                  onChange={(e) => setPerformanceFrameSection({ ...performanceFrameSection, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Enable Section</span>
              </label>
            </div>
          </div>

          {performanceFrameSection.enabled && (
            <div className="mx-auto w-full max-w-[1400px]">
              <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
                {performanceFrameSection.sectionTitle}
              </h2>

              {/* Grid Layout - Dynamic frames */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {performanceFrameSection.frames.map((frame) => (
                  <div
                    key={frame.id}
                    className="group relative h-[200px] overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={frame.image}
                      alt={frame.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Edit and Delete Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingSection(`performance-frame-${frame.id}`)}
                        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-100"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemovePerformanceFrame(frame.id)}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Alt Text Label */}
                    <div className="absolute bottom-2 left-2 right-2 z-10">
                      <p className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded truncate">
                        {frame.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Total Frames: {performanceFrameSection.frames.length} (Minimum: 3)
              </p>
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

        {/* Edit Modal for RDX Gallery Items */}
        <EditModal
          isOpen={!!(editingSection?.startsWith("rdx-gallery-"))}
          onClose={() => setEditingSection(null)}
          title={`Edit ${rdxGallerySection.items.find(item => editingSection === `rdx-gallery-${item.id}`)?.title || "Gallery Item"}`}
        >
          {editingSection?.startsWith("rdx-gallery-") && (() => {
            const itemId = editingSection.replace("rdx-gallery-", "");
            const item = rdxGallerySection.items.find(i => i.id === itemId);
            
            if (!item) return null;

            return (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gallery Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {!item.image && (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                      <div className="text-center text-white">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">
                          {item.image ? "Change Image" : "Upload Image"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleRdxGalleryImageUpload(itemId, file, e.target);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
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
                      value={rdxGallerySection.sectionTitle}
                      onChange={(e) => setRdxGallerySection({ ...rdxGallerySection, sectionTitle: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Shop From Our New RDX Gallery"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = rdxGallerySection.items.map(i =>
                          i.id === itemId ? { ...i, title: e.target.value } : i
                        );
                        setRdxGallerySection({ ...rdxGallerySection, items: newItems });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Training"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => {
                        const newItems = rdxGallerySection.items.map(i =>
                          i.id === itemId ? { ...i, href: e.target.value } : i
                        );
                        setRdxGallerySection({ ...rdxGallerySection, items: newItems });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="/shop/training"
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      This gallery item will be displayed in the RDX Gallery section on the landing page.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </EditModal>

        {/* Edit Modal for Success Stories */}
        <EditModal
          isOpen={!!(editingSection?.startsWith("success-story-"))}
          onClose={() => setEditingSection(null)}
          title={`Edit ${successStoriesSection.stories.find(story => editingSection === `success-story-${story.id}`)?.name || "Success Story"}`}
        >
          {editingSection?.startsWith("success-story-") && (() => {
            const storyId = editingSection.replace("success-story-", "");
            const story = successStoriesSection.stories.find(s => s.id === storyId);
            
            if (!story) return null;

            return (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Media Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Story Media (Image or Video)
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    {story.media && story.mediaType === "video" ? (
                      <video
                        src={story.media}
                        className="h-full w-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : story.media ? (
                      <Image
                        src={story.media}
                        alt={story.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                      <div className="text-center text-white">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">
                          {story.media ? "Change Media" : "Upload Media"}
                        </p>
                        <p className="text-xs mt-1">Image or Video (Max 50MB)</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size (50MB max)
                          if (file.size > 50 * 1024 * 1024) {
                            alert("File size must be less than 50MB");
                            e.target.value = "";
                            return;
                          }
                          handleSuccessStoryImageUpload(storyId, file, e.target);
                        }
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Current type: <span className="font-medium">{story.mediaType}</span>
                  </p>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={successStoriesSection.sectionTitle}
                      onChange={(e) => setSuccessStoriesSection({ ...successStoriesSection, sectionTitle: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Success Stories That Inspire Us"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={story.name}
                      onChange={(e) => {
                        const newStories = successStoriesSection.stories.map(s =>
                          s.id === storyId ? { ...s, name: e.target.value } : s
                        );
                        setSuccessStoriesSection({ ...successStoriesSection, stories: newStories });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Bangladesh Navy"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={story.description}
                      onChange={(e) => {
                        const newStories = successStoriesSection.stories.map(s =>
                          s.id === storyId ? { ...s, description: e.target.value } : s
                        );
                        setSuccessStoriesSection({ ...successStoriesSection, stories: newStories });
                      }}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="The quality of equipment is exceptional..."
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      Upload an image or video (max 50MB). Videos will autoplay on hover in the public view.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </EditModal>

        {/* Edit Modal for Performance Frame */}
        <EditModal
          isOpen={!!(editingSection?.startsWith("performance-frame-"))}
          onClose={() => setEditingSection(null)}
          title={`Edit ${performanceFrameSection.frames.find(frame => editingSection === `performance-frame-${frame.id}`)?.alt || "Performance Frame"}`}
        >
          {editingSection?.startsWith("performance-frame-") && (() => {
            const frameId = editingSection.replace("performance-frame-", "");
            const frame = performanceFrameSection.frames.find(f => f.id === frameId);
            
            if (!frame) return null;

            return (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Frame Image
                  </label>
                  <div className="relative h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-orange-400">
                    {frame.image ? (
                      <Image
                        src={frame.image}
                        alt={frame.alt}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/50 hover:opacity-100">
                      <div className="text-center text-white">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm font-medium">
                          {frame.image ? "Change Image" : "Upload Image"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePerformanceFrameImageUpload(frameId, file, e.target);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
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
                      value={performanceFrameSection.sectionTitle}
                      onChange={(e) => setPerformanceFrameSection({ ...performanceFrameSection, sectionTitle: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Performance in Every Frame"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Alt Text / Description
                    </label>
                    <input
                      type="text"
                      value={frame.alt}
                      onChange={(e) => {
                        const newFrames = performanceFrameSection.frames.map(f =>
                          f.id === frameId ? { ...f, alt: e.target.value } : f
                        );
                        setPerformanceFrameSection({ ...performanceFrameSection, frames: newFrames });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Strength Training"
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      This frame will be displayed in the Performance Frame carousel section on the landing page. The carousel auto-plays every 2 seconds.
                    </p>
                    {performanceFrameSection.frames.length > 3 && (
                      <button
                        onClick={() => {
                          handleRemovePerformanceFrame(frameId);
                          setEditingSection(null);
                        }}
                        className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Delete This Frame
                      </button>
                    )}
                    {performanceFrameSection.frames.length <= 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        Cannot delete - minimum 3 frames required
                      </p>
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
