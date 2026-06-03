/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Opportunity, Course, Mentor, QuizQuestion, InterviewQuestion } from './types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Junior Front-End Developer',
    company: 'Maviance Cameroon',
    logoColor: 'from-blue-500 to-indigo-600',
    location: 'Buea (Silicon Mountain) • Remote Eligible',
    type: 'Full-time',
    sector: 'Tech & Dev',
    salary: '350,000 - 500,000 FCFA / month',
    description: 'Join our fintech engineering division, creators of Smobilpay. We are seeking a Junior Front-End Developer passionate about beautiful, highly readable digital payments systems. You will work on pixel-perfect React elements and optimize layouts for users with various network speeds.',
    requirements: [
      'Strong understanding of HTML5, CSS3, and modern JavaScript (ES6+)',
      'Basic familiarity with React (State hooks, component layout, clean props)',
      'Familiarity with responsive UI styling using Tailwind CSS',
      'Knowledge of Git version control and cooperative team review cycles'
    ],
    skillsRequired: ['React', 'Tailwind CSS', 'JavaScript', 'Git'],
    datePosted: '2 days ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-2',
    title: 'Associate UX/UI Designer',
    company: 'Orange Digital Center Innovation Lab',
    logoColor: 'from-amber-500 to-orange-600',
    location: 'Douala, Littoral (Hybrid)',
    type: 'Full-time',
    sector: 'UX/UI Design',
    salary: '400,000 - 650,000 FCFA / month',
    description: 'Collaborate within the Douala ODC Innovation Lab. As an Associate UI/UX Designer, you will lead local user workshops, map bilingual mobile application paths, and design accessible, high-contrast layouts for telecom and mobile money operators.',
    requirements: [
      'An elegant design portfolio reflecting visual clarity and clean typography layout',
      'Solid skills inside Figma (Auto-layout, reusable styles, interactive prototyping)',
      'Empathy for local internet bandwidth limitations and touch-target sizes',
      'Basic understanding of web standards on CSS grids and flex containers'
    ],
    skillsRequired: ['Figma', 'Wireframing', 'Typography', 'User Research'],
    datePosted: '5 days ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-3',
    title: 'SEO & Growth Marketing Intern',
    company: 'Zito Financial',
    logoColor: 'from-lime-500 to-emerald-600',
    location: 'Buea, Southwest (Hybrid)',
    type: 'Internship',
    sector: 'Marketing',
    salary: '150,000 - 250,000 FCFA / month',
    description: 'We are expanding our microfinance outreach services. Work directly with our growth lead to research relevant SEO keyword profiles, construct engaging English/French templates, and monitor monthly financial inclusion metrics.',
    requirements: [
      'Fundamental understanding of search engines and search metrics analysis',
      'Comfortable writing copy in both French and English (Bilingual Cameroon focus)',
      'Self-driven and analytically organized with excel spreadsheets and lists',
      'Familiarity with local digital social circles and scheduling packages'
    ],
    skillsRequired: ['SEO', 'Google Analytics', 'Copywriting', 'Content Strategy'],
    datePosted: '1 day ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-4',
    title: 'Software Engineering Apprentice',
    company: 'MTN Cameroon Labs',
    logoColor: 'from-amber-400 to-yellow-500',
    location: 'Douala, Akwa (Hybrid)',
    type: 'Apprenticeship',
    sector: 'Tech & Dev',
    salary: '300,000 FCFA / month',
    description: 'Our structured 12-month developers workshop is designed for junior talents. Under senior developers guidance, you will contribute directly to local telecom APIs, learn robust Node databases, and prepare for official certification path milestones.',
    requirements: [
      'Completed tech bootcamp, university computer course, or equivalent web study',
      'Basic understanding of database query statements (SQL/NoSQL) and API routing',
      'Cooperative teammate with high-performing verbal and written skills',
      'Eager to spend 6 hours weekly studying for professional frameworks and AWS certifications'
    ],
    skillsRequired: ['Node.js', 'SQL', 'TypeScript', 'Problem Solving'],
    datePosted: '1 week ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-5',
    title: 'Junior Product Designer',
    company: 'ICT University Innovation Hub',
    logoColor: 'from-sky-500 to-blue-700',
    location: 'Yaoundé, Centre (Hybrid)',
    type: 'Full-time',
    sector: 'UX/UI Design',
    salary: '350,000 - 450,000 FCFA / month',
    description: 'Help build intuitive interfaces for regional logistics trackers and academic planning systems. We seek a designer who loves standard layout consistency, touch layouts design, and translation frameworks.',
    requirements: [
      '1+ years of design experience or recent graduate with high-quality visual portfolio',
      'Solid eye for form alignment, responsive frameworks, and clear labeling',
      'Familiarity with translating interfaces into French and English layouts',
      'Communicative teammate who accepts and acts upon constructive design feedback'
    ],
    skillsRequired: ['Figma', 'Prototyping', 'Dashboard Design', 'User Testing'],
    datePosted: 'Just now',
    status: 'Not Applied'
  },
  {
    id: 'opp-6',
    title: 'Business Analytics & Data Intern',
    company: 'UBA Cameroon',
    logoColor: 'from-teal-400 to-emerald-600',
    location: 'Douala, Akwa (On-site)',
    type: 'Internship',
    salary: '220,000 FCFA / month',
    sector: 'Finance',
    description: 'Analyze real transaction parameters across the CEMAC region. Clean SQL datasets, construct business performance trackers, and prepare bilingual slides representing performance analytics for management meetings.',
    requirements: [
      'Enrolled or recently finished numeric fields (Mathematics, Computer Science, Finance)',
      'Hands-on experience with SQL joins and basic group-by statements',
      'Great diligence in editing, inspecting sheets, and organizing data files',
      'Fluency in French with a solid reading command of English technical terms'
    ],
    skillsRequired: ['SQL', 'Tableau', 'Excel', 'Data Analysis'],
    datePosted: '3 days ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-7',
    title: 'Sales Development Representative',
    company: 'Eneo Cameroun SA',
    logoColor: 'from-rose-500 to-red-600',
    location: 'Yaoundé (Hybrid)',
    type: 'Full-time',
    sector: 'Business & Sales',
    salary: '250,000 FCFA base + commission',
    description: 'Help roll out our enterprise prepaid energy trackers and billing services. You will conduct discovery calls, speak to company facility managers, and gather billing pain points.',
    requirements: [
      'Highly professional, polite, and bilingual vocal presentation skills',
      'Self-starter with outstanding customer empathy and follow-up habits',
      'Active listener who understands industrial energy challenges and CRM inputs',
      'Ability to communicate clearly with engineering and deployment leads'
    ],
    skillsRequired: ['Prospecting', 'Communication', 'CRM', 'SaaS Concepts'],
    datePosted: '6 days ago',
    status: 'Not Applied'
  },
  {
    id: 'opp-8',
    title: 'Content Creator & Socials Fellow',
    company: 'Njorku Ltd',
    logoColor: 'from-purple-500 to-indigo-700',
    location: 'Limbe, Southwest (Remote)',
    type: 'Part-time',
    salary: '150,000 FCFA / month',
    sector: 'Marketing',
    description: 'Njorku connects thousands of young Africans to jobs. Help craft our localized digital campaign, record short helpful video guides, and design high-impact graphics encouraging professional skill acquisition.',
    requirements: [
      'Active portfolio of reels or short visual media demonstrating high engagement',
      'Skilled with tools like CapCut, Canva, or Premiere to make rapid visual content',
      'Knowledge of local student communities and trending digital platforms',
      'Warm bicultural language tone (English/French bilingual is a plus)'
    ],
    skillsRequired: ['Video Editing', 'Social Strategy', 'Copywriting', 'Creative Ideation'],
    datePosted: '4 days ago',
    status: 'Not Applied'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Bilingual Mobile-First React Mastery',
    category: 'Development',
    provider: 'Silicon Mountain Hub Buea',
    duration: '14 hours',
    level: 'Beginner',
    color: 'emerald',
    progress: 0,
    completed: false,
    skillsUnlocked: ['React', 'Tailwind CSS', 'JavaScript']
  },
  {
    id: 'course-2',
    title: 'Accessible & Low-Bandwidth UX Systems',
    category: 'UX/UI Design',
    provider: 'Orange Digital Center Douala',
    duration: '8 hours',
    level: 'Intermediate',
    color: 'violet',
    progress: 45,
    completed: false,
    skillsUnlocked: ['Figma', 'Prototyping']
  },
  {
    id: 'course-3',
    title: 'SEO Secrets for the African Digisphere',
    category: 'Marketing',
    provider: 'Zito Growth Lab',
    duration: '10 hours',
    level: 'Intermediate',
    color: 'amber',
    progress: 80,
    completed: false,
    skillsUnlocked: ['SEO', 'Content Strategy']
  },
  {
    id: 'course-4',
    title: 'Securing Financial & Billing APIs (CEMAC)',
    category: 'Development',
    provider: 'ICT University Security Lab',
    duration: '6 hours',
    level: 'Advanced',
    color: 'sky',
    progress: 0,
    completed: false,
    skillsUnlocked: ['Node.js', 'Web Security']
  }
];

