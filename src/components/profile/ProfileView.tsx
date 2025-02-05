
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { User, Book, Clock, Brain } from "lucide-react";

interface ProfileViewProps {
  name: string;
  bio: string;
  subjects: string;
  studyTime: string;
  learningStyle: string;
}

export const ProfileView = ({
  name,
  bio,
  subjects,
  studyTime,
  learningStyle,
}: ProfileViewProps) => {
  const renderField = (label: string, value: string, icon: React.ReactNode, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">{icon}</div>
          <Label className="text-sm text-muted-foreground">{label}</Label>
        </div>
        <p className="mt-1 text-lg font-medium text-primary-dark">{value || "Not specified"}</p>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {renderField("Full Name", name, <User className="h-5 w-5" />, 0)}
        {renderField("Learning Style", `${learningStyle} Learner`, <Brain className="h-5 w-5" />, 1)}
        {renderField("Study Times", studyTime, <Clock className="h-5 w-5" />, 2)}
        {renderField("Subjects", subjects, <Book className="h-5 w-5" />, 3)}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">
              <User className="h-5 w-5" />
            </div>
            <Label className="text-sm text-muted-foreground">Bio</Label>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-primary-dark">{bio || "No bio provided"}</p>
        </Card>
      </motion.div>
    </div>
  );
};
