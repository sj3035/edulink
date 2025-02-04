import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-8 glass p-8 rounded-2xl"
      >
        <span className="inline-block px-4 py-1.5 glass-card rounded-full text-primary text-sm font-medium mb-4">
          Find Your Perfect Study Partner
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Connect, Learn, and
          <span className="text-primary"> Succeed Together</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join a community of students who help each other excel. Find study partners that match your
          schedule, subjects, and learning style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="magic-button text-lg px-8"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="glass-button text-lg px-8 text-primary hover:text-primary-foreground"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </section>
  );
};