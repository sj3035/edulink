import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Community } from "./components/Community";
import { MatchingModule } from "./components/MatchingModule";
import { ProgressTracking } from "./components/ProgressTracking";
import { UserProfile } from "./components/UserProfile";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/toaster";
import { LandingPage } from "./components/landing/LandingPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="matching" element={<MatchingModule />} />
              <Route path="community" element={<Community />} />
              <Route path="progress" element={<ProgressTracking />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;