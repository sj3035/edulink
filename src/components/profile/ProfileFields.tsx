import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { User, Book, Clock, Brain } from "lucide-react";

interface ProfileFieldsProps {
  name: string;
  setName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  subjects: string;
  setSubjects: (value: string) => void;
  studyTime: string;
  setStudyTime: (value: string) => void;
  learningStyle: string;
  setLearningStyle: (value: string) => void;
}

export const ProfileFields = ({
  name,
  setName,
  bio,
  setBio,
  subjects,
  setSubjects,
  studyTime,
  setStudyTime,
  learningStyle,
  setLearningStyle,
}: ProfileFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-primary-dark">Personal Information</h3>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-6">
        <Book className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-primary-dark">Academic Subjects</h3>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="subjects">Subjects (comma-separated)</Label>
          <Input
            id="subjects"
            placeholder="e.g., Mathematics, Physics, Computer Science"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-primary-dark">Study Times</h3>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="availability">Preferred Study Times</Label>
          <Input
            id="availability"
            type="time"
            className="w-full"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-6">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-primary-dark">Learning Style</h3>
      </div>

      <RadioGroup value={learningStyle} onValueChange={setLearningStyle}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="visual" id="visual" />
          <Label htmlFor="visual">Visual</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auditory" id="auditory" />
          <Label htmlFor="auditory">Auditory</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="kinesthetic" id="kinesthetic" />
          <Label htmlFor="kinesthetic">Kinesthetic</Label>
        </div>
      </RadioGroup>
    </div>
  );
};