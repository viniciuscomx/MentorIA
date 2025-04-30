import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { insertKnowledgeAssessmentSchema } from "@shared/schema";
import { submitKnowledgeAssessment, createLearningPath } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

// Extend the schema with more validation
const knowledgeFormSchema = insertKnowledgeAssessmentSchema.extend({
  topic: z.string().min(3, "Topic must be at least 3 characters long"),
  currentLevel: z.string().min(1, "Please select your current knowledge level"),
  goals: z.string().min(10, "Please describe your goals in more detail"),
  preferredLearningStyle: z.string().min(1, "Please select your preferred learning style"),
  timeCommitment: z.string().min(1, "Please select your available time commitment"),
  additionalInfo: z.string().optional(),
});

type KnowledgeFormValues = z.infer<typeof knowledgeFormSchema>;

export default function KnowledgeForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPath, setIsCreatingPath] = useState(false);

  const form = useForm<KnowledgeFormValues>({
    resolver: zodResolver(knowledgeFormSchema),
    defaultValues: {
      topic: "",
      currentLevel: "",
      goals: "",
      preferredLearningStyle: "",
      timeCommitment: "",
      additionalInfo: "",
    },
  });

  async function onSubmit(data: KnowledgeFormValues) {
    setIsSubmitting(true);
    try {
      // Submit the assessment
      const assessment = await submitKnowledgeAssessment(data);
      
      toast({
        title: "Formulário enviado com sucesso",
        description: "Sua avaliação de conhecimento foi enviada com sucesso!",
      });
      
      // Ask user if they want to create a learning path
      const confirmCreation = window.confirm(
        "Deseja criar uma trilha de aprendizado com base na sua avaliação? Isso contará no seu limite mensal de 2 trilhas de aprendizado."
      );
      
      if (confirmCreation) {
        setIsCreatingPath(true);
        toast({
          title: "Criando trilha de aprendizado",
          description: "Isso pode levar um momento enquanto nossa IA gera sua trilha de aprendizado personalizada...",
        });
        
        // Generate the learning path
        const learningPath = await createLearningPath(assessment.id);
        
        toast({
          title: "Trilha de aprendizado criada",
          description: `Sua trilha de aprendizado "${learningPath.title}" foi criada com sucesso!`,
        });
        
        // Navigate to the learning path
        setLocation(`/learning-path/${learningPath.id}`);
      } else {
        // Navigate to dashboard
        setLocation("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsCreatingPath(false);
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-white text-xl">Ficha de Conhecimento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Tema de Interesse</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: JavaScript, Ciência de Dados, Marketing" 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-primary" 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Qual assunto ou habilidade você deseja aprender?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Nível de Conhecimento Atual</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus-visible:ring-primary">
                        <SelectValue placeholder="Selecione seu nível atual" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="beginner">Iniciante - Sem conhecimento prévio</SelectItem>
                      <SelectItem value="novice">Novato - Entendimento básico</SelectItem>
                      <SelectItem value="intermediate">Intermediário - Experiência prática</SelectItem>
                      <SelectItem value="advanced">Avançado - Conhecimento profundo</SelectItem>
                      <SelectItem value="expert">Especialista - Buscando maestria</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-500">
                    Como você avalia seu conhecimento atual nessa área?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Objetivos de Aprendizado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o que você quer alcançar..."
                      className="min-h-24 bg-gray-800 border-gray-700 text-white focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Quais habilidades ou conhecimentos específicos você deseja obter?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredLearningStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Estilo de Aprendizado Preferido</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus-visible:ring-primary">
                        <SelectValue placeholder="Selecione seu estilo de aprendizado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="visual">Visual - Aprendizado através de imagens e diagramas</SelectItem>
                      <SelectItem value="auditory">Auditivo - Aprendizado através de escuta e discussão</SelectItem>
                      <SelectItem value="reading">Leitura/Escrita - Aprendizado através de texto e anotações</SelectItem>
                      <SelectItem value="kinesthetic">Cinestésico - Aprendizado através da prática</SelectItem>
                      <SelectItem value="mixed">Misto - Combinação de diferentes estilos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-500">
                    Como você aprende com mais eficiência?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeCommitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Disponibilidade de Tempo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus-visible:ring-primary">
                        <SelectValue placeholder="Selecione o tempo disponível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="minimal">Mínimo (1-2 horas/semana)</SelectItem>
                      <SelectItem value="moderate">Moderado (3-5 horas/semana)</SelectItem>
                      <SelectItem value="significant">Significativo (6-10 horas/semana)</SelectItem>
                      <SelectItem value="intensive">Intensivo (10+ horas/semana)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-500">
                    Quanto tempo você pode dedicar ao aprendizado semanalmente?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Informações Adicionais (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qualquer outra informação que possa ajudar a personalizar sua trilha de aprendizado..."
                      className="min-h-24 bg-gray-800 border-gray-700 text-white focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Compartilhe quaisquer requisitos especiais, preferências ou experiência prévia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 mt-4"
              disabled={isSubmitting || isCreatingPath}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando formulário...
                </>
              ) : isCreatingPath ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Trilha de Aprendizado...
                </>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enviar Avaliação
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
