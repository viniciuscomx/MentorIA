import { Award, Download, ExternalLink, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Certificates() {
  // Em uma aplicação real, esses dados viriam do backend
  const certificates = [
    {
      id: 1,
      title: "Programação em JavaScript Avançado",
      date: "15/04/2025",
      issueDate: "15/04/2025",
      category: "Desenvolvimento Web",
      status: "Concluído",
      credentialId: "CERT-JS-ADV-20250415-001",
      progress: 100,
    },
  ];

  const inProgressCourses = [
    {
      id: 101,
      title: "Ciência de Dados com Python",
      startDate: "10/03/2025",
      estimatedEndDate: "10/06/2025",
      category: "Ciência de Dados",
      progress: 65,
    },
    {
      id: 102,
      title: "Marketing Digital",
      startDate: "05/04/2025",
      estimatedEndDate: "20/05/2025",
      category: "Marketing",
      progress: 32,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Certificados</h1>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar certificados..."
              className="pl-8 input-dark w-full"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">
            Filtrar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="completed" className="mb-8">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Concluídos
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Em Progresso
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed">
          {certificates.length > 0 ? (
            <div className="grid gap-6 mt-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="card-dark">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Award className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-xl text-white">{cert.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            Emitido em {cert.issueDate} • ID: {cert.credentialId}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Categoria</p>
                        <p className="text-gray-300">{cert.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Data de Emissão</p>
                        <p className="text-gray-300">{cert.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Progresso</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${cert.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-300">{cert.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 border-t border-gray-800 pt-4">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verificar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-dark mt-6">
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Award className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum certificado ainda</h3>
                <p className="text-gray-400 text-center mb-6">
                  Complete suas trilhas de aprendizado para receber certificados.
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Explorar Trilhas
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          <div className="grid gap-6 mt-6">
            {inProgressCourses.map((course) => (
              <Card key={course.id} className="card-dark">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Iniciado em {course.startDate} • Término previsto: {course.estimatedEndDate}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/40">
                      Em Progresso
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Categoria</p>
                      <p className="text-gray-300">{course.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data de Início</p>
                      <p className="text-gray-300">{course.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Progresso</p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Continuar Trilha
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="card-dark mt-12">
        <CardHeader>
          <CardTitle className="text-xl text-white">Certificação EduAI</CardTitle>
          <CardDescription className="text-gray-400">
            Entenda como funciona nosso processo de certificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="font-medium text-white">Complete as Trilhas</h3>
              </div>
              <p className="text-gray-400">
                Finalize todos os módulos e avaliações de uma trilha de aprendizado.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="font-medium text-white">Avaliação Final</h3>
              </div>
              <p className="text-gray-400">
                Realize e seja aprovado na avaliação de conhecimento final da trilha.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="font-medium text-white">Certificado Digital</h3>
              </div>
              <p className="text-gray-400">
                Receba e compartilhe seu certificado digital verificável.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}