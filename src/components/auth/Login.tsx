
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for auth state changes, including OAuth redirects
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          // Record the auth method used
          const provider = session.user.app_metadata.provider || 'email';
          
          // Try to record the auth method
          await supabase.functions.invoke('handle-oauth-login', {
            body: { userId: session.user.id, provider }
          });
          
          toast({
            title: "Welcome back!",
            description: "Successfully logged in.",
          });
          
          navigate("/dashboard/matching");
        } catch (error) {
          console.error('Error recording auth method:', error);
          // Still navigate to dashboard even if recording auth method fails
          navigate("/dashboard/matching");
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Record the auth method used
            const provider = session.user.app_metadata.provider || 'email';
            
            // Try to record the auth method
            await supabase.functions.invoke('handle-oauth-login', {
              body: { userId: session.user.id, provider }
            });
            
            toast({
              title: "Welcome back!",
              description: "Successfully logged in.",
            });
            
            navigate("/dashboard/matching");
          } catch (error) {
            console.error('Error recording auth method:', error);
            // Still navigate to dashboard even if recording auth method fails
            navigate("/dashboard/matching");
          }
        }
      }
    );

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please enter both email and password.",
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
            variant: "destructive",
            title: "Login Failed",
            description: "Please check your email and password, or sign up if you don't have an account.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Error",
            description: error.message,
          });
        }
        return;
      }

      if (data.user) {
        // Record auth method is handled by the auth state change listener
        // No need to do anything here
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setSocialLoading(provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard/matching`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error(`${provider} login error:`, error);
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message,
        });
        return;
      }
      
      // If we get here without a redirect, something unusual happened
      console.log('OAuth response:', data);
      
    } catch (error) {
      console.error('Social login error:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setSocialLoading(null);
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
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 gap-2 font-normal"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading || socialLoading !== null}
              >
                {socialLoading === 'google' ? (
                  <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></span>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Google
              </Button>
              <Button 
                className="w-full bg-[#24292e] text-white hover:bg-[#2f363d] transition-all duration-300 gap-2 font-normal"
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading || socialLoading !== null}
              >
                {socialLoading === 'github' ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                ) : (
                  <Github className="h-4 w-4" />
                )}
                GitHub
              </Button>
            </div>
            
            <div className="flex items-center gap-2 py-2">
              <Separator className="flex-grow bg-white/30" />
              <span className="text-white/60 text-sm">OR</span>
              <Separator className="flex-grow bg-white/30" />
            </div>
            
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
                  className="bg-white/20 border-white/20 text-white placeholder:text-white/60 transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading || socialLoading !== null}
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
                  className="bg-white/20 border-white/20 text-white placeholder:text-white/60 transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading || socialLoading !== null}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 gap-2" 
                disabled={isLoading || socialLoading !== null}
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
                disabled={isLoading || socialLoading !== null}
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
