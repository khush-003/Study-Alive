// A study material stores its subject, type, title, metadata, duration, and optional filename.
export const studyMaterials = [
  { id: 'intro-programming', subject: 'cs', type: 'notes', title: 'Introduction to Programming (PDF)', meta: 'Notes • 2.4 MB • Python Syntax & Logic Flow', filename: 'Intro_To_Programming.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'red' },
  { id: 'data-structures-video', subject: 'cs', type: 'videos', title: 'Data Structures Basics', meta: 'Video • 18 mins • Arrays, Stacks, Linked Lists', duration: '18 mins', filename: '', iconClass: 'fa-solid fa-circle-play', color: 'blue' },
  { id: 'oop-concepts', subject: 'cs', type: 'notes', title: 'Object Oriented Programming', meta: 'Notes • 1.8 MB • Classes, Objects, Inheritance', filename: 'OOP_Concepts.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'red' },
  { id: 'previous-year-papers', subject: 'cs', type: 'practice', title: 'Previous Year Papers', meta: 'Practice • 5 sets with verified answer keys', filename: 'PYQ_Papers_5Sets.zip', iconClass: 'fa-regular fa-clipboard', color: 'emerald' },
  { id: 'quick-revision-guide', subject: 'cs', type: 'notes', title: 'Quick Revision Guide', meta: 'PDF • 1.2 MB • One-night formula & snippet sheet', filename: 'Quick_Revision_CS.pdf', iconClass: 'fa-solid fa-bolt', color: 'purple' },
  { id: 'physics-mechanics-notes', subject: 'physics', type: 'notes', title: 'Mechanics & Motion Notes', meta: 'Notes • 3.1 MB • Kinematics, Newton’s Laws & Energy', filename: 'Physics_Mechanics_Notes.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'red' },
  { id: 'physics-electrodynamics-video', subject: 'physics', type: 'videos', title: 'Electrodynamics: Core Concepts', meta: 'Video • 24 mins • Fields, Circuits & Induction', duration: '24 mins', filename: '', iconClass: 'fa-solid fa-circle-play', color: 'blue' },
  { id: 'physics-practice', subject: 'physics', type: 'practice', title: 'Class 12 Physics Practice Set', meta: 'Practice • 40 questions with answer key', filename: 'Physics_Practice_Set.pdf', iconClass: 'fa-regular fa-clipboard', color: 'emerald' },
  { id: 'physics-formula-book', subject: 'physics', type: 'books', title: 'Physics Formula Handbook', meta: 'Book • 1.6 MB • Essential equations and constants', filename: 'Physics_Formula_Handbook.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'purple' },
  { id: 'math-calculus-notes', subject: 'math', type: 'notes', title: 'Calculus & Continuity Notes', meta: 'Notes • 2.8 MB • Limits, Derivatives & Integrals', filename: 'Math_Calculus_Notes.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'red' },
  { id: 'math-vectors-video', subject: 'math', type: 'videos', title: 'Vectors and 3D Geometry', meta: 'Video • 16 mins • Direction ratios and planes', duration: '16 mins', filename: '', iconClass: 'fa-solid fa-circle-play', color: 'blue' },
  { id: 'math-practice', subject: 'math', type: 'practice', title: 'Calculus Practice Questions', meta: 'Practice • 30 worked problems', filename: 'Calculus_Practice_Questions.pdf', iconClass: 'fa-regular fa-clipboard', color: 'emerald' },
  { id: 'math-formula-book', subject: 'math', type: 'books', title: 'Class 12 Mathematics Formula Book', meta: 'Book • 1.4 MB • Quick reference for board exams', filename: 'Math_Formula_Book.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'purple' },
  { id: 'chemistry-organic-notes', subject: 'chemistry', type: 'notes', title: 'Organic Chemistry Notes', meta: 'Notes • 2.2 MB • Reactions, mechanisms & naming', filename: 'Organic_Chemistry_Notes.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'red' },
  { id: 'chemistry-reactions-video', subject: 'chemistry', type: 'videos', title: 'Chemical Bonding Explained', meta: 'Video • 21 mins • Bond types and molecular shapes', duration: '21 mins', filename: '', iconClass: 'fa-solid fa-circle-play', color: 'blue' },
  { id: 'chemistry-practice', subject: 'chemistry', type: 'practice', title: 'Physical Chemistry Practice Set', meta: 'Practice • Numericals with worked solutions', filename: 'Physical_Chemistry_Practice.pdf', iconClass: 'fa-regular fa-clipboard', color: 'emerald' },
  { id: 'chemistry-syllabus-book', subject: 'chemistry', type: 'books', title: 'Chemistry Syllabus & Revision Guide', meta: 'Book • 1.7 MB • Organic, physical and inorganic topics', filename: 'Chemistry_Revision_Guide.pdf', iconClass: 'fa-regular fa-file-pdf', color: 'purple' },
];

export const studySubjects = [
  { id: 'cs', label: 'Computer Science', description: 'CBSE Class 12 & Engineering Fundamentals' },
  { id: 'physics', label: 'Physics (Mechanics & Electrodynamics)', description: 'Class 12 mechanics, electricity and magnetism' },
  { id: 'math', label: 'Mathematics (Calculus & Vectors)', description: 'Class 12 calculus, algebra and geometry' },
  { id: 'chemistry', label: 'Chemistry (Organic & Physical)', description: 'Class 12 organic, physical and inorganic chemistry' },
];

export const studyMaterialsBySubject = Object.fromEntries(
  studySubjects.map((subject) => [subject.id, studyMaterials.filter((material) => material.subject === subject.id)]),
);
