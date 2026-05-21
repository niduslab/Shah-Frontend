"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface SuccessStory {
  id: string;
  name: string;
  media: string;
  mediaType: "image" | "video";
  description: string;
}

interface SuccessStoriesData {
  enabled: boolean;
  sectionTitle: string;
  stories: SuccessStory[];
}

const DEFAULT_STORIES: SuccessStory[] = [
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
];

export function SuccessStories() {
  const sectionRef = useScrollReveal();
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [storiesData, setStoriesData] = useState<SuccessStoriesData>({
    enabled: true,
    sectionTitle: "Success Stories That Inspire Us",
    stories: DEFAULT_STORIES,
  });
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoriesData = async () => {
      try {
        const response = await fetch("/api/admin/hero-sections");
        if (response.ok) {
          const data = await response.json();
          if (data.successStoriesSection) {
            setStoriesData(data.successStoriesSection);
          }
        }
      } catch (error) {
        console.error("Error fetching success stories data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesData();
  }, []);

  const handleVideoClick = (storyId: string) => {
    const clickedVideo = videoRefs.current[storyId];
    if (!clickedVideo) return;

    if (playingVideo === storyId) {
      clickedVideo.pause();
      clickedVideo.muted = true;
      clickedVideo.currentTime = 0;
      setPlayingVideo(null);
      return;
    }

    if (playingVideo) {
      const currentVideo = videoRefs.current[playingVideo];
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.muted = true;
        currentVideo.currentTime = 0;
      }
    }

    clickedVideo.muted = false;
    clickedVideo.currentTime = 0;
    clickedVideo.play().catch((error) => {
      console.error("Error playing video:", error);
    });
    setPlayingVideo(storyId);
  };

  if (!storiesData.enabled || loading) {
    return null;
  }

  return (
    <div ref={sectionRef as React.RefObject<HTMLElement>} className="w-full bg-[#FFF9F0] py-16 px-4 md:px-6">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Header */}
        <div data-reveal className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-lg text-4xl font-semibold leading-tight text-black md:text-5xl">
            {storiesData.sectionTitle}
          </h2>
          <div className="flex gap-3">
            <button className="flex h-12 w-12 items-center justify-center rounded-xs bg-[#F3F4F6] text-black transition-colors hover:bg-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-xs bg-primary text-black transition-colors hover:bg-primary/90">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div data-reveal-stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {storiesData.stories.map((story) => (
            <div
              key={story.id}
              data-reveal
              className="story-card group relative h-[400px] overflow-hidden rounded-xs bg-gray-100"
            >
              {story.mediaType === "video" ? (
                <video
                  ref={(el) => { videoRefs.current[story.id] = el; }}
                  src={story.media}
                  className="h-full w-full object-cover cursor-pointer"
                  muted
                  loop
                  playsInline
                  onClick={() => handleVideoClick(story.id)}
                />
              ) : (
                <Image
                  src={story.media}
                  alt={story.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {story.mediaType === "video" && playingVideo !== story.id && (
                <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100 z-10 pointer-events-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                <h3 className="mb-2 text-xl font-bold text-white">{story.name}</h3>
                <p className="text-sm leading-relaxed text-gray-200">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
