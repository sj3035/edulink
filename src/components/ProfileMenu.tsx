import { User, ChartBar, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

export const ProfileMenu = () => {
  const navigate = useNavigate();

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
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/progress")}>
          <ChartBar className="mr-2 h-4 w-4" />
          Progress Tracking
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/community")}>
          <Users className="mr-2 h-4 w-4" />
          Community
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};