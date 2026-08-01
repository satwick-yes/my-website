import { AcademicData, AITrainingData, TechnicalProjectData } from './types';

export const academicsPayload: AcademicData = {
  institution: "Student at Chandigarh University.",
  activities: "Active participant in academic and technical workshops.",
  highlights: [
    "Attended the Open Rocket Workshop organized by the Department of Aerospace Engineering.",
    "Attended a guided tour of the Ropar Architectural Museum."
  ]
};

export const aiTrainingPayload: AITrainingData[] = [
  { title: "Artificial intelligence training program completion through Launched Global." },
  { title: "Gender and age detector project training with NullClass." }
];

export const technicalProjectsPayload: TechnicalProjectData[] = [
  {
    category: "Systems Architecture",
    description: "Designed backend architecture for a chatbot utilizing a two-stage LLM classifier and router, strictly mapped out via structural specifications and pseudo-code, integrated with a Supabase database."
  },
  {
    category: "Web Development",
    description: "Front-end and mobile web development utilizing Next.js, TypeScript, TailwindCSS, Git, and GitHub. Designed custom interactive code and web design scripts."
  },
  {
    category: "Computer Science Foundations",
    description: "Comprehensive review and implementation of C programming structures, data structures, database management, bubble sort, and insertion sort methodologies."
  },
  {
    category: "Collaborations",
    description: "Constructed video scripts and promotional strategies for Maali's Dissertation Support."
  }
];
