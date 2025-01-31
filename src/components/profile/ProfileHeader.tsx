import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ isEditing, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-primary-dark">Your Profile</h2>
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditClick}
          className="hover:bg-primary/10"
        >
          <Pencil className="h-5 w-5 text-primary" />
        </Button>
      )}
    </div>
  );
};