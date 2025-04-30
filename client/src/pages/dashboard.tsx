import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { LearningPath } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import LearningPathCard from "@/components/learning-path-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { 
  BookOpen, 
  BrainCircuit, 
  CheckCircle, 
  ClipboardList, 
  Clock, 
  Plus 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch learning paths
  const { data: learningPaths, isLoading: isLoadingPaths } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
    retry: false,
  });
  
  // Calculate stats
  const completedPaths = learningPaths?.filter((path: LearningPath) => path.progress === 100).length || 0;
  const activePaths = learningPaths?.filter((path: LearningPath) => path.progress > 0 && path.progress < 100).length || 0;
  const totalHours = learningPaths?.reduce((sum: number, path: LearningPath) => sum + path.estimatedHours, 0) || 0;
  const availablePathsThisMonth = 2 - (user?.pathsCreatedThisMonth || 0);
  
  // Get in-progress paths
  const inProgressPaths = learningPaths?.filter((path: LearningPath) => path.progress > 0 && path.progress < 100) || [];
  
  // Get latest paths
  const recentPaths = learningPaths?.slice(0, 3) || [];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <p className="text-gray-400 mt-1">Bem-vindo, {user?.username}</p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/assessment">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Trilha
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/20 rounded-md p-3">
                    <BookOpen className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Trilhas</dt>
                      <dd className="text-2xl font-semibold text-white">
                        {isLoadingPaths ? (
                          <Skeleton className="h-8 w-12 bg-gray-700" />
                        ) : (
                          learningPaths?.length || 0
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/20 rounded-md p-3">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Trilhas Completas</dt>
                      <dd className="text-2xl font-semibold text-white">
                        {isLoadingPaths ? (
                          <Skeleton className="h-8 w-12 bg-gray-700" />
                        ) : (
                          completedPaths
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/20 rounded-md p-3">
                    <ClipboardList className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Trilhas Ativas</dt>
                      <dd className="text-2xl font-semibold text-white">
                        {isLoadingPaths ? (
                          <Skeleton className="h-8 w-12 bg-gray-700" />
                        ) : (
                          activePaths
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/20 rounded-md p-3">
                    <Clock className="text-primary h-6 w-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Horas Totais</dt>
                      <dd className="text-2xl font-semibold text-white">
                        {isLoadingPaths ? (
                          <Skeleton className="h-8 w-12 bg-gray-700" />
                        ) : (
                          totalHours
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Path Availability Status */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Criação Mensal de Trilhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Trilhas criadas este mês</p>
                  <p className="text-2xl font-semibold mt-1 text-white">{user?.pathsCreatedThisMonth || 0} / 2</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {availablePathsThisMonth > 0
                      ? `Você pode criar mais ${availablePathsThisMonth} trilha${availablePathsThisMonth !== 1 ? 's' : ''} este mês`
                      : "Você atingiu seu limite mensal"
                    }
                  </p>
                </div>
                
                <ProgressCircle 
                  value={user?.pathsCreatedThisMonth || 0} 
                  max={2}
                  size={80}
                  strokeWidth={8}
                  color="#3B82F6" 
                  bgColor="#374151"
                  label={<span className="text-lg font-semibold text-white">{user?.pathsCreatedThisMonth || 0}/2</span>}
                />
              </div>
              
              {availablePathsThisMonth > 0 && (
                <Button asChild className="mt-4 w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Link href="/assessment">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Nova Trilha
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Em Progresso</h3>
              <Button variant="link" asChild className="text-primary hover:text-primary/90">
                <Link href="/learning-paths">Ver Todas</Link>
              </Button>
            </div>
            
            {isLoadingPaths ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-2/3 mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-full mb-6 bg-gray-700" />
                      <Skeleton className="h-9 w-full bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : inProgressPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressPaths.map((path) => (
                  <LearningPathCard key={path.id} path={path} />
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <BrainCircuit className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Nenhuma trilha em progresso</h4>
                  <p className="text-gray-400 mt-2">Inicie uma nova avaliação para obter sua trilha de aprendizado personalizada</p>
                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/assessment">
                      <Plus className="mr-2 h-4 w-4" />
                      Iniciar Avaliação
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Recent Paths */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Trilhas Recentes</h3>
            </div>
            
            {isLoadingPaths ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-full mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentPaths.length > 0 ? (
              <div className="space-y-4">
                {recentPaths.map((path) => (
                  <Card key={path.id} className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-white">{path.title}</h4>
                          <p className="text-gray-400 mt-1 line-clamp-2">{path.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="border-gray-700 text-white hover:bg-gray-800 hover:text-white">
                          <Link href={`/learning-path/${path.id}`}>
                            Visualizar
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Nenhuma trilha de aprendizado ainda</h4>
                  <p className="text-gray-400 mt-2">Complete uma avaliação para obter sua primeira trilha de aprendizado personalizada</p>
                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/assessment">
                      Começar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
