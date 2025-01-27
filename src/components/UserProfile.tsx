import { useState } from "react";
import { motion } from "framer-motion";
import { User, Book, Clock, Brain } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export const UserProfile = () => {
  const [learningStyle, setLearningStyle] = useState("visual");

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Create Your Profile</h2>
          <p className="text-muted-foreground">Tell us about yourself to find the perfect study partners</p>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary-dark">Personal Information</h3>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us a bit about yourself..." />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8 mb-6">
            <Book className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary-dark">Academic Subjects</h3>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input id="subjects" placeholder="e.g., Mathematics, Physics, Computer Science" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-primary-dark">Study Times</h3>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="availability">Preferred Study Times</Label>
              <Input id="availability" type="time" className="w-full" />
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

          <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white">
            Save Profile
          </Button>
        </div>
      </motion.div>
    </section>
  );
};