export const MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Devon Mbah',
    role: 'Senior Software Solutions Architect',
    company: 'Maviance Tech (Buea/Douala)',
    bio: 'Self-taught system engineer based in the Northwest region. Highly passionate about React speed metrics, local offline-first APIs, and supporting young Cameroonian talents enter Silicon Mountain teams.',
    avatarSeed: 'DM',
    color: 'from-blue-500 to-cyan-500',
    specialties: ['React', 'TypeScript', 'Portfolio Reviews', 'Salary Negotiating'],
    online: true
  },
  {
    id: 'mentor-2',
    name: 'Ngo Bella',
    role: 'Lead UX Architect & Researcher',
    company: 'Orange Innovation Lab (Douala)',
    bio: 'Over 8 years structuring accessible design systems and bicultural local user flows. Passionate about mentoring fresh designer talents inside the CEMAC digital zone.',
    avatarSeed: 'NB',
    color: 'from-fuchsia-500 to-rose-500',
    specialties: ['Figma Auto-layout', 'UX Research', 'Mock Critiques', 'Resume Cleanups'],
    online: true
  },
  {
    id: 'mentor-3',
    name: 'Kaleb Kamga',
    role: 'Digital Product Growth Manager',
    company: 'ActiveSpaces Hub Cameroon',
    bio: 'Business and technology leader. Specializes in CEMAC digital startup models, multi-channel growth loops, mobile integration, and young talent interview skill drills.',
    avatarSeed: 'KK',
    color: 'from-emerald-400 to-teal-600',
    specialties: ['Growth Sprints', 'SQL Analytics', 'Product Management', 'Presentation Skills'],
    online: true
  }
];

