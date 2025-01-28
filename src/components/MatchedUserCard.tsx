import { motion } from "framer-motion";
import { Book, Clock, Brain, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface MatchedUser {
  name: string;
  subjects: string[];
  studyTimes: string;
  learningStyle: string;
  compatibilityScore: number;
}

interface MatchedUserCardProps {
  match: MatchedUser;
  index: number;
  onConnect: (name: string) => void;
}

export const MatchedUserCard = ({ match, index, onConnect }: MatchedUserCardProps) => {
  return (
    <motion.div
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
              onClick={() => onConnect(match.name)}
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
  );
};