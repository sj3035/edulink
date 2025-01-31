import { Button } from "../ui/button";
import { ProfileFields } from "./ProfileFields";

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
  onCancel,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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
      />

      <div className="flex gap-4 justify-end mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
};