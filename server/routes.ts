import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertKnowledgeAssessmentSchema } from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Initialize OpenAI client
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY || "" 
  });

  // Knowledge assessment routes
  app.post("/api/assessments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertKnowledgeAssessmentSchema.parse(req.body);
      const assessment = await storage.createKnowledgeAssessment({
        ...validatedData,
        userId: req.user!.id
      });
      
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create assessment" });
    }
  });

  app.get("/api/assessments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessments = await storage.getKnowledgeAssessmentsByUser(req.user!.id);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessment = await storage.getKnowledgeAssessment(parseInt(req.params.id));
      if (!assessment) return res.status(404).json({ error: "Assessment not found" });
      if (assessment.userId !== req.user!.id) return res.sendStatus(403);
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  // Learning path routes
  app.post("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      // Check if user has reached monthly limit
      const user = req.user!;
      const currentDate = new Date();
      
      // Reset counter if it's a new month
      if (!user.lastPathReset || 
          user.lastPathReset.getMonth() !== currentDate.getMonth() || 
          user.lastPathReset.getFullYear() !== currentDate.getFullYear()) {
        await storage.updateUser(user.id, { 
          pathsCreatedThisMonth: 0,
          lastPathReset: currentDate
        });
        user.pathsCreatedThisMonth = 0;
      }
      
      if (user.pathsCreatedThisMonth >= 2) {
        return res.status(403).json({ error: "Monthly limit of 2 learning paths reached" });
      }
      
      // Validate assessment exists and belongs to user
      const assessment = await storage.getKnowledgeAssessment(req.body.assessmentId);
      if (!assessment) return res.status(404).json({ error: "Assessment not found" });
      if (assessment.userId !== user.id) return res.sendStatus(403);
      
      // Generate learning path using OpenAI
      const prompt = `
        Create a personalized learning path for a student with the following characteristics:
        - Topic of interest: ${assessment.topic}
        - Current knowledge level: ${assessment.currentLevel}
        - Learning goals: ${assessment.goals}
        - Preferred learning style: ${assessment.preferredLearningStyle}
        - Time commitment: ${assessment.timeCommitment}
        - Additional information: ${assessment.additionalInfo || "None"}
        
        Create a structured learning path with:
        1. A title for the learning path
        2. A detailed description of the learning journey
        3. Difficulty level (Beginner, Intermediate, Advanced)
        4. Estimated hours to complete
        5. 3-6 modules with titles and descriptions
        6. For each module, include 3-5 lessons, 1-2 exercises, a small project, and a module assessment
        
        Format your response as a JSON object with the following structure:
        {
          "title": "...",
          "description": "...",
          "difficulty": "...",
          "estimatedHours": number,
          "modules": [
            {
              "title": "...",
              "description": "...",
              "order": number,
              "lessons": [
                {
                  "title": "...",
                  "content": "...",
                  "order": number,
                  "type": "lesson|exercise|project|exam"
                }
              ]
            }
          ]
        }
      `;
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator specializing in creating well-structured learning paths."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      
      const pathData = JSON.parse(response.choices[0].message.content);
      
      // Create learning path
      const learningPath = await storage.createLearningPath({
        userId: user.id,
        assessmentId: assessment.id,
        title: pathData.title,
        description: pathData.description,
        difficulty: pathData.difficulty,
        estimatedHours: pathData.estimatedHours,
      });
      
      // Create modules and lessons
      for (const moduleData of pathData.modules) {
        const module = await storage.createModule({
          pathId: learningPath.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
        });
        
        for (const lessonData of moduleData.lessons) {
          await storage.createLesson({
            moduleId: module.id,
            title: lessonData.title,
            content: lessonData.content,
            order: lessonData.order,
            type: lessonData.type,
          });
        }
      }
      
      // Increment user's count of paths created this month
      await storage.updateUser(user.id, { 
        pathsCreatedThisMonth: user.pathsCreatedThisMonth + 1 
      });
      
      // Return the learning path with its modules and lessons
      const modules = await storage.getModulesByPath(learningPath.id);
      const moduleWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await storage.getLessonsByModule(module.id);
          return { ...module, lessons };
        })
      );
      
      res.status(201).json({
        ...learningPath,
        modules: moduleWithLessons
      });
      
    } catch (error) {
      console.error("Error creating learning path:", error);
      res.status(500).json({ error: "Failed to create learning path" });
    }
  });

  app.get("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const paths = await storage.getLearningPathsByUser(req.user!.id);
      res.json(paths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning paths" });
    }
  });

  app.get("/api/learning-paths/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const path = await storage.getLearningPath(parseInt(req.params.id));
      if (!path) return res.status(404).json({ error: "Learning path not found" });
      if (path.userId !== req.user!.id) return res.sendStatus(403);
      
      const modules = await storage.getModulesByPath(path.id);
      const moduleWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await storage.getLessonsByModule(module.id);
          return { ...module, lessons };
        })
      );
      
      res.json({
        ...path,
        modules: moduleWithLessons
      });
      
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning path" });
    }
  });

  app.patch("/api/learning-paths/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const pathId = parseInt(req.params.id);
      const path = await storage.getLearningPath(pathId);
      if (!path) return res.status(404).json({ error: "Learning path not found" });
      if (path.userId !== req.user!.id) return res.sendStatus(403);
      
      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Invalid progress value" });
      }
      
      const updatedPath = await storage.updateLearningPathProgress(pathId, progress);
      res.json(updatedPath);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to update learning path progress" });
    }
  });

  // Module routes
  app.get("/api/modules/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const module = await storage.getModule(parseInt(req.params.id));
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      // Check if module belongs to user
      const path = await storage.getLearningPath(module.pathId);
      if (!path || path.userId !== req.user!.id) return res.sendStatus(403);
      
      const lessons = await storage.getLessonsByModule(module.id);
      
      res.json({
        ...module,
        lessons
      });
      
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  app.patch("/api/modules/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      // Check if module belongs to user
      const path = await storage.getLearningPath(module.pathId);
      if (!path || path.userId !== req.user!.id) return res.sendStatus(403);
      
      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Invalid progress value" });
      }
      
      const updatedModule = await storage.updateModuleProgress(moduleId, progress);
      
      // Update overall path progress based on modules
      const modules = await storage.getModulesByPath(path.id);
      const totalProgress = modules.reduce((sum, mod) => sum + mod.progress, 0) / modules.length;
      await storage.updateLearningPathProgress(path.id, Math.round(totalProgress));
      
      res.json(updatedModule);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to update module progress" });
    }
  });

  // Lesson routes
  app.get("/api/lessons/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const lesson = await storage.getLesson(parseInt(req.params.id));
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });
      
      // Check if lesson belongs to user
      const module = await storage.getModule(lesson.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      const path = await storage.getLearningPath(module.pathId);
      if (!path || path.userId !== req.user!.id) return res.sendStatus(403);
      
      res.json(lesson);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.patch("/api/lessons/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });
      
      // Check if lesson belongs to user
      const module = await storage.getModule(lesson.moduleId);
      if (!module) return res.status(404).json({ error: "Module not found" });
      
      const path = await storage.getLearningPath(module.pathId);
      if (!path || path.userId !== req.user!.id) return res.sendStatus(403);
      
      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: "Invalid completed value" });
      }
      
      const updatedLesson = await storage.updateLessonStatus(lessonId, completed);
      
      // Update module progress based on lessons
      const lessons = await storage.getLessonsByModule(module.id);
      const completedLessons = lessons.filter(l => l.completed).length;
      const moduleProgress = Math.round((completedLessons / lessons.length) * 100);
      await storage.updateModuleProgress(module.id, moduleProgress);
      
      // Update overall path progress based on modules
      const modules = await storage.getModulesByPath(path.id);
      const totalProgress = modules.reduce((sum, mod) => sum + mod.progress, 0) / modules.length;
      await storage.updateLearningPathProgress(path.id, Math.round(totalProgress));
      
      res.json(updatedLesson);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to update lesson status" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
