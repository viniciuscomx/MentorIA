import { Link, useLocation } from "wouter";
import { BookOpen, LayoutDashboard, Sparkles, User, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Trilhas",
      icon: BookOpen,
      href: "/learning-paths",
    },
    {
      label: "Criar",
      icon: Sparkles,
      href: "/assessment",
    },
    {
      label: "Perfil",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center py-3 px-4",
                  location === item.href || (location === "/" && item.href === "/dashboard")
                    ? "text-primary"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="text-xl w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
