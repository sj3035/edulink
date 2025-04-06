
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { motion } from "framer-motion";
import { 
  User, Book, Clock, Brain, 
  GraduationCap, Eye, Headphones, 
  Activity 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  university: string;
  setUniversity: (value: string) => void;
  major: string;
  setMajor: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
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
  university,
  setUniversity,
  major,
  setMajor,
  avatarUrl,
  setAvatarUrl,
}: ProfileFieldsProps) => {
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-lg">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary text-white text-3xl">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <Input 
          id="avatarUrl" 
          placeholder="Profile picture URL (optional)"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="max-w-md"
        />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-primary-dark">Personal Information</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value=""
              disabled
              className="bg-muted/30"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              placeholder="Enter your university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="major">Academic Major</Label>
            <Input
              id="major"
              placeholder="Enter your major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-primary-dark">Academic Subjects</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects (comma-separated)</Label>
          <Textarea
            id="subjects"
            placeholder="e.g., Mathematics, Physics, Computer Science"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground mt-1">Enter subjects separated by commas</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-primary-dark">Study Times</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Preferred Study Time</Label>
          <Input
            id="availability"
            type="time"
            className="w-full transition-all focus:ring-2 focus:ring-primary/20"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-primary-dark">Learning Style</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className={`relative rounded-lg border p-4 transition-all ${learningStyle === 'visual' ? 'bg-primary/10 border-primary' : 'hover:bg-muted/20'}`}>
            <RadioGroup value={learningStyle} onValueChange={setLearningStyle} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="visual" id="visual" />
                <Label htmlFor="visual" className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Visual</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="mt-2 text-xs text-muted-foreground">Learn best through seeing and visualizing</p>
          </div>

          <div className={`relative rounded-lg border p-4 transition-all ${learningStyle === 'auditory' ? 'bg-primary/10 border-primary' : 'hover:bg-muted/20'}`}>
            <RadioGroup value={learningStyle} onValueChange={setLearningStyle} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auditory" id="auditory" />
                <Label htmlFor="auditory" className="flex items-center gap-2 cursor-pointer">
                  <Headphones className="h-4 w-4 text-primary" />
                  <span>Auditory</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="mt-2 text-xs text-muted-foreground">Learn best through listening and discussions</p>
          </div>

          <div className={`relative rounded-lg border p-4 transition-all ${learningStyle === 'kinesthetic' ? 'bg-primary/10 border-primary' : 'hover:bg-muted/20'}`}>
            <RadioGroup value={learningStyle} onValueChange={setLearningStyle} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                <Label htmlFor="kinesthetic" className="flex items-center gap-2 cursor-pointer">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Kinesthetic</span>
                </Label>
              </div>
            </RadioGroup>
            <p className="mt-2 text-xs text-muted-foreground">Learn best through hands-on activities</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
