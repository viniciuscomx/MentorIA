import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import KnowledgeAssessment from "@/pages/knowledge-assessment";
import LearningPath from "@/pages/learning-path";
import ModuleView from "@/pages/module-view";
import NotFound from "@/pages/not-found";
import Support from "@/pages/support";
import Certificates from "@/pages/certificates";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/assessment" component={KnowledgeAssessment} />
      <ProtectedRoute path="/learning-path/:id" component={LearningPath} />
      <ProtectedRoute path="/learning-paths" component={Dashboard} />
      <ProtectedRoute path="/module/:id" component={ModuleView} />
      <ProtectedRoute path="/certificates" component={Certificates} />
      <ProtectedRoute path="/support" component={Support} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
