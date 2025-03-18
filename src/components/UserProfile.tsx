
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileForm } from "./profile/ProfileForm";
import { ProfileView } from "./profile/ProfileView";

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
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

        // If this is a new OAuth login, record the auth method
        const { data: authMethod, error: authError } = await supabase
          .from('user_auth_methods')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (authError) {
          console.error('Error checking auth method:', authError);
        } else if (!authMethod || authMethod.length === 0) {
          // Determine provider from the user's identities
          let provider = 'email';
          if (user.app_metadata?.provider) {
            provider = user.app_metadata.provider;
          }

          // Record the auth method
          const { error: insertError } = await supabase
            .from('user_auth_methods')
            .insert([{ user_id: user.id, provider }]);

          if (insertError) {
            console.error('Error recording auth method:', insertError);
          }
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setIsEditing(true);
            
            // Pre-fill email from the auth user
            setEmail(user.email || '');
            return;
          }
          throw error;
        }

        if (profile) {
          setName(profile.full_name || '');
          setBio(profile.bio || '');
          setSubjects(profile.subjects || '');
          setStudyTime(profile.study_time || '');
          setLearningStyle(profile.learning_style || 'visual');
          setEmail(profile.email || '');
          setIsEditing(false);
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
          email: email,
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
      
      setIsEditing(false);
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
        <ProfileHeader isEditing={isEditing} onEditClick={() => setIsEditing(true)} />

        {isEditing ? (
          <ProfileForm
            isLoading={isLoading}
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
            onCancel={() => setIsEditing(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <ProfileView
            name={name}
            bio={bio}
            subjects={subjects}
            studyTime={studyTime}
            learningStyle={learningStyle}
          />
        )}
      </motion.div>
    </section>
  );
};
