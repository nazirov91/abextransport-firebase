import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/components/HomePage";
import NotFound from "@/pages/not-found";
import { GlobalsProvider } from "@/lib/globals";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalsProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </GlobalsProvider>
    </QueryClientProvider>
  );
}

export default App;
