
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        toast({
          title: "Missing Information",
          description: "Please enter both email and password.",
          style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Please check your email and password, or sign up if you don't have an account.",
            style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
          });
        } else {
          toast({
            title: "Login Error",
            description: error.message,
            style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
          });
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Add entry to user_auth_methods table
        const { error: methodError } = await supabase.from('user_auth_methods').insert([
          { user_id: data.user.id, provider: 'email' }
        ]);
        
        if (methodError) {
          console.error('Error recording auth method:', methodError);
        }
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });
        navigate("/dashboard/matching");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        style: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#9b87f5] via-[#c4b8fa] to-[#E6DDFF] gap-16 p-4">
      <div className="w-full max-w-[400px] relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-0 text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <img
          src="/lovable-uploads/e400d7d0-6ab3-4bb2-8675-71937fb914ba.png"
          alt="EduLink Logo"
          className="h-28 w-auto mx-auto animate-fade-in drop-shadow-lg filter brightness-110 contrast-125"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-white">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/20 text-white font-bold placeholder:text-white/60 transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/20 text-white font-bold placeholder:text-white/60 transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Sign in with Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full text-white/80">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 text-white hover:text-white/80 transition-all duration-300" 
                onClick={() => navigate("/register")}
                disabled={isLoading}
              >
                Create one
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
