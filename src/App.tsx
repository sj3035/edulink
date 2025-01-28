import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { UserProfile } from "./components/UserProfile";
import { MatchingModule } from "./components/MatchingModule";
import { ProgressTracking } from "./components/ProgressTracking";
import { Community } from "./components/Community";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/matching" element={<MatchingModule />} />
            <Route path="/progress" element={<ProgressTracking />} />
            <Route path="/community" element={<Community />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;