
import { User, ChartBar, Users, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProfileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.from('notifications').insert([{
          title: 'System Notification',
          content: 'You have been successfully logged out',
          type: 'system', // Non-important notification
          user_id: user.id,
          read: false
        }]);
        
        if (error) throw error;
      }
      
      await supabase.auth.signOut();
      
      // Show toast for logout
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/matching")}>
          <Users className="mr-2 h-4 w-4" />
          Find Partners
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/progress")}>
          <ChartBar className="mr-2 h-4 w-4" />
          Progress Tracking
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/community")}>
          <Users className="mr-2 h-4 w-4" />
          Community
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
