import { Link } from "wouter";
import { LearningPath } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, BarChart, Sparkles } from "lucide-react";

interface LearningPathCardProps {
  path: LearningPath;
  className?: string;
}

export default function LearningPathCard({ path, className }: LearningPathCardProps) {
  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "iniciante":
        return "bg-primary/20 text-primary border-primary/20";
      case "intermediate":
      case "intermediário":
        return "bg-blue-700/20 text-blue-400 border-blue-700/20";
      case "advanced":
      case "avançado":
        return "bg-indigo-700/20 text-indigo-400 border-indigo-700/20";
      case "expert":
      case "especialista":
        return "bg-purple-700/20 text-purple-400 border-purple-700/20";
      default:
        return "bg-primary/20 text-primary border-primary/20";
    }
  };

  return (
    <Card className={`overflow-hidden bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors ${className}`}>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {path.title}
          </h3>
          <Badge className={getDifficultyColor(path.difficulty)}>
            {path.difficulty}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-3">
          {path.description}
        </p>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-400">Progresso</span>
            <span className="text-xs font-medium text-primary">{path.progress}%</span>
          </div>
          <Progress value={path.progress} className="h-2 bg-gray-700" indicatorClassName="bg-primary" />
        </div>
        
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3 text-gray-500" />
            <span>{path.estimatedHours} horas</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="mr-1 h-3 w-3 text-gray-500" />
            <span>Múltiplos módulos</span>
          </div>
          <div className="flex items-center">
            <BarChart className="mr-1 h-3 w-3 text-gray-500" />
            <span>Avaliação final</span>
          </div>
        </div>
      </div>
      
      <CardFooter className="bg-gray-950 px-6 py-4 border-t border-gray-800">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/learning-path/${path.id}`}>
            {path.progress > 0 ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Continuar
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Iniciar
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
