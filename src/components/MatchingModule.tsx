import { useState } from "react";
import { MatchingHeader } from "./MatchingHeader";
import { MatchedUserCard } from "./MatchedUserCard";
import { SchedulingAndResources } from "./SchedulingAndResources";

export const MatchingModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      subjects: ["Mathematics", "Physics"],
      learningStyle: "Visual",
      studyTimes: "Evenings",
      compatibilityScore: 85
    },
    {
      id: 2,
      name: "Emily Smith",
      subjects: ["Biology", "Chemistry"],
      learningStyle: "Auditory",
      studyTimes: "Weekends",
      compatibilityScore: 78
    },
    {
      id: 3,
      name: "Michael Brown",
      subjects: ["Computer Science", "Mathematics"],
      learningStyle: "Kinesthetic",
      studyTimes: "Afternoons",
      compatibilityScore: 92
    },
    {
      id: 4,
      name: "Sarah Davis",
      subjects: ["History", "Literature"],
      learningStyle: "Visual",
      studyTimes: "Mornings",
      compatibilityScore: 75
    },
    {
      id: 5,
      name: "David Wilson",
      subjects: ["Physics", "Mathematics"],
      learningStyle: "Auditory",
      studyTimes: "Evenings",
      compatibilityScore: 88
    },
  ]);

  const handleFindMatches = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleConnect = (name: string) => {
    setSelectedMatch(name);
    setShowScheduling(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-white to-secondary/20">
      <div className="mb-12">
        <MatchingHeader onFindMatches={handleFindMatches} isLoading={isLoading} />
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {matches.map((match, index) => (
          <MatchedUserCard 
            key={match.id} 
            match={match} 
            index={index} 
            onConnect={handleConnect}
          />
        ))}
      </div>
      <SchedulingAndResources
        isOpen={showScheduling}
        onClose={() => setShowScheduling(false)}
        matchName={selectedMatch || ""}
      />
    </div>
  );
};