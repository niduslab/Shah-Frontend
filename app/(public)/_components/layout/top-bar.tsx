import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full bg-[#000939] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 py-2 px-4 md:flex-row md:items-center md:justify-between md:px-6 text-xs font-medium">
        {/* Email - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">info@shahsports.com.bd</span>
        </div>

        {/* Phone - Always visible, centered on mobile */}
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-center md:text-left">+880 1615550014 | +880 1615550098</span>
        </div>

        {/* Links - Centered on mobile, right-aligned on desktop */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <Link href="/find-store" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Find Store</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-3 border-l border-secondary-foreground/40"></span>
          </div>
          <Link href="/track-order" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
