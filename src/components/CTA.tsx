import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/profile");
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Learning Journey?</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Join thousands of students who are already experiencing the power of collaborative learning.
          Start your journey today.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg px-8 bg-white text-primary hover:bg-white/90 transition-colors"
          onClick={handleGetStarted}
        >
          Get Started Now
        </Button>
      </motion.div>
    </section>
  );
};