
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { Separator } from "../ui/separator";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
            title: "Account created",
            description: "Please complete your profile",
          });
          
          navigate("/create-profile");
        } catch (error) {
          console.error('Error recording auth method:', error);
          // Still navigate to profile creation even if recording auth method fails
          navigate("/create-profile");
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
              title: "Account created!",
              description: "Please complete your profile",
            });
            
            navigate("/create-profile");
          } catch (error) {
            console.error('Error recording auth method:', error);
            // Still navigate to profile creation even if recording auth method fails
            navigate("/create-profile");
          }
        }
      }
    );

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const passwordCriteria = {
    minLength: password.length >= 8 && password.length <= 15,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== "";

  const validatePassword = (password: string) => {
    if (!allCriteriaMet) {
      return "Password does not meet all criteria";
    }
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        toast({
          title: "Error",
          description: passwordValidationError,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!passwordsMatch) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Recording auth method is now handled by auth state change listener
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'github') => {
    try {
      setSocialLoading(provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/create-profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error(`${provider} sign up error:`, error);
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: error.message,
        });
        return;
      }
      
      // If we get here without a redirect, something unusual happened
      console.log('OAuth response:', data);
      
    } catch (error) {
      console.error('Social sign up error:', error);
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
      <div className="w-full max-w-md relative px-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <img
          src="/lovable-uploads/78f48b30-f42c-4945-8452-940e9c919cfc.png"
          alt="EduLink Logo"
          className="h-28 w-auto mx-auto animate-fade-in drop-shadow-lg filter brightness-110 contrast-125"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 animate-fade-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button 
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 gap-2 font-normal"
              onClick={() => handleSocialSignUp('google')}
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
              onClick={() => handleSocialSignUp('github')}
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
            
          <div className="flex items-center gap-2 py-2 mb-4">
            <Separator className="flex-grow bg-white/30" />
            <span className="text-white/60 text-sm">OR</span>
            <Separator className="flex-grow bg-white/30" />
          </div>
            
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                disabled={isLoading || socialLoading !== null}
              />
            </div>
            <PasswordField
              password={password}
              setPassword={setPassword}
              isLoading={isLoading || socialLoading !== null}
              label="Password"
              id="password"
              showCriteria={true}
              passwordCriteria={passwordCriteria}
            />
            <PasswordField
              password={confirmPassword}
              setPassword={setConfirmPassword}
              isLoading={isLoading || socialLoading !== null}
              label="Confirm Password"
              id="confirmPassword"
              showPasswordMatch={true}
              passwordsMatch={passwordsMatch}
              confirmPassword={confirmPassword}
            />
            <Button 
              type="submit" 
              className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 gap-2"
              disabled={isLoading || !allCriteriaMet || !passwordsMatch || socialLoading !== null}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Register with Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-white/80">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-white hover:text-white/80"
              onClick={() => navigate("/login")}
              disabled={isLoading || socialLoading !== null}
            >
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
