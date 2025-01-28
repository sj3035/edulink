import { useState } from "react";
import { MatchingHeader } from "./MatchingHeader";
import { MatchedUserCard } from "./MatchedUserCard";
import { ProfileMenu } from "./ProfileMenu";

export const MatchingModule = () => {
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      subjects: ["Mathematics", "Physics"],
      learningStyle: "Visual",
      availability: "Evenings",
    },
    {
      id: 2,
      name: "Emily Smith",
      subjects: ["Biology", "Chemistry"],
      learningStyle: "Auditory",
      availability: "Weekends",
    },
    {
      id: 3,
      name: "Michael Brown",
      subjects: ["Computer Science", "Mathematics"],
      learningStyle: "Kinesthetic",
      availability: "Afternoons",
    },
    {
      id: 4,
      name: "Sarah Davis",
      subjects: ["History", "Literature"],
      learningStyle: "Visual",
      availability: "Mornings",
    },
    {
      id: 5,
      name: "David Wilson",
      subjects: ["Physics", "Mathematics"],
      learningStyle: "Auditory",
      availability: "Evenings",
    },
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <MatchingHeader />
        <ProfileMenu />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchedUserCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};
