
import { Pencil, Save } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ isEditing, onEditClick }: ProfileHeaderProps) => {
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
            onClick={onEditClick}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};
