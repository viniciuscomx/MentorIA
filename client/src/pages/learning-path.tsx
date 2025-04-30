import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, BookOpen, Clock, Settings, CheckCircle,
  ChevronRight, FileText, PlayCircle, BookMarked,
  Code, Award, X, CheckCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LearningPath, Module, Lesson } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type ModuleWithLessons = Module & { lessons: Lesson[] };

function LessonItem({ lesson, onToggleComplete }: { 
  lesson: Lesson; 
  onToggleComplete: (lessonId: number, completed: boolean) => void;
}) {
  const getIcon = () => {
    switch (lesson.type) {
      case 'lesson':
        return <BookMarked className="h-5 w-5 text-blue-400" />;
      case 'exercise':
        return <Code className="h-5 w-5 text-green-400" />;
      case 'project':
        return <FileText className="h-5 w-5 text-purple-400" />;
      case 'exam':
        return <Award className="h-5 w-5 text-yellow-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border border-gray-800 rounded-md bg-gray-900 hover:bg-gray-900/80 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{lesson.title}</h4>
          <p className="text-xs text-gray-400">
            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          asChild
        >
          <Link href={`/module/${lesson.moduleId}?lesson=${lesson.id}`}>
            <PlayCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Acessar</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={lesson.completed ? "text-green-400" : "text-gray-500"}
          onClick={() => onToggleComplete(lesson.id, !lesson.completed)}
        >
          {lesson.completed ? <CheckCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

function ModuleSection({ module, onLessonComplete }: { 
  module: ModuleWithLessons; 
  onLessonComplete: (lessonId: number, completed: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calcular progresso do módulo
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return (
    <Card className="card-dark mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-white">
              Módulo {module.order}: {module.title}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {module.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span>{totalLessons} aulas</span>
          </div>
          <span className="text-gray-300">{completedLessons}/{totalLessons} concluídas</span>
        </div>
        
        <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-primary" />
      </CardContent>
      
      {isExpanded && (
        <>
          <Separator className="bg-gray-800 mx-6" />
          <CardContent className="pt-4 space-y-3">
            {module.lessons.map((lesson) => (
              <LessonItem 
                key={lesson.id} 
                lesson={lesson} 
                onToggleComplete={onLessonComplete} 
              />
            ))}
          </CardContent>
        </>
      )}
      
      <CardFooter className="pt-0">
        <Button asChild className="bg-primary hover:bg-primary/90 w-full">
          <Link href={`/module/${module.id}`}>
            Ir para Módulo
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function LearningPathPage() {
  const { id } = useParams<{ id: string }>();
  const pathId = parseInt(id);
  const { toast } = useToast();
  
  const { data: path, isLoading: isLoadingPath } = useQuery<LearningPath>({
    queryKey: ['/api/learning-paths', pathId],
    staleTime: 60 * 1000, // 1 minuto
  });
  
  const { data: modules, isLoading: isLoadingModules } = useQuery<ModuleWithLessons[]>({
    queryKey: ['/api/modules', pathId],
    staleTime: 60 * 1000,
  });
  
  const handleLessonComplete = async (lessonId: number, completed: boolean) => {
    try {
      // Em um cenário real, você faria uma chamada de API
      // await fetch(`/api/lessons/${lessonId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ completed })
      // });
      
      // Atualizar cache local
      const updatedModules = modules?.map(module => {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        );
        
        return { ...module, lessons: updatedLessons };
      });
      
      // Atualizar o cache para refletir a mudança
      queryClient.setQueryData(['/api/modules', pathId], updatedModules);
      
      // Exibir notificação
      toast({
        title: completed ? "Aula concluída" : "Aula marcada como pendente",
        description: "O progresso da sua trilha foi atualizado.",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar status da aula:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da aula. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoadingPath || isLoadingModules) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!path || !modules) {
    return (
      <div className="container mx-auto py-8 px-4 text-center min-h-[70vh] flex flex-col justify-center">
        <X className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Trilha não encontrada</h1>
        <p className="text-gray-400 mb-6">A trilha que você está buscando não existe ou foi removida.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 mx-auto">
          <Link href="/learning-paths">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Trilhas
          </Link>
        </Button>
      </div>
    );
  }
  
  // Calcular estatísticas gerais
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.completed).length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="lg:w-3/4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-300 hover:text-white"
                asChild
              >
                <Link href="/learning-paths">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-white">{path.title}</h1>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button asChild className="bg-primary hover:bg-primary/90 flex-1 md:flex-none">
                <Link href={`/module/${modules[0]?.id || ''}`}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {completedLessons > 0 ? "Continuar" : "Iniciar"}
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Opções
              </Button>
            </div>
          </div>
          
          <Card className="card-dark">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Sobre esta trilha</h2>
                    <p className="text-gray-300">
                      {path.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-800 text-gray-300">
                        {path.difficulty}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        {path.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{path.estimatedHours} horas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>{modules.length} módulos</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="self-center md:self-start">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-700 stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                      ></circle>
                    </svg>
                    <div className="absolute flex flex-col justify-center items-center">
                      <span className="text-2xl font-bold text-white">{progressPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Conteúdo da Trilha</h2>
            
            {modules.length > 0 ? (
              modules.map((module) => (
                <ModuleSection 
                  key={module.id} 
                  module={module} 
                  onLessonComplete={handleLessonComplete} 
                />
              ))
            ) : (
              <Card className="card-dark">
                <CardContent className="p-10 text-center">
                  <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum módulo disponível</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Esta trilha ainda não possui módulos. Volte mais tarde para verificar atualizações.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/4">
          <div className="lg:sticky lg:top-4 space-y-6">
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progresso geral</span>
                    <span className="text-gray-300">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-gray-700" indicatorClassName="bg-primary" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Aulas</span>
                    <span className="text-gray-300">{completedLessons}/{totalLessons}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {modules.map((module) => {
                      const moduleProgress = module.lessons.length > 0
                        ? Math.round((module.lessons.filter(l => l.completed).length / module.lessons.length) * 100)
                        : 0;
                      
                      return (
                        <div 
                          key={module.id} 
                          className="h-1.5 rounded-full"
                          style={{ 
                            background: moduleProgress === 100 
                              ? '#10b981' // verde para concluído
                              : moduleProgress > 0 
                                ? '#3b82f6' // azul para em progresso
                                : '#374151', // cinza para não iniciado
                            width: '100%'
                          }}
                          title={`Módulo ${module.order}: ${moduleProgress}%`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              
              <Separator className="bg-gray-800" />
              
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCheck className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">Concluídos</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{completedLessons}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Tempo estimado</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{path.estimatedHours}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-300">Total de módulos</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{modules.length}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                {progressPercentage === 100 ? (
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/certificates">
                      <Award className="h-4 w-4 mr-2" />
                      Ver Certificado
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/module/${modules[0]?.id || ''}`}>
                      {completedLessons > 0 ? "Continuar Trilha" : "Iniciar Trilha"}
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card className="card-dark">
              <CardHeader>
                <CardTitle className="text-lg text-white">Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Material Complementar
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                    <Award className="h-4 w-4 mr-2" />
                    Critérios de Certificação
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizar Trilha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}