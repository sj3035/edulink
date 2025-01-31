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
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary-dark">{match.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {match.subjects.map((subject, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-secondary text-primary px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <Book className="h-3 w-3" />
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge 
              variant="default" 
              className="bg-primary text-white px-4 py-2 text-lg rounded-full"
            >
              {match.compatibilityScore}% Match
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {match.studyTimes}
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              {match.learningStyle} Learner
            </div>
          </div>
          
          <Button
            onClick={() => onConnect(match.name)}
            variant="secondary"
            className="w-full bg-secondary hover:bg-secondary/80 text-primary font-medium"
          >
            Connect
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};