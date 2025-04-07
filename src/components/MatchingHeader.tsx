
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import { Search } from "lucide-react";

interface MatchingHeaderProps {
  onFindMatches: () => void;
  isLoading: boolean;
}

export const MatchingHeader = ({ onFindMatches, isLoading }: MatchingHeaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 max-w-2xl mx-auto mb-12"
    >
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-4xl font-bold mb-4 ${
            isDark ? "text-gradient" : "text-primary-dark"
          }`}
        >
          Find Your Study Partners
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`text-lg ${
            isDark ? "text-slate-300" : "text-muted-foreground"
          }`}
        >
          Our smart algorithm matches you with compatible study partners based on
          your profile
        </motion.p>
      </div>

      <motion.div 
        className="flex justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
      >
        <Button
          onClick={onFindMatches}
          disabled={isLoading}
          size="lg"
          className={`
            px-8 py-6 text-lg rounded-full h-auto transition-all duration-300
            ${isDark 
              ? "bg-gradient-to-r from-primary-dark to-accent-dark hover:shadow-lg hover:shadow-primary-dark/20 animate-pulse-soft" 
              : "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 animate-button-glow"}
            text-white
          `}
        >
          <Search className="mr-2 h-5 w-5" />
          {isLoading ? "Finding Matches..." : "Find Study Partners"}
        </Button>
      </motion.div>
    </motion.div>
  );
};
