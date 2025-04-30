import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    setTimeout(() => {
      toast({
        title: "Ticket enviado",
        description: "Entraremos em contato em breve para ajudar você.",
      });
      setIsSubmitting(false);
      
      // Limpar o formulário
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Suporte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Card className="card-dark">
          <CardHeader className="pb-4">
            <HelpCircle className="h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-xl text-white">Central de Ajuda</CardTitle>
            <CardDescription className="text-gray-400">
              Acesse nossa base de conhecimento para encontrar respostas rápidas.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full border-gray-700 text-primary hover:text-white hover:bg-primary/20">
              Acessar Base de Conhecimento
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="card-dark">
          <CardHeader className="pb-4">
            <Mail className="h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-xl text-white">Email</CardTitle>
            <CardDescription className="text-gray-400">
              Entre em contato com nossa equipe via email para problemas complexos.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full border-gray-700 text-primary hover:text-white hover:bg-primary/20">
              suporte@eduai.com
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="card-dark">
          <CardHeader className="pb-4">
            <MessageCircle className="h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-xl text-white">Chat ao Vivo</CardTitle>
            <CardDescription className="text-gray-400">
              Converse diretamente com nossos especialistas durante o horário comercial.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full border-gray-700 text-primary hover:text-white hover:bg-primary/20">
              Iniciar Chat
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="card-dark mb-10">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Contato Direto</CardTitle>
          <CardDescription className="text-gray-400">
            Preencha o formulário abaixo para enviar um ticket de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Nome
                </label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user?.username || ""}
                  className="input-dark"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="input-dark"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                Assunto
              </label>
              <Input
                id="subject"
                name="subject"
                placeholder="Descreva brevemente sua questão"
                className="input-dark"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">
                Mensagem
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Detalhe sua questão aqui..."
                className="input-dark min-h-32"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Ticket"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="text-xl text-white">Perguntas Frequentes</CardTitle>
          <CardDescription className="text-gray-400">
            Respostas para as dúvidas mais comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium text-white">
                Como são criadas as trilhas de aprendizado?
              </h3>
              <p className="text-gray-400">
                Nossas trilhas são geradas através de inteligência artificial avançada que analisa seu perfil, objetivos e conhecimentos atuais para criar um plano de estudos personalizado.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-white">
                Quantas trilhas posso criar por mês?
              </h3>
              <p className="text-gray-400">
                Cada usuário pode criar até 2 trilhas de aprendizado por mês no plano atual.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-white">
                Os certificados são reconhecidos oficialmente?
              </h3>
              <p className="text-gray-400">
                Nossos certificados são reconhecidos pela plataforma EduAI, mas não substituem certificações profissionais específicas. Eles servem como comprovante do seu comprometimento e conclusão dos módulos de aprendizado.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-white">
                É possível editar uma trilha após sua criação?
              </h3>
              <p className="text-gray-400">
                No momento, as trilhas não podem ser editadas após a criação. Recomendamos avaliar cuidadosamente seus objetivos e preferências antes de gerar uma nova trilha.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}