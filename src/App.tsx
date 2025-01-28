import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Community } from "./components/Community";
import { MatchingModule } from "./components/MatchingModule";
import { ProgressTracking } from "./components/ProgressTracking";
import { UserProfile } from "./components/UserProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div>
            <UserProfile />
            <MatchingModule />
            <Community />
            <ProgressTracking />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
