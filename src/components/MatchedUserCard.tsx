
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
import { useTheme } from "./ThemeProvider";

// Subject color mapping for light mode
const lightSubjectColors = {
  "Mathematics": "bg-blue-100 text-blue-700 border-blue-200",
  "Physics": "bg-violet-100 text-violet-700 border-violet-200",
  "Biology": "bg-green-100 text-green-700 border-green-200",
  "Chemistry": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Computer Science": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "History": "bg-orange-100 text-orange-700 border-orange-200",
  "Literature": "bg-pink-100 text-pink-700 border-pink-200",
  "default": "bg-gray-100 text-gray-700 border-gray-200"
};

// Subject color mapping for dark mode
const darkSubjectColors = {
  "Mathematics": "bg-blue-900/40 text-blue-300 border-blue-800",
  "Physics": "bg-violet-900/40 text-violet-300 border-violet-800",
  "Biology": "bg-green-900/40 text-green-300 border-green-800",
  "Chemistry": "bg-yellow-900/40 text-yellow-300 border-yellow-800",
  "Computer Science": "bg-indigo-900/40 text-indigo-300 border-indigo-800",
  "History": "bg-orange-900/40 text-orange-300 border-orange-800",
  "Literature": "bg-pink-900/40 text-pink-300 border-pink-800",
  "default": "bg-gray-800/40 text-gray-300 border-gray-700"
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
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const getSubjectColor = (subject: string) => {
    const colors = isDark ? darkSubjectColors : lightSubjectColors;
    return colors[subject as keyof typeof lightSubjectColors] || colors.default;
  };

  const getLearningStyleDescription = (style: string) => {
    return learningStyleDescriptions[style as keyof typeof learningStyleDescriptions] || "";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return isDark ? "from-emerald-500 to-emerald-600" : "from-emerald-400 to-emerald-500";
    if (score >= 80) return isDark ? "from-blue-500 to-blue-600" : "from-blue-400 to-blue-500";
    if (score >= 70) return isDark ? "from-amber-500 to-amber-600" : "from-amber-400 to-amber-500";
    return isDark ? "from-gray-500 to-gray-600" : "from-gray-400 to-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: isDark 
          ? "0 10px 25px -5px rgba(106, 83, 224, 0.2), 0 8px 10px -6px rgba(106, 83, 224, 0.1)" 
          : "0 10px 25px -5px rgba(155, 135, 245, 0.2), 0 8px 10px -6px rgba(155, 135, 245, 0.1)" 
      }}
      className="h-full"
    >
      <Card className={`p-6 transition-all duration-300 border h-full flex flex-col hover:shadow-lg dark:hover:shadow-primary-dark/10 ${
        isDark ? "dark-card-gradient" : "light-card-gradient"
      }`}>
        <div className="space-y-4 flex-1">
          <motion.div 
            className="flex items-start gap-4"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          >
            <Avatar className={`h-12 w-12 rounded-full ring-2 ${isDark ? "ring-primary-dark/30 bg-slate-800" : "ring-primary/10 bg-white"}`}>
              {match.avatarUrl ? (
                <AvatarImage src={match.avatarUrl} alt={match.name} />
              ) : (
                <AvatarFallback className={`${isDark ? "bg-slate-800 text-primary-light" : "bg-primary/10 text-primary"}`}>
                  {match.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-primary-dark"}`}>{match.name}</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-primary-dark"}`}>Match</span>
                  <span className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-primary-dark"}`}>{match.compatibilityScore}%</span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden bg-secondary/50 dark:bg-slate-700/50">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getScoreColor(match.compatibilityScore)}`}
                    style={{ width: `${match.compatibilityScore}%` }}
                  />
                </div>
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
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isDark ? "bg-slate-800/60" : "bg-secondary/30"
            } backdrop-blur-sm`}>
              <Clock className={`h-4 w-4 ${isDark ? "text-primary-light" : "text-primary"}`} />
              {match.studyTimes}
            </div>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-help ${
                  isDark ? "bg-slate-800/60" : "bg-secondary/30"
                } backdrop-blur-sm`}>
                  <Brain className={`h-4 w-4 ${isDark ? "text-primary-light" : "text-primary"}`} />
                  {match.learningStyle} Learner
                  <Info className={`h-3 w-3 ${isDark ? "text-primary-light/70" : "text-primary/70"}`} />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className={`w-80 p-4 text-sm backdrop-blur-lg ${
                isDark ? "bg-slate-900/90 border-slate-700/50" : "bg-white/90 border-primary/10"
              }`}>
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
            className={`w-full font-medium relative overflow-hidden group ${
              isDark 
              ? "bg-gradient-to-r from-primary-dark to-accent-dark hover:shadow-md hover:shadow-primary-dark/20" 
              : "bg-gradient-to-r from-primary/90 to-primary backdrop-blur-sm hover:shadow-md hover:shadow-primary/20"
            } text-primary-foreground transition-all duration-300`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connect
            </span>
            <span className={`absolute inset-0 w-full h-full ${
              isDark ? "bg-white/5" : "bg-white/10"
            } transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></span>
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};
