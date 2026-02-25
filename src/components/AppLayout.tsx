import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Send, ArrowLeftRight, History, Bitcoin, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const bottomNav = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Send", path: "/send", icon: Send },
  { title: "Convert", path: "/convert", icon: ArrowLeftRight },
  { title: "History", path: "/transactions", icon: History },
];

export default function AppLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <Bitcoin className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg text-gradient">VaultX</span>
        </div>
        <Link
          to="/settings"
          className={cn(
            "p-2 rounded-lg transition-colors",
            location.pathname === "/settings"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14 pb-20">
        <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-around h-16">
          {bottomNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
                <span className="text-[11px] font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
