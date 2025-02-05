
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { CriteriaItem } from "./PasswordCriteriaItem";

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  label: string;
  id: string;
  showCriteria?: boolean;
  passwordCriteria?: {
    minLength: boolean;
    hasLowerCase: boolean;
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  confirmPassword?: string;
  showPasswordMatch?: boolean;
  passwordsMatch?: boolean;
}

export const PasswordField = ({
  password,
  setPassword,
  isLoading,
  label,
  id,
  showCriteria,
  passwordCriteria,
  confirmPassword,
  showPasswordMatch,
  passwordsMatch,
}: PasswordFieldProps) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={id} className="text-white">{label}</Label>
      <Input
        id={id}
        type="password"
        placeholder={`Enter your ${label.toLowerCase()}`}
        value={password}
        onFocus={() => setShowFeedback(true)}
        onBlur={() => setShowFeedback(false)}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
        disabled={isLoading}
      />
      <AnimatePresence>
        {showCriteria && showFeedback && passwordCriteria && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 p-4 bg-white/90 backdrop-blur-md rounded-lg shadow-lg space-y-2 border border-white/20"
          >
            <CriteriaItem met={passwordCriteria.minLength} text="8-15 characters" />
            <CriteriaItem met={passwordCriteria.hasLowerCase} text="One lowercase letter" />
            <CriteriaItem met={passwordCriteria.hasUpperCase} text="One uppercase letter" />
            <CriteriaItem met={passwordCriteria.hasNumber} text="One number" />
            <CriteriaItem met={passwordCriteria.hasSpecialChar} text="One special character" />
          </motion.div>
        )}
        {showPasswordMatch && showFeedback && confirmPassword && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 p-4 bg-white/90 backdrop-blur-md rounded-lg shadow-lg"
          >
            <CriteriaItem met={passwordsMatch!} text="Passwords match" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
