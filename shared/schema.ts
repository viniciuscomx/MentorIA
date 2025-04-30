import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  pathsCreatedThisMonth: integer("paths_created_this_month").default(0).notNull(),
  lastPathReset: timestamp("last_path_reset"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const knowledgeAssessments = pgTable("knowledge_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topic: text("topic").notNull(),
  currentLevel: text("current_level").notNull(),
  goals: text("goals").notNull(),
  preferredLearningStyle: text("preferred_learning_style").notNull(),
  timeCommitment: text("time_commitment").notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKnowledgeAssessmentSchema = createInsertSchema(knowledgeAssessments).pick({
  topic: true,
  currentLevel: true,
  goals: true,
  preferredLearningStyle: true,
  timeCommitment: true,
  additionalInfo: true,
});

export type InsertKnowledgeAssessment = z.infer<typeof insertKnowledgeAssessmentSchema>;
export type KnowledgeAssessment = typeof knowledgeAssessments.$inferSelect;

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  estimatedHours: integer("estimated_hours").notNull(),
  moduleCount: integer("module_count").default(0).notNull(),
  progress: integer("progress").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).pick({
  title: true,
  description: true,
  difficulty: true,
  category: true,
  estimatedHours: true,
  moduleCount: true,
});

export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  progress: integer("progress").default(0).notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  order: true,
});

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  type: text("type").notNull(), // 'lesson', 'exercise', 'project', 'exam'
  completed: boolean("completed").default(false).notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  title: true,
  content: true,
  order: true,
  type: true,
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
