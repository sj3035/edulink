import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard/matching");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 gap-12">
      <img
        src="/lovable-uploads/9c2e0ef8-56c7-489c-a082-a92d9d582760.png"
        alt="EduLink Logo"
        className="h-40 w-auto animate-fade-in"
      />
      <Card className="w-[400px] animate-fade-up">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate("/register")}
            >
              Create one
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};