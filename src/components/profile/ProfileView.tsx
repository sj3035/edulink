import { Label } from "../ui/label";

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
  const renderField = (label: string, value: string) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <p className="mt-1 text-lg">{value || "Not specified"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {renderField("Full Name", name)}
        {renderField("Learning Style", `${learningStyle} Learner`)}
        {renderField("Study Times", studyTime)}
        {renderField("Subjects", subjects)}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Label className="text-sm text-muted-foreground">Bio</Label>
        <p className="mt-1 whitespace-pre-wrap">{bio || "No bio provided"}</p>
      </div>
    </div>
  );
};