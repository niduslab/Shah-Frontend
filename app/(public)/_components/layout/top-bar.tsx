import { Phone, Mail, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between py-2 text-xs font-medium">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>880-1615550080 | 880-1615550079 | 880-1615550014</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>info@shahsports.com.bd</span>
          </div>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>Find Store</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 border-l border-secondary-foreground/40"></span>
            <span>Track Order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
