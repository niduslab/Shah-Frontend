import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full bg-[#000939] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between py-2 px-4 md:px-6 text-xs font-medium">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>info@shahsports.com.bd</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>880-1615550080 | 880-1615550079 </span>
          </div>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <Link href="/find-store" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
            <MapPin className="h-3.5 w-3.5" />
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
