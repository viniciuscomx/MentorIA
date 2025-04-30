import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react";

export default function ModuleView() {
  const [, navigate] = useLocation();
  const [_, params] = useRoute<{ id: string }>("/module/:id");
  
  if (!params) {
    navigate("/dashboard");
    return null;
  }
  
  const moduleId = parseInt(params.id);
  
  // Fetch module
  const { 
    data: module, 
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`/api/modules/${moduleId}`],
  });
  
  // Fetch learning path if module is loaded
  const {
    data: path,
    isLoading: isLoadingPath,
  } = useQuery({
    queryKey: module ? [`/api/learning-paths/${module.pathId}`] : null,
    enabled: !!module,
  });
  
  // If error occurred
  if (isError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 pb-16 md:pb-0">
          <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-red-600">Error Loading Module</h2>
              <p className="text-gray-500 mt-2">The module could not be loaded</p>
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
          {/* Breadcrumbs */}
          {isLoading || isLoadingPath ? (
            <Skeleton className="h-6 w-64 mb-6" />
          ) : (
            <Breadcrumb className="mb-6">
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/learning-path/${path!.id}`}>
                  {path!.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>{module!.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          )}
          
          {/* Module header */}
          <div className="bg-white rounded-lg border p-6 mb-8">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full mb-6" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{module!.title}</h1>
                <p className="text-gray-600 mt-2">{module!.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Module Progress</span>
                    </div>
                    <span className="text-sm font-medium">{module!.progress}%</span>
                  </div>
                  <Progress value={module!.progress} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/learning-path/${module!.pathId}`)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Learning Path
                  </Button>
                  
                  {module!.progress === 100 ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Module Completed</span>
                    </div>
                  ) : (
                    <Button>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Lesson list */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Module Content</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border rounded-md p-4">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {module!.lessons.map((lesson, index) => (
                  <div 
                    key={lesson.id} 
                    className={`border rounded-md p-4 ${
                      lesson.completed ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {index + 1}. {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {lesson.type === "lesson" ? "Lesson" : 
                           lesson.type === "exercise" ? "Practice Exercise" :
                           lesson.type === "project" ? "Project" : "Assessment"}
                        </p>
                      </div>
                      
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Button size="sm" variant="outline">
                          {lesson.type === "lesson" ? "Start" : 
                           lesson.type === "exercise" ? "Practice" :
                           lesson.type === "project" ? "Start Project" : "Take Test"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!isLoading && (
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/learning-path/${module!.pathId}`)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Learning Path
                </Button>
                
                <Button 
                  disabled={module!.progress < 100}
                  variant={module!.progress === 100 ? "default" : "outline"}
                >
                  Next Module
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
