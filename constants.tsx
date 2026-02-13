import React from 'react';
import { AdmissionReminder, Category } from './types';

export const CATEGORIES = Object.values(Category);

export const ADMISSION_REMINDERS: AdmissionReminder[] = [
  { id: 1, text: "Focus on Super-curricular depth over participation.", priority: 'High' },
  { id: 2, text: "Explain HOW a challenge developed your thinking.", priority: 'High' },
  { id: 3, text: "Reflect on what you did NEXT after an activity.", priority: 'Medium' },
  { id: 4, text: "80% Academic, 20% Extra-curricular balance is ideal.", priority: 'Low' },
];

export const ICONS = {
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
  )
};