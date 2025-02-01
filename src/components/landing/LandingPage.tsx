import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/lovable-uploads/e400d7d0-6ab3-4bb2-8675-71937fb914ba.png"
                alt="EduLink Logo"
                className="h-24 w-auto object-contain"
              />
            </motion.div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Connect with Study Partners,{" "}
              <span className="text-secondary">Excel Together</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join EduLink to find study partners who match your learning style, subjects, and schedule.
              Collaborate, learn, and achieve your academic goals together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8"
                onClick={() => navigate("/login")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-white mb-4 text-2xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto text-center text-white/60">
          <p>© 2024 EduLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "🤝",
    title: "Smart Matching",
    description: "Find study partners based on your subjects, learning style, and schedule compatibility.",
  },
  {
    icon: "💬",
    title: "Real-time Collaboration",
    description: "Chat, share resources, and work together in dedicated study rooms.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    description: "Set goals, monitor your progress, and celebrate achievements with your study partners.",
  },
];
