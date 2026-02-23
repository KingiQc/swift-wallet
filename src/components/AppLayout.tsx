import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Send, ArrowLeftRight, History, Shield,
  UserCheck, Menu, LogOut, Bitcoin, BarChart3, Users, FileCheck, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Send, ArrowLeftRight, History, Shield,
  UserCheck, BarChart3, Users, FileCheck, Settings,
};

const userNav = [
  { title: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { title: "Send Money", path: "/send", icon: "Send" },
  { title: "Convert", path: "/convert", icon: "ArrowLeftRight" },
  { title: "Transactions", path: "/transactions", icon: "History" },
  { title: "Escrow", path: "/escrow", icon: "Shield" },
  { title: "KYC", path: "/kyc", icon: "UserCheck" },
];

const adminNav = [
  { title: "Admin Panel", path: "/admin", icon: "BarChart3" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const allNav = [...userNav, ...adminNav];

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {allNav.map((item) => {
        const Icon = iconMap[item.icon] || LayoutDashboard;
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary/10 text-primary glow-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-4 py-3 mb-6">
          <Bitcoin className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-gradient">VaultX</h1>
        </div>
        <NavItems />
        <div className="mt-auto pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/login")}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <Bitcoin className="h-6 w-6 text-primary" />
          <span className="font-bold text-gradient">VaultX</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card border-border w-64 p-4">
            <SheetTitle className="text-gradient font-bold text-lg mb-6">VaultX</SheetTitle>
            <NavItems onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
