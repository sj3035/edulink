
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { User, Book, Clock, Brain, GraduationCap } from "lucide-react";

interface ProfileViewProps {
  name: string;
  bio: string;
  subjects: string;
  studyTime: string;
  learningStyle: string;
  university: string;
  major: string;
  email: string;
}

export const ProfileView = ({
  name,
  bio,
  subjects,
  studyTime,
  learningStyle,
  university,
  major,
  email,
}: ProfileViewProps) => {
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div 
          custom={0}
          variants={fadeInUp}
        >
          <Card className="overflow-hidden glass-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary-dark">About Me</h3>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {bio || "No bio provided yet. Edit your profile to add information about yourself."}
              </p>
              
              {(university || major) && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <div className="flex flex-wrap gap-x-2">
                      {university && <span>{university}</span>}
                      {university && major && <span>•</span>}
                      {major && <span>{major}</span>}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div 
            custom={1}
            variants={fadeInUp}
          >
            <Card className="h-full glass-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Book className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-primary-dark">Subjects</h3>
                </div>
                {subjects ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subjects.split(',').map((subject, index) => (
                      <span 
                        key={index} 
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {subject.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">No subjects specified</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            custom={2}
            variants={fadeInUp}
          >
            <Card className="h-full glass-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-primary-dark">Learning Style</h3>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 mt-2">
                  <div className="flex flex-col items-center">
                    {learningStyle === 'visual' && (
                      <>
                        <div className="bg-primary/20 p-3 rounded-full mb-2">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-primary-dark capitalize">{learningStyle} Learner</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                          You learn best through seeing and visualizing information
                        </p>
                      </>
                    )}
                    
                    {learningStyle === 'auditory' && (
                      <>
                        <div className="bg-primary/20 p-3 rounded-full mb-2">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-primary-dark capitalize">{learningStyle} Learner</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                          You learn best through listening and discussions
                        </p>
                      </>
                    )}
                    
                    {learningStyle === 'kinesthetic' && (
                      <>
                        <div className="bg-primary/20 p-3 rounded-full mb-2">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-primary-dark capitalize">{learningStyle} Learner</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                          You learn best through hands-on activities
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          custom={3}
          variants={fadeInUp}
        >
          <Card className="glass-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary-dark">Study Schedule</h3>
              </div>
              
              {studyTime ? (
                <div className="bg-primary/5 rounded-lg p-4 mt-2">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-2">
                        <span className="text-xl font-bold text-primary">{studyTime}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your preferred study time
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-2">No study times specified</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
