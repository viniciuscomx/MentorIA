import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, ArrowRight, BookOpen, ChevronLeft, 
  ChevronRight, Clock, FileText, HelpCircle, 
  LucideIcon, Pencil, Play, Settings, CheckCircle,
  BookMarked, Code, Award, Layers, ListChecks
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Module, Lesson } from "@shared/schema";

interface LessonWithStatus extends Lesson {
  isActive: boolean;
}

const LessonTypeIcons: Record<string, LucideIcon> = {
  lesson: BookMarked,
  exercise: Code,
  project: Pencil,
  exam: Award,
};

function LessonOverview({ lesson, onClick }: { 
  lesson: LessonWithStatus; 
  onClick: (lessonId: number) => void;
}) {
  const Icon = LessonTypeIcons[lesson.type] || FileText;
  
  return (
    <Button
      variant="ghost"
      className={`flex items-center justify-start gap-3 p-3 w-full h-auto text-left ${
        lesson.isActive 
          ? "bg-primary/20 text-primary hover:bg-primary/30"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
      onClick={() => onClick(lesson.id)}
    >
      <div className={`flex-shrink-0 ${lesson.completed ? "text-green-400" : ""}`}>
        {lesson.completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
      <div className="flex-1 truncate">
        <p className="text-sm font-medium truncate">{lesson.title}</p>
        <p className="text-xs text-gray-500">
          {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
        </p>
      </div>
    </Button>
  );
}

function LessonContent({ lesson, onComplete }: { 
  lesson: Lesson; 
  onComplete: (lessonId: number, completed: boolean) => void;
}) {
  const getLessonTypeLabel = () => {
    switch (lesson.type) {
      case 'lesson':
        return 'Aula';
      case 'exercise':
        return 'Exercício';
      case 'project':
        return 'Projeto';
      case 'exam':
        return 'Avaliação';
      default:
        return 'Conteúdo';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge className={`
          ${lesson.type === 'lesson' ? 'bg-blue-900/30 text-blue-400' : ''}
          ${lesson.type === 'exercise' ? 'bg-green-900/30 text-green-400' : ''}
          ${lesson.type === 'project' ? 'bg-purple-900/30 text-purple-400' : ''}
          ${lesson.type === 'exam' ? 'bg-amber-900/30 text-amber-400' : ''}
        `}>
          {getLessonTypeLabel()}
        </Badge>
        
        <div className="flex items-center gap-2">
          {lesson.completed ? (
            <Button 
              variant="outline"
              size="sm"
              className="text-green-400 border-green-800"
              onClick={() => onComplete(lesson.id, false)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Concluído
            </Button>
          ) : (
            <Button 
              className="bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => onComplete(lesson.id, true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Concluído
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">{lesson.title}</h2>
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      </div>
    </div>
  );
}

export default function ModuleView() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const moduleId = parseInt(id || "0");
  const { toast } = useToast();
  
  // Extrair id da lição da URL, se houver
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const urlLessonId = searchParams.get('lesson');
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(
    urlLessonId ? parseInt(urlLessonId) : null
  );
  
  const { data: module, isLoading: isLoadingModule } = useQuery<Module>({
    queryKey: ['/api/modules', moduleId],
    staleTime: 60 * 1000,
  });
  
  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons', moduleId],
    staleTime: 60 * 1000,
  });
  
  // Quando as lições são carregadas, definir a primeira como ativa se nenhuma estiver especificada na URL
  useEffect(() => {
    if (lessons?.length && activeLessonId === null) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);
  
  // Quando o activeLessonId muda, atualizar a URL
  useEffect(() => {
    if (activeLessonId !== null) {
      const newPath = `/module/${moduleId}?lesson=${activeLessonId}`;
      if (location !== newPath) {
        // Não usamos setLocation para evitar recarregar a página
        window.history.replaceState(null, '', newPath);
      }
    }
  }, [activeLessonId, moduleId, location, setLocation]);
  
  const handleLessonSelect = (lessonId: number) => {
    setActiveLessonId(lessonId);
  };
  
  const handleLessonComplete = async (lessonId: number, completed: boolean) => {
    if (!lessons) return;
    
    try {
      // Em um cenário real, você faria uma chamada de API
      // await fetch(`/api/lessons/${lessonId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ completed })
      // });
      
      // Atualizar o cache local
      const updatedLessons = lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed } : lesson
      );
      
      queryClient.setQueryData(['/api/lessons', moduleId], updatedLessons);
      
      // Exibir notificação
      toast({
        title: completed ? "Aula concluída" : "Status da aula atualizado",
        description: "Seu progresso foi atualizado com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar status da aula:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da aula.",
        variant: "destructive",
      });
    }
  };
  
  const navigateToNextLesson = () => {
    if (!lessons || activeLessonId === null) return;
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === activeLessonId);
    if (currentIndex < lessons.length - 1) {
      setActiveLessonId(lessons[currentIndex + 1].id);
    }
  };
  
  const navigateToPrevLesson = () => {
    if (!lessons || activeLessonId === null) return;
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === activeLessonId);
    if (currentIndex > 0) {
      setActiveLessonId(lessons[currentIndex - 1].id);
    }
  };
  
  if (isLoadingModule || isLoadingLessons) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!module || !lessons?.length) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Módulo não encontrado</h2>
        <p className="text-gray-400 mb-8">
          Este módulo não existe ou ainda não possui conteúdo disponível.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/learning-paths">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Trilhas
          </Link>
        </Button>
      </div>
    );
  }
  
  // Adicionar estado de ativo às lições
  const lessonsWithStatus: LessonWithStatus[] = lessons.map(lesson => ({
    ...lesson,
    isActive: lesson.id === activeLessonId
  }));
  
  const activeLesson = lessons.find(lesson => lesson.id === activeLessonId);
  
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progress = Math.round((completedLessons / totalLessons) * 100);
  
  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === activeLessonId);
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar esquerdo - Lista de lições */}
        <div className="lg:w-1/4">
          <div className="lg:sticky lg:top-4 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-300 hover:text-white"
                asChild
              >
                <Link href={`/learning-path/${module.pathId}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-white truncate">
                Módulo: {module.title}
              </h1>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progresso</span>
                <span className="text-gray-300">{completedLessons}/{totalLessons}</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-gray-700" 
                indicatorClassName="bg-primary" 
              />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white mb-2">Conteúdo do Módulo</h2>
              {lessonsWithStatus.map((lesson) => (
                <LessonOverview 
                  key={lesson.id} 
                  lesson={lesson} 
                  onClick={handleLessonSelect} 
                />
              ))}
            </div>
            
            <Separator className="bg-gray-800 my-6" />
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                <Layers className="h-4 w-4 mr-2" />
                Visão Geral
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                <ListChecks className="h-4 w-4 mr-2" />
                Material Complementar
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                <HelpCircle className="h-4 w-4 mr-2" />
                Obter Ajuda
              </Button>
            </div>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="lg:w-3/4">
          {activeLesson ? (
            <>
              <Card className="card-dark mb-6">
                <CardContent className="p-6">
                  <LessonContent 
                    lesson={activeLesson} 
                    onComplete={handleLessonComplete} 
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white"
                  disabled={!prevLesson}
                  onClick={navigateToPrevLesson}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {prevLesson ? 'Anterior' : 'Início do Módulo'}
                </Button>
                
                <Button
                  className="bg-primary hover:bg-primary/90"
                  disabled={!nextLesson}
                  onClick={navigateToNextLesson}
                >
                  {nextLesson ? 'Próximo' : 'Fim do Módulo'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="card-dark">
              <CardContent className="p-10 text-center">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Selecione uma aula</h3>
                <p className="text-gray-400 mb-6">
                  Escolha uma aula no menu lateral para começar a aprender.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}