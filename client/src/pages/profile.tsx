import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User, Settings, Award, Book, Sparkles, Mail, Calendar, Flag, Key, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulação de atualização
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };
  
  const stats = [
    {
      label: "Trilhas Completadas",
      value: "1",
      icon: <Award className="h-4 w-4 text-green-400" />,
    },
    {
      label: "Trilhas Em Progresso",
      value: "2",
      icon: <Book className="h-4 w-4 text-blue-400" />,
    },
    {
      label: "Certificados",
      value: "1",
      icon: <Award className="h-4 w-4 text-yellow-400" />,
    },
  ];
  
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
              <p className="text-gray-400 mt-1">Gerencie suas informações pessoais</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-gray-300 hover:text-white"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    form="profile-form"
                    className="bg-primary hover:bg-primary/90"
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="card-dark">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-white mb-1">{user?.username}</h2>
                <p className="text-gray-400 mb-4">Estudante</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                    Programação
                  </Badge>
                  <Badge className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/40">
                    Web
                  </Badge>
                  <Badge className="bg-purple-900/30 text-purple-400 hover:bg-purple-900/40">
                    Design
                  </Badge>
                </div>
                
                <Separator className="bg-gray-800 my-4" />
                
                <div className="grid grid-cols-3 gap-4 w-full">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex items-center mb-1">
                        {stat.icon}
                      </div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-gray-800 my-4" />
                
                <p className="text-gray-400 text-sm mb-4">
                  Membro desde Abril 2025
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-lg text-white">Limite de Trilhas</CardTitle>
              <CardDescription className="text-gray-400">
                Seu plano permite 2 trilhas por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Trilhas Restantes</span>
                    <span className="text-sm font-medium text-white">0/2</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-4">
                    Próxima trilha disponível em 12 dias
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade de Plano
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="info" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Informações
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Notificações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card className="card-dark mt-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Informações Pessoais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Nome de Usuário</Label>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <Input
                            id="name"
                            placeholder="Seu nome"
                            defaultValue={user?.username}
                            className="input-dark"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="input-dark"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-gray-300">Idioma Preferido</Label>
                        <div className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-gray-500" />
                          <select
                            id="language"
                            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            defaultValue="pt-BR"
                            disabled={!isEditing}
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-gray-300">Fuso Horário</Label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <select
                            id="timezone"
                            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            defaultValue="America/Sao_Paulo"
                            disabled={!isEditing}
                          >
                            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                            <option value="America/New_York">Nova York (GMT-4)</option>
                            <option value="Europe/London">Londres (GMT+1)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="card-dark mt-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Áreas de Interesse</CardTitle>
                  <CardDescription className="text-gray-400">
                    Selecione suas áreas de interesse para recomendações personalizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer px-3 py-1.5">
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Programação
                    </Badge>
                    <Badge className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/40 cursor-pointer px-3 py-1.5">
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Web
                    </Badge>
                    <Badge className="bg-purple-900/30 text-purple-400 hover:bg-purple-900/40 cursor-pointer px-3 py-1.5">
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Design
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer px-3 py-1.5">
                      Ciência de Dados
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer px-3 py-1.5">
                      Inteligência Artificial
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer px-3 py-1.5">
                      Marketing Digital
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer px-3 py-1.5">
                      Desenvolvimento Pessoal
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer px-3 py-1.5">
                      Gestão de Projetos
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="card-dark mt-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Segurança da Conta</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie a segurança da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-gray-300">Senha Atual</Label>
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-gray-500" />
                          <Input
                            id="current-password"
                            type="password"
                            className="input-dark"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-gray-300">Nova Senha</Label>
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-gray-500" />
                          <Input
                            id="new-password"
                            type="password"
                            className="input-dark"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-gray-300">Confirmar Nova Senha</Label>
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-gray-500" />
                          <Input
                            id="confirm-password"
                            type="password"
                            className="input-dark"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="bg-primary hover:bg-primary/90">
                      Atualizar Senha
                    </Button>
                  </div>
                  
                  <Separator className="bg-gray-800 my-4" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Dispositivos Conectados</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Win</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Windows - Chrome</p>
                            <p className="text-xs text-gray-500">São Paulo, Brasil • Ativo agora</p>
                          </div>
                        </div>
                        <Badge className="bg-green-900/30 text-green-400">
                          Atual
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="card-dark mt-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Preferências de Notificação</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie como você recebe notificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base text-white">Notificações por Email</Label>
                        <p className="text-sm text-gray-400">
                          Receba atualizações importantes por email
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <Separator className="bg-gray-800" />
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">Tipos de Notificação</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-gray-300">Atualizações de Trilhas</Label>
                          <p className="text-xs text-gray-500">
                            Notificações sobre novos módulos ou conteúdos
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-gray-300">Lembretes</Label>
                          <p className="text-xs text-gray-500">
                            Lembretes para completar módulos e aulas
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-gray-300">Marketing e Promoções</Label>
                          <p className="text-xs text-gray-500">
                            Ofertas especiais e novidades da plataforma
                          </p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                    
                    <Button className="bg-primary hover:bg-primary/90">
                      Salvar Preferências
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-dark mt-6">
                <CardHeader className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">Notificações Recentes</CardTitle>
                    <Button variant="link" className="text-primary h-auto p-0">
                      Marcar todas como lidas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800">
                    <div className="flex gap-4 p-4 hover:bg-gray-900">
                      <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-white">Nova trilha disponível</p>
                          <span className="text-xs text-gray-500">12h atrás</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Você pode criar uma nova trilha de aprendizado agora.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 p-4 hover:bg-gray-900">
                      <div className="h-10 w-10 bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-white">Lembrete de progresso</p>
                          <span className="text-xs text-gray-500">2d atrás</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Você não avançou em sua trilha de JavaScript esta semana.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}