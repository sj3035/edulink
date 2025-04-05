
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail } from "lucide-react";
import { PasswordField } from "./PasswordField";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        // Add entry to user_auth_methods table
        const { error: methodError } = await supabase.from('user_auth_methods').insert([
          { user_id: data.user.id, provider: 'email' }
        ]);
        
        if (methodError) {
          console.error('Error recording auth method:', methodError);
        }
        
        toast({
          title: "Registration successful",
          description: "Please create your profile",
        });
        navigate("/create-profile");
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
                className="bg-white/20 border-white/20 text-white font-bold placeholder:text-white/60"
                disabled={isLoading}
              />
            </div>
            <PasswordField
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              label="Password"
              id="password"
              showCriteria={true}
              passwordCriteria={passwordCriteria}
            />
            <PasswordField
              password={confirmPassword}
              setPassword={setConfirmPassword}
              isLoading={isLoading}
              label="Confirm Password"
              id="confirmPassword"
              showPasswordMatch={true}
              passwordsMatch={passwordsMatch}
              confirmPassword={confirmPassword}
            />
            <Button 
              type="submit" 
              className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 gap-2"
              disabled={isLoading || !allCriteriaMet || !passwordsMatch}
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
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
