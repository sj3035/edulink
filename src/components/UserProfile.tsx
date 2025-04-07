
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileForm } from "./profile/ProfileForm";
import { ProfileView } from "./profile/ProfileView";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  User, Book, Clock, Brain, 
  CheckCircle2, Loader2, GraduationCap 
} from "lucide-react";

type ProfileType = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  subjects: string | null;
  study_time: string | null;
  learning_style: string | null;
  university: string | null;
  major: string | null;
  avatar_url: string | null;
};

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [learningStyle, setLearningStyle] = useState("visual");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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

        const { data: authMethod, error: authError } = await supabase
          .from('user_auth_methods')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (authError) {
          console.error('Error checking auth method:', authError);
        } else if (!authMethod || authMethod.length === 0) {
          let provider = 'email';
          if (user.app_metadata?.provider) {
            provider = user.app_metadata.provider;
          }

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
            
            setEmail(user.email || '');
            return;
          }
          throw error;
        }

        if (profile) {
          const profileData = profile as ProfileType;
          
          setName(profileData.full_name || '');
          setBio(profileData.bio || '');
          setSubjects(profileData.subjects || '');
          setStudyTime(profileData.study_time || '');
          setLearningStyle(profileData.learning_style || 'visual');
          setEmail(profileData.email || '');
          setUniversity(profileData.university || '');
          setMajor(profileData.major || '');
          setAvatarUrl(profileData.avatar_url || '');
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
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
          university,
          major,
          avatar_url: avatarUrl,
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-secondary/30 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-white">{name || "Welcome!"}</h1>
              <p className="text-muted-foreground">{email}</p>
              {(university || major) && (
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {university && <span>{university}</span>}
                  {university && major && <span className="mx-1">•</span>}
                  {major && <span>{major}</span>}
                </div>
              )}
            </div>
          </div>
          <ProfileHeader 
            isEditing={isEditing} 
            onEditClick={handleEditClick}
            onSaveClick={handleSubmit}
          />
        </div>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
              university={university}
              setUniversity={setUniversity}
              major={major}
              setMajor={setMajor}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              onCancel={() => setIsEditing(false)}
              onSubmit={handleSubmit}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full mb-6 bg-white/20 backdrop-blur-sm dark:bg-gray-800/30">
                <TabsTrigger value="profile" className="flex items-center gap-2 flex-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="study" className="flex items-center gap-2 flex-1">
                  <Book className="h-4 w-4" />
                  <span>Study Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2 flex-1">
                  <Clock className="h-4 w-4" />
                  <span>Schedule</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-0">
                <ProfileView
                  name={name}
                  bio={bio}
                  subjects={subjects}
                  studyTime={studyTime}
                  learningStyle={learningStyle}
                  university={university}
                  major={major}
                  email={email}
                />
              </TabsContent>
              
              <TabsContent value="study" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Book className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Subjects</h3>
                      </div>
                      {subjects ? (
                        <div className="flex flex-wrap gap-2">
                          {subjects.split(',').map((subject, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {subject.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No subjects added yet</p>
                      )}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="glass-card p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Learning Style</h3>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg inline-block">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-primary-dark font-medium capitalize">{learningStyle} Learner</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Availability</h3>
                    </div>
                    {studyTime ? (
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-primary-dark">
                          Preferred study time: <span className="font-medium">{studyTime}</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No study times set yet</p>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
