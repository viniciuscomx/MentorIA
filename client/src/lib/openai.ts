import { apiRequest } from "./queryClient";

// Interface for knowledge assessment form data
export interface KnowledgeAssessmentData {
  topic: string;
  currentLevel: string;
  goals: string;
  preferredLearningStyle: string;
  timeCommitment: string;
  additionalInfo?: string;
}

// Interface for generating a learning path
export async function createLearningPath(assessmentId: number) {
  try {
    const response = await apiRequest(
      "POST", 
      "/api/learning-paths", 
      { assessmentId }
    );
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to generate learning path: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Interface for submitting a knowledge assessment
export async function submitKnowledgeAssessment(data: KnowledgeAssessmentData) {
  try {
    const response = await apiRequest(
      "POST", 
      "/api/assessments", 
      data
    );
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to submit assessment: ${error instanceof Error ? error.message : String(error)}`);
  }
}
