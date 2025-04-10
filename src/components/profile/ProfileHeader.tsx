
import { Pencil, Save } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick?: (e?: React.FormEvent) => void;
}

export const ProfileHeader = ({ isEditing, onEditClick, onSaveClick }: ProfileHeaderProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveClick) {
      onSaveClick();
    }
  };

  return (
    <div className="flex">
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </motion.div>
      )}
      {isEditing && onSaveClick && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveClick}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};
