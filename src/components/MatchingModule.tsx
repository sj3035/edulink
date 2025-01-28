import { useState } from "react";
import { MatchingHeader } from "./MatchingHeader";
import { MatchedUserCard } from "./MatchedUserCard";
import { ProfileMenu } from "./ProfileMenu";

export const MatchingModule = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <MatchingHeader onFindMatches={handleFindMatches} isLoading={isLoading} />
        <ProfileMenu />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <MatchedUserCard key={match.id} match={match} index={index} onConnect={() => {}} />
        ))}
      </div>
    </div>
  );
};