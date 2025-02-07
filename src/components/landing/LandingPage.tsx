
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6E59A5] via-[#9b87f5] to-[#D6BCFA]">
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
                className="h-28 w-auto object-contain"
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
                className="bg-white text-primary hover:bg-white/90"
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
                className="border-white text-white hover:bg-white/10 hover:text-white text-lg px-8"
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

      {/* About Us Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">About Us</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              EduLink is revolutionizing the way students learn and collaborate. Our platform brings together
              dedicated learners, creating a vibrant community focused on academic success.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-white/80">
                  To create a collaborative learning environment where students can connect, share knowledge,
                  and achieve their academic goals together.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Our Vision</h3>
                <p className="text-white/80">
                  To become the leading platform for student collaboration and peer-to-peer learning,
                  making quality education accessible to all.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3"
                  alt="Online learning"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have questions? We're here to help! Reach out to us through any of these channels.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Open Positions</h3>
                <div className="space-y-4 text-white/80">
                  <Button
                    variant="link"
                    className="text-white hover:text-white/80"
                    onClick={() => navigate("/apply/senior-learning-experience-designer")}
                  >
                    👨‍💻 Senior Learning Experience Designer
                  </Button>
                  <Button
                    variant="link"
                    className="text-white hover:text-white/80"
                    onClick={() => navigate("/apply/student-success-coordinator")}
                  >
                    🎯 Student Success Coordinator
                  </Button>
                  <Button
                    variant="link"
                    className="text-white hover:text-white/80"
                    onClick={() => navigate("/apply/community-partnership-manager")}
                  >
                    🤝 Community Partnership Manager
                  </Button>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Get in Touch</h3>
                <div className="space-y-4 text-white/80">
                  <p>📧 support.edulink@gmail.com</p>
                  <p>📞 +91 9843296163</p>
                  <p>📱 +91 9150947247</p>
                  <p>📲 +91 8076725006</p>
                  <p>🏢 SRM Institute of Science and Technology, Tiruchirappalli</p>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Office Hours</h3>
                <div className="space-y-2 text-white/80">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 h-[400px]"
            >
              <div className="w-full h-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.958170648906!2d78.81172931534882!3d10.760160092330472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5cef3f2f8b9%3A0x1c0a8e5b5e0f5b5a!2sSRM%20Institute%20of%20Science%20and%20Technology%2C%20Tiruchirappalli!5e0!3m2!1sen!2sin!4v1629788000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
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
