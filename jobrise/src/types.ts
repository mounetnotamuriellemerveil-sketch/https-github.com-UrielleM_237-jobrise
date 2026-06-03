/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  logoColor: string; // Tailwind class like "from-indigo-500 to-purple-600"
  location: string;
  type: 'Full-time' | 'Internship' | 'Apprenticeship' | 'Part-time';
  sector: 'Tech & Dev' | 'UX/UI Design' | 'Marketing' | 'Business & Sales' | 'Finance';
  salary: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  datePosted: string;
  status: 'Not Applied' | 'Applied' | 'Under Review' | 'Interview' | 'Selected' | 'Declined';
}

export interface Application {
  id: string;
  opportunity: Opportunity;
  dateApplied: string;
  status: Opportunity['status'];
  notes?: string;
  timeline: {
    title: string;
    description: string;
    date: string;
    stage: 'applied' | 'review' | 'interview' | 'decision';
    completed: boolean;
    active: boolean;
  }[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string; // color group
  progress: number;
  completed: boolean;
  skillsUnlocked: string[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  avatarSeed: string; // for high-contrast letter or avatar
  color: string; // gradients
  specialties: string[];
  online: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  role: string;
  category: 'behavioral' | 'technical' | 'situational';
  tips: string;
  idealOutline: string[];
}

export interface AppEmail {
  id: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'Delivered' | 'Pending';
  jobTitle: string;
  type: 'Interview' | 'Selected';
}
