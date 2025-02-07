
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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

      // Submit application
      const { error } = await supabase.from("job_applications").insert({
        position,
        full_name: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        cover_letter: formData.get("coverLetter"),
        resume_url,
        user_id: user.id,
      });

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
      <h2 className="text-2xl font-bold mb-6">Apply for {position}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel" id="phone" name="phone" required />
        </div>
        <div>
          <Label htmlFor="resume">Resume</Label>
          <Input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label htmlFor="coverLetter">Cover Letter</Label>
          <Textarea id="coverLetter" name="coverLetter" rows={5} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};
