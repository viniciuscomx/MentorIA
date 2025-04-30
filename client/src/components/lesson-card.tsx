import { useState } from "react";
import { Lesson } from "@shared/schema";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, FileText, Code, Presentation, FileQuestion } from "lucide-react";

interface LessonCardProps {
  lesson: Lesson;
  onComplete: (completed: boolean) => void;
}

export default function LessonCard({ lesson, onComplete }: LessonCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, content, type, completed } = lesson;
  
  // Helper function to get icon based on type
  const getLessonIcon = () => {
    switch (type) {
      case "lesson":
        return <FileText className="h-4 w-4" />;
      case "exercise":
        return <Code className="h-4 w-4" />;
      case "project":
        return <Presentation className="h-4 w-4" />;
      case "exam":
        return <FileQuestion className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const handleCompleteChange = (checked: boolean) => {
    onComplete(checked);
    if (!isOpen) return;
    
    if (checked) {
      // Auto-close dialog after marking as complete with slight delay
      setTimeout(() => setIsOpen(false), 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card 
          className={cn(
            "cursor-pointer hover:shadow-sm transition-shadow",
            completed ? "bg-primary/5 border-primary/20" : ""
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex-shrink-0 p-1.5 rounded-full",
                  completed ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                )}>
                  {completed ? <Check className="h-4 w-4" /> : getLessonIcon()}
                </div>
                <div>
                  <h4 className={cn(
                    "text-sm font-medium",
                    completed ? "text-primary" : "text-gray-700"
                  )}>
                    {title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {type === "exam" ? "Assessment" : type}
                    {completed && " • Completed"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {type === "exam" ? "Complete this assessment to evaluate your understanding" : 
             type === "project" ? "Complete this project to apply your knowledge" :
             type === "exercise" ? "Practice with this exercise to reinforce your learning" :
             "Read and understand this lesson content"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto mt-4">
          <div className="prose prose-sm max-w-none">
            {/* Content would ideally be markdown-rendered HTML */}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="lesson-complete" 
              checked={completed}
              onCheckedChange={handleCompleteChange}
            />
            <Label htmlFor="lesson-complete">Mark as completed</Label>
          </div>
          
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
