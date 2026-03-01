import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Users, Calendar, AlertTriangle, Megaphone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

const typeConfig: Record<Notification['type'], { icon: React.ReactNode; color: string }> = {
  new_lead: { icon: <Users className="w-4 h-4" />, color: "text-blue-500 bg-blue-500/10" },
  new_appointment: { icon: <Calendar className="w-4 h-4" />, color: "text-primary bg-primary/10" },
  appointment_confirmed: { icon: <Check className="w-4 h-4" />, color: "text-revenue-confirmed bg-revenue-confirmed/10" },
  lead_cooling: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-revenue-at-risk bg-revenue-at-risk/10" },
  general: { icon: <Megaphone className="w-4 h-4" />, color: "text-muted-foreground bg-muted" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 text-sidebar-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-revenue-at-risk text-white text-[10px] font-bold animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-left-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Notificações</h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas
              </Button>
            )}
          </div>

          {/* List */}
          <ScrollArea className="max-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              <div>
                {notifications.map((n) => {
                  const config = typeConfig[n.type] || typeConfig.general;
                  return (
                    <button
                      key={n.id}
                      onClick={() => { if (!n.is_read) markAsRead.mutate(n.id); }}
                      className={cn(
                        "w-full text-left p-4 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3",
                        !n.is_read && "bg-primary/5"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", config.color)}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm truncate", !n.is_read ? "font-semibold text-foreground" : "text-foreground/80")}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(n.created_at)}</span>
                        </div>
                        {n.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                        )}
                      </div>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
