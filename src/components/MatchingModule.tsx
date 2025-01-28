import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import { Book, Clock, Brain, Users } from "lucide-react";
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
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">
            Find Your Study Partners
          </h2>
          <p className="text-muted-foreground">
            Our smart algorithm matches you with compatible study partners based on
            your profile
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={findMatches}
            disabled={isLoading}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Finding Matches..." : "Find Study Partners"}
          </Button>
        </div>

        <div className="grid gap-6 mt-8">
          {matches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{match.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {match.subjects.map((subject, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Book className="h-3 w-3" />
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="text-lg">
                      {match.compatibilityScore}% Match
                    </Badge>
                    <Button
                      onClick={() => setSelectedMatch(match.name)}
                      variant="secondary"
                      className="whitespace-nowrap"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {match.studyTimes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    {match.learningStyle} Learner
                  </div>
                </div>
              </Card>
            </motion.div>
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