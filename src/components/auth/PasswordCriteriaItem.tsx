
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordCriteriaItemProps {
  isValid: boolean;
  text: string;
}

export const PasswordCriteriaItem = ({ isValid, text }: PasswordCriteriaItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 text-sm"
  >
    {isValid ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <span className={isValid ? "text-green-500" : "text-red-500"}>{text}</span>
  </motion.div>
);
