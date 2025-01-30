import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Book, Clock, Brain } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UserProfile = () => {
  const [learningStyle, setLearningStyle] = useState("visual");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setName(profile.full_name || '');
          setBio(profile.bio || '');
          setSubjects(profile.subjects || '');
          setStudyTime(profile.study_time || '');
          setLearningStyle(profile.learning_style || 'visual');
          setEmail(profile.email || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: email, // Include email field
          full_name: name,
          bio,
          subjects,
          study_time: studyTime,
          learning_style: learningStyle,
        });

      if (error) throw error;

      toast({
        title: "Profile Saved!",
        description: "Your profile has been updated successfully.",
      });
      
      navigate("/dashboard/matching");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Your Profile</h2>
          <p className="text-muted-foreground">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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

          <Button 
            type="submit" 
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
};