export const SKILL_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How does Tailwind CSS v4 support the configuration of custom design theme tokens (like fonts and utility colors)?',
    options: [
      'By declaring them in an external tailwind.config.js JavaScript object',
      'By defining them directly within CSS variables using @theme directive rules',
      'By modifying the webpack or vite bundler HTML config injectors',
      'By importing secondary JSON sheets in each separate component file'
    ],
    correctIndex: 1,
    explanation: 'In Tailwind CSS v4, custom theme tokens are configured natively within CSS using the @theme directive block, letting you specify custom variables directly in your main stylesheet.'
  },
  {
    id: 'q2',
    question: 'When designing interfaces for users in territories with diverse internet bandwidth speeds like Cameroon, which practice is critical?',
    options: [
      'Loading large high-resolution uncompressed 20MB video headers directly inline',
      'Optimizing asset compression, serving system vector icons, implementing visual skeletons, and using responsive CSS layouts',
      'Forcing users to wait 30 seconds for heavy JavaScript library configurations to complete before rendering text',
      'Removing all image tags completely and replacing the page with raw database binary files'
    ],
    correctIndex: 1,
    explanation: 'Mobile-first optimization for diverse bandwidth environments requires light page layouts, responsive images, offline caching, and skeleton templates to ensure excellent visual experiences, even on 3G.'
  },
  {
    id: 'q3',
    question: 'What is the absolute primary purpose of utilizing "Auto-Layout" frames inside design software like Figma?',
    options: [
      'To automatically convert design files directly into compiled C++ executables',
      'To build highly adaptive layout components that contract or stretch according to screen sizes or content changes',
      'To lock layers strictly in place so they can never be modified or shifted again',
      'To make vector shapes render in full 3D lighting without active processor loads'
    ],
    correctIndex: 1,
    explanation: 'Figma Auto-Layout models HTML/CSS box constraints, creating fluid elements that automatically resize relative to screen widths, paddings, or the inner text length.'
  },
  {
    id: 'q4',
    question: 'In modern Search Engine Optimization (SEO), which indicator most heavily demonstrates page authority and quality to search crawlers?',
    options: [
      'Flooding the website header tags with 800 duplicated keywords',
      'Rich, high-quality, readable content with contextual backlinks from highly reputable, relevant domain sources',
      'Forcing users to click standard popup boxes before viewing any textual context',
      'Minimizing page load speed to over 15 seconds to let search indexes crawl deep paths'
    ],
    correctIndex: 1,
    explanation: 'Search engines analyze backlink profile quality, context relevancy, and real user interactive speed indicators rather than superficial keyword stuffing.'
  },
  {
    id: 'q5',
    question: 'Under full-stack web architectures, why is it critical to route API requests that utilize sensitive secrets through clean server-side proxies?',
    options: [
      'To prevent the browser from exposing private API keys in client-side script inspection tools or Network headers',
      'To reduce the physical storage speed requirements of standard desktop monitors',
      'Because browser applications are completely incapable of carrying out basic fetch requests to external URLs',
      'To automatically trigger CSS keyframe slide transitions on the viewport headers'
    ],
    correctIndex: 0,
    explanation: 'Hardcoding sensitive API keys or developer keys directly in your client-side bundle exposes them instantly to any curious end-user via browser inspector, network logs, or source maps. Keep them on the server!'
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int-1',
    question: 'Can you describe a time when you faced a strict technical obstacle, and how you researched and implemented your solution?',
    role: 'Software Engineer / Developer',
    category: 'behavioral',
    tips: 'Focus on your methodical research sequence. Avoid generic terms like "I just googled it". Outline how you isolated the bug, read the library docs, tested minimal cases, and successfully rolled it out.',
    idealOutline: [
      'Context: Set the project background and state exactly what crashed.',
      'Action: Detail step-by-step diagnostic actions (reading logs, reviewing official docs, trying sandboxed test cases).',
      'Result: Reveal the working fix, the direct code metric outcomes, and what you learned to prevent future re-occurrences.'
    ]
  },
  {
    id: 'int-2',
    question: 'How do you go about verifying that your custom designed components are fully accessible and intuitive to a diverse audience?',
    role: 'UX/UI Designer',
    category: 'situational',
    tips: 'Acknowledge accessible standards like WCAG 2.1 specifications (color contrast levels of 4.5:1, screen reader keyboard accessibility, alt-text tags). Discuss your user testing layout protocols.',
    idealOutline: [
      'Design Checklist: State your core visual principles (using typography weight variations, checking color contrast layers).',
      'Functional Validation: Talk about keyboard-only testing and running semantic HTML audits (ARIA roles).',
      'User Research: Mention direct observations of youth or elder user groups facing multi-step interactive workflows.'
    ]
  },
  {
    id: 'int-3',
    question: 'Explain what a CSS flexbox layout is, and how it differs in primary axis alignment compared to cross-axis adjustments.',
    role: 'Junior Web Creator',
    category: 'technical',
    tips: 'Mention parent properties like display: flex, justify-content (main axis control), and align-items (cross axis alignment). Discuss flex-direction default values (row).',
    idealOutline: [
      'Container Declaration: Setting display: flex creates a flex container context.',
      'Primary Axis: justify-content handles positioning across the main direction.',
      'Cross Axis: align-items/align-self handle layout options perpendicular to the flow.'
    ]
  }
];
