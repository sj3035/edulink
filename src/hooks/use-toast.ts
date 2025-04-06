
import { toast } from "sonner";

// Create a simple hook wrapper to maintain compatibility with existing code
function useToast() {
  return {
    toast
  };
}

export { useToast, toast };
