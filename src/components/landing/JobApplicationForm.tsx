
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const JobApplicationForm = ({ position }: { position: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // First, check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in or register to submit an application.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Upload resume if provided
      let resume_url = "";
      if (resumeFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(`${user.id}/${Date.now()}-${resumeFile.name}`, resumeFile);

        if (uploadError) throw uploadError;
        resume_url = uploadData.path;
      }

      // Submit application - Fixed: Wrap the object in an array for .insert()
      const { error } = await supabase.from("job_applications").insert([{
        position,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        cover_letter: formData.get("coverLetter") as string,
        resume_url,
        user_id: user.id,
      }]);

      if (error) throw error;

      // Send email notification to admin
      await supabase.functions.invoke("send-application-email", {
        body: {
          position,
          applicantName: formData.get("fullName"),
          applicantEmail: formData.get("email"),
        },
      });

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-primary/10 transition-colors duration-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Apply for {position}</h2>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" id="phone" name="phone" required className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="resume">Resume</Label>
            <Input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea 
              id="coverLetter" 
              name="coverLetter" 
              rows={5}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};
