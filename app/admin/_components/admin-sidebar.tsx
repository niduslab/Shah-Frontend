import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Package
} from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-secondary text-secondary-foreground min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-black italic tracking-tight text-white">
          Shah Admin
        </h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link 
          href="/admin" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/admin/products" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <Package className="h-5 w-5" />
          <span>Products</span>
        </Link>
        <Link 
          href="/admin/orders" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Orders</span>
        </Link>
        <Link 
          href="/admin/customers" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <Users className="h-5 w-5" />
          <span>Customers</span>
        </Link>
        <Link 
          href="/admin/settings" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
