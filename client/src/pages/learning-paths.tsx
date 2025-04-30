import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, Calendar, Clock, Filter, Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { LearningPath } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";

// Este componente representa um cartão individual de trilha de aprendizado
function LearningPathCard({ path }: { path: LearningPath }) {
  return (
    <Card className="card-dark h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-white">{path.title}</CardTitle>
            <CardDescription className="text-gray-400">
              {path.category} • {path.estimatedHours} horas
            </CardDescription>
          </div>
          <Badge className={path.progress === 100 
            ? "bg-green-900/30 text-green-400 hover:bg-green-900/40"
            : path.progress > 0 
              ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40" 
              : "bg-gray-800 text-gray-400"
          }>
            {path.progress === 100 
              ? "Concluído" 
              : path.progress > 0 
                ? "Em progresso" 
                : "Não iniciado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {path.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{path.moduleCount} módulos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{path.estimatedHours} horas</span>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="text-gray-300">{path.progress}%</span>
            </div>
            <Progress value={path.progress} className="h-2 bg-gray-700" indicatorClassName="bg-primary" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-gray-800">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/learning-path/${path.id}`}>
            {path.progress > 0 ? "Continuar Trilha" : "Iniciar Trilha"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function LearningPaths() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Buscar trilhas de aprendizado do usuário
  const { data: learningPaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
    staleTime: 60 * 1000, // 1 minuto
  });
  
  const categories = [
    "Programação", "Design", "Marketing", "Negócios", 
    "Ciência de Dados", "Inteligência Artificial"
  ];
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  // Aplicar filtros e pesquisa nas trilhas
  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = searchTerm === "" || 
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilters.length === 0 || 
      activeFilters.includes(path.category);
      
    return matchesSearch && matchesFilter;
  });
  
  const completedPaths = filteredPaths?.filter(path => path.progress === 100) || [];
  const inProgressPaths = filteredPaths?.filter(path => path.progress > 0 && path.progress < 100) || [];
  const notStartedPaths = filteredPaths?.filter(path => path.progress === 0) || [];
  
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white">Minhas Trilhas de Aprendizado</h1>
            
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar trilhas..."
                  className="pl-8 input-dark w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/knowledge-assessment">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Trilha
                </Link>
              </Button>
            </div>
          </div>
          
          {isFiltersOpen && (
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">Filtros</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setActiveFilters([])}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge 
                          key={category}
                          className={`cursor-pointer px-3 py-1 ${
                            activeFilters.includes(category)
                              ? "bg-primary/20 text-primary hover:bg-primary/30"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                          onClick={() => toggleFilter(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Duração</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>0h</span>
                          <span>50h+</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full relative">
                          <div className="absolute h-4 w-4 bg-primary rounded-full top-1/2 -translate-y-1/2" style={{ left: '30%' }}></div>
                          <div className="absolute h-4 w-4 bg-primary rounded-full top-1/2 -translate-y-1/2" style={{ left: '70%' }}></div>
                          <div className="absolute h-2 bg-primary rounded-full" style={{ left: '30%', right: '30%' }}></div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          className="bg-gray-800 border-gray-700 text-white w-16 text-center"
                          value="5"
                        />
                        <span className="text-gray-400">-</span>
                        <Input
                          type="number"
                          className="bg-gray-800 border-gray-700 text-white w-16 text-center"
                          value="30"
                        />
                        <span className="text-gray-400">horas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Aplicar Filtros
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="mb-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-gray-900 border-gray-800">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Todas ({filteredPaths?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Em Progresso ({inProgressPaths.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Concluídas ({completedPaths.length})
                </TabsTrigger>
                <TabsTrigger value="not-started" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Não Iniciadas ({notStartedPaths.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredPaths?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredPaths.map((path) => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma trilha encontrada</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      {activeFilters.length > 0 || searchTerm
                        ? "Nenhuma trilha corresponde aos seus filtros. Tente ajustar seus critérios de busca."
                        : "Você ainda não possui trilhas de aprendizado. Crie sua primeira trilha agora."}
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/knowledge-assessment">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Nova Trilha
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="in-progress">
                {inProgressPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {inProgressPaths.map((path) => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma trilha em andamento</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Você não possui trilhas de aprendizado em andamento no momento.
                    </p>
                    {filteredPaths?.length ? (
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href={`/learning-path/${filteredPaths[0].id}`}>
                          Iniciar Uma Trilha
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/knowledge-assessment">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Nova Trilha
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {completedPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {completedPaths.map((path) => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma trilha concluída</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Complete suas trilhas de aprendizado para vê-las aqui.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="not-started">
                {notStartedPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {notStartedPaths.map((path) => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma trilha não iniciada</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Todas as suas trilhas já foram iniciadas ou você ainda não criou nenhuma.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href="/knowledge-assessment">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Nova Trilha
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Informações sobre limites de trilha */}
          <Card className="bg-gray-900 border-gray-800 mt-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">Limite de Trilhas</CardTitle>
              <CardDescription className="text-gray-400">
                Seu plano atual permite criar até 2 trilhas de aprendizado por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Trilhas Disponíveis este Mês</span>
                    <span className="text-sm font-medium text-white">1/2</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-white">Renovação Mensal</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Seu limite de trilhas será renovado em 12/05/2025
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-white">Trilhas Criadas</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Você criou 1 de 2 trilhas possíveis este mês
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-white">Upgrade de Plano</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Aumente seu limite para até 5 trilhas por mês
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}