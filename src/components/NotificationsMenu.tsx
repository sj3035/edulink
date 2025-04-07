
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "@/hooks/use-toast"; // Changed to use our custom toast
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

// Define types for notification importance
type NotificationType = 'important' | 'system';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  user_id: string;
}

export const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [importantCount, setImportantCount] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          console.log('New notification received:', newNotification);
          
          // Add to state
          setNotifications((prev) => [newNotification, ...prev]);
          
          // If it's an important notification, increment the count
          if (newNotification.type === 'important') {
            setImportantCount((prev) => prev + 1);
          }
          
          // Show a toast notification for system notifications
          if (newNotification.type === 'system') {
            toast({
              title: newNotification.title,
              description: newNotification.content,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    const typedData = data as Notification[];
    setNotifications(typedData);
    
    // Count only important unread notifications
    const unreadImportantCount = typedData.filter(
      (n) => !n.read && n.type === 'important'
    ).length;
    
    setImportantCount(unreadImportantCount);
  };

  const markAsRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    // Only decrement count if it was an important notification
    if (notification?.type === 'important' && !notification?.read) {
      setImportantCount((prev) => Math.max(0, prev - 1));
    }
    
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Filter to only show important notifications in the bell menu
  const importantNotifications = notifications.filter(n => n.type === 'important');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${
            isDark 
              ? "bg-slate-800/60 hover:bg-slate-700/60" 
              : "bg-secondary/40 hover:bg-secondary/60"
          } backdrop-blur-sm transition-colors duration-200`}
        >
          <Bell className={`h-5 w-5 ${
            importantCount > 0 
              ? (isDark ? "text-primary-light" : "text-primary")
              : "text-muted-foreground"
          }`} />
          {importantCount > 0 && (
            <Badge
              className={`absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center ${
                isDark 
                  ? "bg-primary-dark text-white animate-pulse-soft" 
                  : "bg-primary text-white animate-pulse-soft"
              }`}
              variant="default"
            >
              {importantCount}
            </Badge>
          )}
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-80 ${
          isDark 
            ? "bg-slate-900/95 border border-slate-800 backdrop-blur-xl" 
            : "bg-white/95 backdrop-blur-xl"
        }`}
      >
        <ScrollArea className="h-[300px] w-full p-4">
          {importantNotifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-6">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>No important notifications</p>
            </div>
          ) : (
            importantNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`mb-2 p-3 cursor-pointer rounded-lg ${
                  isDark 
                    ? "hover:bg-slate-800" 
                    : "hover:bg-accent"
                } ${!notification.read && (isDark ? "bg-slate-800/50" : "bg-secondary/40")}
                transition-colors duration-200`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="w-full">
                  <div className={`font-medium ${isDark ? "text-white" : ""}`}>{notification.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {notification.content}
                  </div>
                  {!notification.read && (
                    <Badge className={`mt-2 ${
                      isDark 
                        ? "bg-primary-dark/20 text-primary-light border border-primary-dark/30" 
                        : "bg-secondary text-secondary-foreground"
                    }`} variant="secondary">
                      New
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
