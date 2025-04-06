
import { Button } from "../ui/button";
import { ProfileFields } from "./ProfileFields";
import { Card } from "../ui/card";
import { motion } from "framer-motion";

interface ProfileFormProps {
  isLoading: boolean;
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
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  isLoading,
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
  onCancel,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <Card className="overflow-hidden">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="p-6 pb-0">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-primary-dark mb-4"
          >
            Edit Your Profile
          </motion.h2>
        </div>
        
        <div className="p-6 pt-0">
          <ProfileFields
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            subjects={subjects}
            setSubjects={setSubjects}
            studyTime={studyTime}
            setStudyTime={setStudyTime}
            learningStyle={learningStyle}
            setLearningStyle={setLearningStyle}
            university={university}
            setUniversity={setUniversity}
            major={setMajor}
            setMajor={setMajor}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />
        </div>

        <div className="flex gap-4 justify-end p-6 bg-muted/20 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="transition-transform hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
