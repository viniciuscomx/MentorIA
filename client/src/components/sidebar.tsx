import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  BookOpen, LayoutDashboard, Lightbulb, 
  LogOut, Settings, User, Sparkles, 
  GraduationCap, Award, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
      href: "/dashboard",
    },
    {
      label: "Minhas Trilhas",
      icon: <BookOpen className="w-5 h-5 mr-3" />,
      href: "/learning-paths",
    },
    {
      label: "Criar Trilha",
      icon: <Sparkles className="w-5 h-5 mr-3" />,
      href: "/assessment",
    },
    {
      label: "Certificados",
      icon: <Award className="w-5 h-5 mr-3" />,
      href: "/certificates",
    },
    {
      label: "Perfil",
      icon: <User className="w-5 h-5 mr-3" />,
      href: "/profile",
    },
    {
      label: "Suporte",
      icon: <HelpCircle className="w-5 h-5 mr-3" />,
      href: "/support",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-black border-r border-gray-800">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">EduAI</h1>
        </div>
      </div>

      <nav className="flex-grow py-5 overflow-y-auto">
        <div className="px-5 mb-6">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">Menu Principal</h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href} className="group">
                <Link href={item.href}>
                  <a className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    location === item.href || (location === "/" && item.href === "/dashboard")
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-gray-800 my-4" />

        <div className="px-5 mb-6">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">Trilhas Ativas</h3>
          <ul className="space-y-1">
            {/* These would be populated from API data */}
            <li className="text-sm text-gray-400 italic px-3 py-2">
              Nenhuma trilha ativa
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-5 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.username}</p>
            <p className="text-xs text-gray-500">Estudante</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-gray-500 hover:text-gray-300"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
