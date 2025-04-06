
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

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
          
          // Show a toast notification regardless of type
          toast({
            title: newNotification.title,
            description: newNotification.content,
          });
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
        <Bell className="h-5 w-5" />
        {importantCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white"
            variant="default"
          >
            {importantCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px] w-full p-4">
          {importantNotifications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No important notifications
            </div>
          ) : (
            importantNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="mb-2 p-3 cursor-pointer rounded-lg hover:bg-accent"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="w-full">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {notification.content}
                  </div>
                  {!notification.read && (
                    <Badge className="mt-2" variant="secondary">
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
