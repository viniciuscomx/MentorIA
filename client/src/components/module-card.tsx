import { useState } from "react";
import { Module, Lesson } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import LessonCard from "./lesson-card";

interface ModuleCardProps {
  module: Module & { lessons: Lesson[] };
  onLessonComplete: (lessonId: number, completed: boolean) => void;
}

export default function ModuleCard({ module, onLessonComplete }: ModuleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, description, progress, lessons } = module;
  
  // Group lessons by type
  const lessonsByType = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.type]) {
      acc[lesson.type] = [];
    }
    acc[lesson.type].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);
  
  // Sort lessons by order within each type
  Object.keys(lessonsByType).forEach(type => {
    lessonsByType[type].sort((a, b) => a.order - b.order);
  });
  
  // Order of lesson types
  const typeOrder = ["lesson", "exercise", "project", "exam"];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <CollapsibleTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
        </div>
        <CardDescription>{description}</CardDescription>
        
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">Module Progress</span>
            <span className="text-xs font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-2">
            {typeOrder.map(type => {
              if (!lessonsByType[type] || lessonsByType[type].length === 0) return null;
              
              return (
                <div key={type} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 capitalize">
                    {type === "exam" ? "Module Assessment" : `${type}s`}
                  </h4>
                  
                  <div className="space-y-2">
                    {lessonsByType[type].map(lesson => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onComplete={(completed) => onLessonComplete(lesson.id, completed)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
      
      <CardFooter className={isOpen ? "border-t" : "hidden"}>
        <Button 
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          {isOpen ? "Hide Content" : "Show Module Content"}
        </Button>
      </CardFooter>
    </Card>
  );
}
