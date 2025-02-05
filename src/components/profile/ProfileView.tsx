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
  const renderField = (label: string, value: string, icon: React.ReactNode) => (
    <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <Label className="text-sm text-muted-foreground">{label}</Label>
      </div>
      <p className="mt-1 text-lg font-medium text-primary-dark">{value || "Not specified"}</p>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {renderField("Full Name", name, <User className="h-5 w-5" />)}
        {renderField("Learning Style", `${learningStyle} Learner`, <Brain className="h-5 w-5" />)}
        {renderField("Study Times", studyTime, <Clock className="h-5 w-5" />)}
        {renderField("Subjects", subjects, <Book className="h-5 w-5" />)}
      </div>
      <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            <User className="h-5 w-5" />
          </div>
          <Label className="text-sm text-muted-foreground">Bio</Label>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-primary-dark">{bio || "No bio provided"}</p>
      </Card>
    </div>
  );
};