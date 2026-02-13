import { GoogleGenAI } from "@google/genai";
import { CVEntry, EducationEntry } from "../types";

export async function generateReflectiveParagraph(entry: CVEntry): Promise<string> {
  if (!process.env.API_KEY) return "AI Key missing. Reflecting manually: I developed strong problem-solving skills.";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `University admissions consultant. Reflect on this in 2 sentences: Title: ${entry.title}, Challenge: ${entry.challenge}, Learning: ${entry.learning}.`,
    });
    return response.text.trim();
  } catch { return "Reflection failed."; }
}

export async function generateEducationInsight(entry: EducationEntry): Promise<string> {
  if (!process.env.API_KEY) return "AI Key missing. My subjects provided a strong academic foundation.";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Admissions consultant. Create a 1-sentence insight for personal statement: School: ${entry.school}, Qualification: ${entry.qualification}, Subjects: ${entry.subjects}.`,
    });
    return response.text.trim();
  } catch { return "Insight failed."; }
}