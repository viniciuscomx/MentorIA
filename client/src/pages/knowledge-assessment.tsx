import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import KnowledgeForm from "@/components/knowledge-form";
import { Brain } from "lucide-react";

export default function KnowledgeAssessment() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Knowledge Assessment</h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Tell us about your current knowledge, goals, and learning preferences. Our AI will
              generate a personalized learning path tailored specifically to your needs.
            </p>
          </div>
          
          <KnowledgeForm />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
