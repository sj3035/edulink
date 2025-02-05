
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface CriteriaItemProps {
  met: boolean;
  text: string;
}

export const CriteriaItem = ({ met, text }: CriteriaItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 text-sm"
  >
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <span className={met ? "text-green-500" : "text-red-500"}>{text}</span>
  </motion.div>
);
