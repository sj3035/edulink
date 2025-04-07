
import { toast as sonnerToast, type ToastT } from "sonner";

// Define types that match what the code is actually using
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  style?: React.CSSProperties;
  // Add any other properties that are being used
}

function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant, style, ...rest } = props;
    
    // Convert shadcn/ui toast format to Sonner format
    return sonnerToast(title || "", {
      description,
      style: variant === "destructive" 
        ? { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', ...style }
        : style,
      ...rest,
    });
  };

  return { toast };
}

// Export a standalone toast function with the same interface
const toast = (props: ToastProps) => {
  const { title, description, variant, style, ...rest } = props;
  
  // Convert shadcn/ui toast format to Sonner format
  return sonnerToast(title || "", {
    description,
    style: variant === "destructive" 
      ? { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', ...style }
      : style,
    ...rest,
  });
};

export { useToast, toast };
