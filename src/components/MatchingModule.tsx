import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "./ui/use-toast";
import { MatchingHeader } from "./MatchingHeader";
import { MatchedUserCard } from "./MatchedUserCard";
import { SchedulingAndResources } from "./SchedulingAndResources";

interface MatchedUser {
  name: string;
  subjects: string[];
  studyTimes: string;
  learningStyle: string;
  compatibilityScore: number;
}

export const MatchingModule = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const findMatches = async () => {
    setIsLoading(true);
    // Simulating API call to find matches
    setTimeout(() => {
      const mockMatches: MatchedUser[] = [
        {
          name: "Sarah Johnson",
          subjects: ["Mathematics", "Physics"],
          studyTimes: "Evenings",
          learningStyle: "Visual",
          compatibilityScore: 95,
        },
        {
          name: "Michael Chen",
          subjects: ["Physics", "Computer Science"],
          studyTimes: "Afternoons",
          learningStyle: "Visual",
          compatibilityScore: 88,
        },
        {
          name: "Emma Davis",
          subjects: ["Mathematics", "Chemistry"],
          studyTimes: "Mornings",
          learningStyle: "Kinesthetic",
          compatibilityScore: 82,
        },
      ];

      setMatches(mockMatches);
      setIsLoading(false);
      toast({
        title: "Matches Found!",
        description: "We've found some great study partners for you.",
      });
    }, 1500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <MatchingHeader onFindMatches={findMatches} isLoading={isLoading} />

        <div className="grid gap-6 mt-8">
          {matches.map((match, index) => (
            <MatchedUserCard
              key={index}
              match={match}
              index={index}
              onConnect={(name) => setSelectedMatch(name)}
            />
          ))}
        </div>
      </motion.div>

      <SchedulingAndResources
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchName={selectedMatch || ""}
      />
    </section>
  );
};