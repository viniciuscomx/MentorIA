import { useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth-form";
import { BookOpen, Brain, GraduationCap, Lightbulb, Sparkles } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="bg-primary rounded-full p-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">EduAI</h1>
            <p className="text-gray-400 mt-2">Aprendizado personalizado por IA</p>
          </div>
          
          <AuthForm />
        </div>
      </div>
      
      {/* Right side - Hero content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-black p-8 flex items-center">
        <div className="max-w-lg mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme sua jornada de aprendizado
          </h2>
          
          <p className="text-white/80 text-lg mb-8">
            Descubra trilhas de aprendizado personalizadas criadas especificamente para suas necessidades,
            habilidades e objetivos — tudo gerado por IA avançada.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-full mr-4">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Trilhas de aprendizado geradas por IA</h3>
                <p className="text-white/70 mt-1">
                  Preencha uma simples ficha de conhecimento e deixe nossa IA criar
                  planos de aprendizado customizados para você.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-full mr-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Aprendizado baseado em módulos</h3>
                <p className="text-white/70 mt-1">
                  Cada trilha inclui módulos, aulas, exercícios, 
                  projetos práticos e avaliações.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-full mr-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Acompanhe seu progresso</h3>
                <p className="text-white/70 mt-1">
                  Monitore seu avanço através de painéis interativos
                  e celebre suas conquistas de aprendizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
