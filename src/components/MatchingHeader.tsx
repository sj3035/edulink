import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface MatchingHeaderProps {
  onFindMatches: () => void;
  isLoading: boolean;
}

export const MatchingHeader = ({ onFindMatches, isLoading }: MatchingHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 max-w-2xl mx-auto mb-12"
    >
      <div>
        <h2 className="text-4xl font-bold text-primary-dark mb-4">
          Find Your Study Partners
        </h2>
        <p className="text-muted-foreground text-lg">
          Our smart algorithm matches you with compatible study partners based on
          your profile
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onFindMatches}
          disabled={isLoading}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full h-auto"
        >
          {isLoading ? "Finding Matches..." : "Find Study Partners"}
        </Button>
      </div>
    </motion.div>
  );
};