import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import ModuleCard from "@/components/module-card";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";

export default function LearningPath() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [_, params] = useRoute<{ id: string }>("/learning-path/:id");
  
  if (!params) {
    navigate("/dashboard");
    return null;
  }
  
  const pathId = parseInt(params.id);
  
  // Fetch learning path
  const { 
    data: path, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: [`/api/learning-paths/${pathId}`],
  });
  
  // Handle lesson completion
  const completeLessonMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/lessons/${id}/complete`, 
        { completed }
      );
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate path data to refresh progress
      queryClient.invalidateQueries({ queryKey: [`/api/learning-paths/${pathId}`] });
      
      toast({
        title: "Progress updated",
        description: "Your learning progress has been saved",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle lesson completion
  const handleLessonComplete = (lessonId: number, completed: boolean) => {
    completeLessonMutation.mutate({ id: lessonId, completed });
  };
  
  // If error occurred
  if (isError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 pb-16 md:pb-0">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-red-600">Error Loading Learning Path</h2>
              <p className="text-gray-500 mt-2">{(error as Error).message}</p>
              <Button 
                className="mt-6" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </main>
        
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Back button */}
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {/* Learning path header */}
          {isLoading ? (
            <Card className="mb-8">
              <CardHeader>
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{path?.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Based on your knowledge assessment
                    </CardDescription>
                  </div>
                  <Badge className="text-sm">{path?.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">{path?.description}</p>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Overall Progress</span>
                    </div>
                    <span className="text-sm font-medium">{path?.progress}%</span>
                  </div>
                  <Progress value={path?.progress} className="h-2" />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{path?.estimatedHours} hours estimated</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{path?.modules?.length} modules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Modules */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Learning Modules</h3>
            
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {path?.modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module}
                    onLessonComplete={handleLessonComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
