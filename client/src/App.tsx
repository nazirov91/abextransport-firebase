import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/components/HomePage";
import NotFound from "@/pages/not-found";
import { GlobalsProvider } from "@/lib/globals";
import { AuthProvider } from "@/lib/auth";
import { FaqProvider } from "@/lib/faq";
import AdminPage from "@/pages/admin";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalsProvider>
          <FaqProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </FaqProvider>
        </GlobalsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
