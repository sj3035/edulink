
import { motion } from "framer-motion";
import { Book, Clock, Brain, Users, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "./ui/hover-card";

// Subject color mapping
const subjectColors = {
  "Mathematics": "bg-blue-100 text-blue-700 border-blue-200",
  "Physics": "bg-violet-100 text-violet-700 border-violet-200",
  "Biology": "bg-green-100 text-green-700 border-green-200",
  "Chemistry": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Computer Science": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "History": "bg-orange-100 text-orange-700 border-orange-200",
  "Literature": "bg-pink-100 text-pink-700 border-pink-200",
  "default": "bg-gray-100 text-gray-700 border-gray-200"
};

// Learning style descriptions for tooltips
const learningStyleDescriptions = {
  "Visual": "Visual learners prefer using images, pictures, colors, and maps to organize information and communicate with others.",
  "Auditory": "Auditory learners best understand new content through listening and speaking in situations such as lectures and group discussions.",
  "Kinesthetic": "Kinesthetic learners learn by touching and doing. They understand and remember things through physical movement.",
};

interface MatchedUser {
  id: number;
  name: string;
  subjects: string[];
  studyTimes: string;
  learningStyle: string;
  compatibilityScore: number;
  avatarUrl?: string;
}

interface MatchedUserCardProps {
  match: MatchedUser;
  index: number;
  onConnect: (name: string) => void;
}

export const MatchedUserCard = ({ match, index, onConnect }: MatchedUserCardProps) => {
  const getSubjectColor = (subject: string) => {
    return subjectColors[subject as keyof typeof subjectColors] || subjectColors.default;
  };

  const getLearningStyleDescription = (style: string) => {
    return learningStyleDescriptions[style as keyof typeof learningStyleDescriptions] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.2), 0 8px 10px -6px rgba(155, 135, 245, 0.1)" 
      }}
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
            <Avatar className="h-12 w-12 rounded-full ring-2 ring-primary/10">
              {match.avatarUrl ? (
                <AvatarImage src={match.avatarUrl} alt={match.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {match.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary-dark">{match.name}</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary-dark">Match</span>
                  <span className="text-xs font-medium text-primary-dark">{match.compatibilityScore}%</span>
                </div>
                <Progress 
                  value={match.compatibilityScore} 
                  className="h-2 bg-secondary/50" 
                />
              </div>
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
                variant="outline"
                className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm hover:scale-105 transition-transform duration-300 ${getSubjectColor(subject)}`}
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
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 bg-secondary/30 backdrop-blur-sm px-3 py-1 rounded-full cursor-help">
                  <Brain className="h-4 w-4 text-primary" />
                  {match.learningStyle} Learner
                  <Info className="h-3 w-3 text-primary opacity-70" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 text-sm backdrop-blur-lg bg-white/90 border border-primary/10">
                <h4 className="font-medium mb-2">{match.learningStyle} Learning Style</h4>
                <p>{getLearningStyleDescription(match.learningStyle)}</p>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6"
        >
          <Button
            onClick={() => onConnect(match.name)}
            className="w-full bg-gradient-to-r from-primary/90 to-primary backdrop-blur-sm hover:bg-primary 
              text-primary-foreground font-medium transition-all duration-300 
              hover:shadow-md hover:shadow-primary/20 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connect
            </span>
            <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};
