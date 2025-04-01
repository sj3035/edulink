
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { PasswordCriteriaItem } from "./PasswordCriteriaItem";

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
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
  showPasswordMatch?: boolean;
  passwordsMatch?: boolean;
  confirmPassword?: string;
  isBold?: boolean;
}

export const PasswordField = ({
  password,
  setPassword,
  isLoading,
  label,
  id,
  showCriteria = false,
  passwordCriteria,
  showPasswordMatch = false,
  passwordsMatch,
  confirmPassword,
  isBold = false
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-white">
          {label}
        </Label>
      </div>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className={`bg-white/20 border-white/20 text-white pr-10 ${isBold ? 'font-bold' : ''} placeholder:text-white/60`}
          disabled={isLoading}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10 text-white hover:bg-transparent hover:text-white/80"
          onClick={togglePasswordVisibility}
          disabled={isLoading}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      {showCriteria && passwordCriteria && (
        <div className="space-y-1">
          <PasswordCriteriaItem
            isValid={passwordCriteria.minLength}
            text="8-15 characters"
          />
          <PasswordCriteriaItem
            isValid={passwordCriteria.hasLowerCase}
            text="One lowercase letter"
          />
          <PasswordCriteriaItem
            isValid={passwordCriteria.hasUpperCase}
            text="One uppercase letter"
          />
          <PasswordCriteriaItem
            isValid={passwordCriteria.hasNumber}
            text="One number"
          />
          <PasswordCriteriaItem
            isValid={passwordCriteria.hasSpecialChar}
            text="One special character"
          />
        </div>
      )}

      {showPasswordMatch && confirmPassword && confirmPassword.length > 0 && (
        <PasswordCriteriaItem
          isValid={passwordsMatch ?? false}
          text="Passwords match"
        />
      )}
    </div>
  );
};
