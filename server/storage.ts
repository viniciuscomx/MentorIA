import { 
  users, type User, type InsertUser,
  knowledgeAssessments, type KnowledgeAssessment, type InsertKnowledgeAssessment,
  learningPaths, type LearningPath, type InsertLearningPath,
  modules, type Module, type InsertModule,
  lessons, type Lesson, type InsertLesson
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  createKnowledgeAssessment(assessment: InsertKnowledgeAssessment & { userId: number }): Promise<KnowledgeAssessment>;
  getKnowledgeAssessmentsByUser(userId: number): Promise<KnowledgeAssessment[]>;
  getKnowledgeAssessment(id: number): Promise<KnowledgeAssessment | undefined>;
  
  createLearningPath(path: InsertLearningPath & { userId: number, assessmentId: number }): Promise<LearningPath>;
  getLearningPathsByUser(userId: number): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<LearningPath | undefined>;
  updateLearningPathProgress(id: number, progress: number): Promise<LearningPath | undefined>;
  
  createModule(module: InsertModule & { pathId: number }): Promise<Module>;
  getModulesByPath(pathId: number): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  updateModuleProgress(id: number, progress: number): Promise<Module | undefined>;
  
  createLesson(lesson: InsertLesson & { moduleId: number }): Promise<Lesson>;
  getLessonsByModule(moduleId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  updateLessonStatus(id: number, completed: boolean): Promise<Lesson | undefined>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private knowledgeAssessments: Map<number, KnowledgeAssessment>;
  private learningPaths: Map<number, LearningPath>;
  private modules: Map<number, Module>;
  private lessons: Map<number, Lesson>;
  
  sessionStore: session.SessionStore;
  currentId: {
    users: number;
    knowledgeAssessments: number;
    learningPaths: number;
    modules: number;
    lessons: number;
  };

  constructor() {
    this.users = new Map();
    this.knowledgeAssessments = new Map();
    this.learningPaths = new Map();
    this.modules = new Map();
    this.lessons = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentId = {
      users: 1,
      knowledgeAssessments: 1,
      learningPaths: 1,
      modules: 1,
      lessons: 1
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      pathsCreatedThisMonth: 0,
      lastPathReset: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createKnowledgeAssessment(assessment: InsertKnowledgeAssessment & { userId: number }): Promise<KnowledgeAssessment> {
    const id = this.currentId.knowledgeAssessments++;
    const newAssessment: KnowledgeAssessment = {
      ...assessment,
      id,
      createdAt: new Date()
    };
    this.knowledgeAssessments.set(id, newAssessment);
    return newAssessment;
  }

  async getKnowledgeAssessmentsByUser(userId: number): Promise<KnowledgeAssessment[]> {
    return Array.from(this.knowledgeAssessments.values()).filter(
      (assessment) => assessment.userId === userId
    );
  }

  async getKnowledgeAssessment(id: number): Promise<KnowledgeAssessment | undefined> {
    return this.knowledgeAssessments.get(id);
  }

  async createLearningPath(path: InsertLearningPath & { userId: number, assessmentId: number }): Promise<LearningPath> {
    const id = this.currentId.learningPaths++;
    const newPath: LearningPath = {
      ...path,
      id,
      progress: 0,
      createdAt: new Date()
    };
    this.learningPaths.set(id, newPath);
    return newPath;
  }

  async getLearningPathsByUser(userId: number): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).filter(
      (path) => path.userId === userId
    );
  }

  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async updateLearningPathProgress(id: number, progress: number): Promise<LearningPath | undefined> {
    const path = await this.getLearningPath(id);
    if (!path) return undefined;
    
    const updatedPath: LearningPath = { ...path, progress };
    this.learningPaths.set(id, updatedPath);
    return updatedPath;
  }

  async createModule(module: InsertModule & { pathId: number }): Promise<Module> {
    const id = this.currentId.modules++;
    const newModule: Module = {
      ...module,
      id,
      progress: 0
    };
    this.modules.set(id, newModule);
    return newModule;
  }

  async getModulesByPath(pathId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.pathId === pathId)
      .sort((a, b) => a.order - b.order);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async updateModuleProgress(id: number, progress: number): Promise<Module | undefined> {
    const module = await this.getModule(id);
    if (!module) return undefined;
    
    const updatedModule: Module = { ...module, progress };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }

  async createLesson(lesson: InsertLesson & { moduleId: number }): Promise<Lesson> {
    const id = this.currentId.lessons++;
    const newLesson: Lesson = {
      ...lesson,
      id,
      completed: false
    };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async updateLessonStatus(id: number, completed: boolean): Promise<Lesson | undefined> {
    const lesson = await this.getLesson(id);
    if (!lesson) return undefined;
    
    const updatedLesson: Lesson = { ...lesson, completed };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }
}

export const storage = new MemStorage();
