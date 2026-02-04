import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageCircle, 
  RefreshCw, 
  Heart,
  BarChart3,
  DollarSign,
  UserCog,
  Zap,
  Settings,
  ChevronRight,
  LogOut,
  Stethoscope,
  FileText
} from "lucide-react";
import logoDermacore from "@/assets/logo_dermacore.png";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active, badge, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "nav-item w-full group",
      active && "active"
    )}
  >
    <span className={cn(
      "transition-colors",
      active ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
    )}>
      {icon}
    </span>
    <span className="flex-1 text-left text-sm font-medium">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-revenue-at-risk text-white">
        {badge}
      </span>
    )}
    <ChevronRight className={cn(
      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
      active && "opacity-100"
    )} />
  </button>
);

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { id: "leads", path: "/leads", icon: <Users className="w-5 h-5" />, label: "Leads", badge: 12 },
    { id: "agenda", path: "/agenda", icon: <Calendar className="w-5 h-5" />, label: "Agenda" },
    { id: "whatsapp", path: "/whatsapp", icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", badge: 5 },
    { id: "followup", path: "/followup", icon: <RefreshCw className="w-5 h-5" />, label: "Follow-up" },
    { id: "pos-procedimento", path: "/pos-procedimento", icon: <Heart className="w-5 h-5" />, label: "Pós-Procedimento" },
    { id: "procedimentos", path: "/procedimentos", icon: <Stethoscope className="w-5 h-5" />, label: "Procedimentos" },
    { id: "orcamentos", path: "/orcamentos", icon: <FileText className="w-5 h-5" />, label: "Orçamentos" },
    { id: "relatorios", path: "/relatorios", icon: <BarChart3 className="w-5 h-5" />, label: "Relatórios" },
    { id: "financeiro", path: "/financeiro", icon: <DollarSign className="w-5 h-5" />, label: "Financeiro" },
    { id: "equipe", path: "/equipe", icon: <UserCog className="w-5 h-5" />, label: "Equipe" },
    { id: "automacoes", path: "/automacoes", icon: <Zap className="w-5 h-5" />, label: "Automações" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    navigate(item.path);
    onSectionChange?.(item.id);
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(item.path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/dashboard")}>
          <img src={logoDermacore} alt="DermaCore" className="h-20 w-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={isActive(item)}
            badge={item.badge}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Configurações"
          onClick={() => navigate("/configuracoes")}
        />
        
        <NavItem
          icon={<LogOut className="w-5 h-5" />}
          label="Sair"
          onClick={handleSignOut}
        />
        
        {/* User Profile */}
        <div className="mt-4 p-3 rounded-lg bg-sidebar-accent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sidebar-primary to-teal-400 flex items-center justify-center text-white font-semibold text-sm">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || "Usuário"}</p>
              <p className="text-xs text-sidebar-foreground truncate capitalize">{profile?.role || "staff"}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
