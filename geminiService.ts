import { GoogleGenAI } from "@google/genai";
import { CVEntry, EducationEntry } from "../types";

export async function generateReflectiveParagraph(entry: CVEntry): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "AI reflection unavailable: API key not detected in environment.";
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-end University Admissions Consultant. Create a sophisticated 2-sentence reflection for a personal statement based on this experience: 
      Title: ${entry.title}
      Challenge faced: ${entry.challenge}
      Learning outcomes: ${entry.learning}`,
    });
    return response.text || "Reflection generated but empty.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI vault is currently busy. Please try reflecting again in a moment.";
  }
}

export async function generateEducationInsight(entry: EducationEntry): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Academic insight unavailable without API key.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an admissions expert, write a 1-sentence punchy academic insight for a personal statement about this student's background:
      Institution: ${entry.school}
      Qualification: ${entry.qualification}
      Subjects: ${entry.subjects}`,
    });
    return response.text || "Insight generated but empty.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not analyze academic profile at this time.";
  }
}
