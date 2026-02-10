import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  /** Extra classes for the content area */
  contentClassName?: string;
}

export const DashboardLayout = ({
  children,
  activeSection,
  onSectionChange,
  contentClassName = "",
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={
          isMobile
            ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : ""
        }
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            onSectionChange?.(section);
            if (isMobile) setSidebarOpen(false);
          }}
        />
      </div>

      {/* Content */}
      <div className={`flex-1 ${isMobile ? "" : "ml-64"} ${contentClassName}`}>
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md"
            aria-label="Menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
