
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="p-6 transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 h-full flex flex-col hover:shadow-lg hover:shadow-primary/20">
        <div className="space-y-4 flex-1">
          <motion.div 
            className="flex items-start gap-4"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary-dark">{match.name}</h3>
              <Badge 
                variant="default" 
                className="bg-primary/80 backdrop-blur-sm text-white px-3 py-1 text-sm rounded-full mt-2"
              >
                {match.compatibilityScore}% Match
              </Badge>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-2 mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
          >
            {match.subjects.map((subject, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-secondary/80 backdrop-blur-sm text-primary px-3 py-1 rounded-full flex items-center gap-1 text-sm hover:scale-105 transition-transform duration-300"
              >
                <Book className="h-3 w-3" />
                {subject}
              </Badge>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
          >
            <div className="flex items-center gap-2 bg-secondary/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
              {match.studyTimes}
            </div>
            <div className="flex items-center gap-2 bg-secondary/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <Brain className="h-4 w-4 text-primary" />
              {match.learningStyle} Learner
            </div>
          </motion.div>
        </div>
        
        <Button
          onClick={() => onConnect(match.name)}
          className="w-full mt-6 bg-secondary/80 backdrop-blur-sm hover:bg-secondary text-primary font-medium transition-all duration-300 hover:scale-105"
        >
          Connect
        </Button>
      </Card>
    </motion.div>
  );
};
