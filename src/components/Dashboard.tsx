
import { Outlet } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`sticky top-0 z-50 ${
        isDark ? "bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50" : "bg-white/80 backdrop-blur-xl border-b border-slate-100"
      } transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/lovable-uploads/78f48b30-f42c-4945-8452-940e9c919cfc.png"
                alt="EduLink Logo"
                className="h-12 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-md"
              />
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ThemeToggle />
              <NotificationsMenu />
              <ProfileMenu />
            </motion.div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
