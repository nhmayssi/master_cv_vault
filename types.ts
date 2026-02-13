export enum Category {
  MATH = 'Math',
  PHYSICS = 'Physics',
  ECON = 'Econ',
  CS = 'CS',
  AI = 'AI',
  OTHER = 'Other'
}

export interface CVEntry {
  id: string;
  title: string;
  category: Category;
  date: string;
  challenge: string;
  learning: string;
  link: string;
  reflection?: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  qualification: string;
  dates: string;
  subjects: string;
  notes: string;
  reflection?: string;
}

export interface AdmissionReminder {
  id: number;
  text: string;
  priority: 'High' | 'Medium' | 'Low';
}