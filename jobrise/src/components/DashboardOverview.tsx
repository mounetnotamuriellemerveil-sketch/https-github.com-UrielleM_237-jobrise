/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Compass, 
  Briefcase, 
  CheckCircle, 
  Award,
  Users,
  TrendingUp,
  X,
  Plus,
  Send,
  Building,
  DollarSign,
  UserCheck,
  Check,
  CheckSquare,
  FileText
} from 'lucide-react';
import { Opportunity, Course, Mentor, AppEmail } from '../types';
import { Language, TRANSLATIONS } from '../translations';

interface DashboardOverviewProps {
  opportunities: Opportunity[];
  courses: Course[];
  mentors: Mentor[];
  userSkills: string[];
  setActiveTab: (tab: string) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onRerouteToResume: (role: 'developer' | 'designer' | 'marketer', jobTitle?: string, company?: string) => void;
  onRerouteToMentor: (mentorId: string) => void;
  language: Language;
  userType?: 'jobseeker' | 'employer';
  companyName?: string;
  onPostNewOpportunity?: (newOpp: Opportunity) => void;
  onUpdateOpportunityStatus?: (id: string, status: Opportunity['status'], candidateName?: string, candidateEmail?: string) => void;
  emails?: AppEmail[];
}

export default function DashboardOverview({ 
  opportunities, 
  courses, 
  mentors, 
  userSkills, 
  setActiveTab,
  onSelectOpportunity,
  onRerouteToResume,
  onRerouteToMentor,
  language,
  userType = 'jobseeker',
  companyName = '',
  onPostNewOpportunity,
  onUpdateOpportunityStatus,
  emails = []
}: DashboardOverviewProps) {
  const t = TRANSLATIONS[language];
  const [selectedTimelineOpp, setSelectedTimelineOpp] = useState<Opportunity | null>(null);

  // New Candidate Feedback & Interview Screening States
  const [candidateFeedback, setCandidateFeedback] = useState<Record<string, { rating: number; notes: string }>>({});
  const [currentFeedbackNote, setCurrentFeedbackNote] = useState('');
  const [currentFeedbackRating, setCurrentFeedbackRating] = useState(5);
  const [showNotificationToast, setShowNotificationToast] = useState<string | null>(null);

  const handleSaveFeedback = (candidateId: string) => {
    setCandidateFeedback(prev => ({
      ...prev,
      [candidateId]: {
        rating: currentFeedbackRating,
        notes: currentFeedbackNote
      }
    }));
  };

  const handleDownloadPipelineCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Email,City,Target Role,Applied For,Skills Fit %,Dynamic Recruitment Status,Screening Grade,Employer Feedback Comments\n";

    initialMockApplicants.forEach((cand) => {
      const matchingOpp = opportunities.find(o => o.id === cand.oppId);
      const currentStatus = matchingOpp ? matchingOpp.status : 'Under Review';
      const fb = candidateFeedback[cand.id] || { rating: 5, notes: '' };
      
      const row = [
        `"${cand.name}"`,
        `"${cand.email}"`,
        `"${cand.city}"`,
        `"${cand.role}"`,
        `"${matchingOpp?.title || cand.oppName}"`,
        `${cand.matchPercent}%`,
        `"${currentStatus}"`,
        `"${fb.rating}/5"`,
        `"${fb.notes.replace(/"/g, '""')}"`
      ].join(",");

      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JOBRise_Recruitment_Pipeline_${companyName || 'Employer'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form states for posting a dynamic new job
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Douala');
  const [newType, setNewType] = useState<'Full-time' | 'Internship' | 'Apprenticeship' | 'Part-time'>('Full-time');
  const [newSector, setNewSector] = useState<'Tech & Dev' | 'UX/UI Design' | 'Marketing' | 'Business & Sales' | 'Finance'>('Tech & Dev');
  const [newSalary, setNewSalary] = useState('250,000 FCFA / month');
  const [newDesc, setNewDesc] = useState('');
  const [newSkillsRaw, setNewSkillsRaw] = useState('');
  const [newRequirementsRaw, setNewRequirementsRaw] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Candidate review detail view
  const [reviewingCandidate, setReviewingCandidate] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    city: string;
    skills: string[];
    matchPercent: number;
    oppId: string;
    oppName: string;
    coverSnippet: string;
  } | null>(null);

  // Auto-sync form states when switching candidates
  React.useEffect(() => {
    if (reviewingCandidate) {
      const fb = candidateFeedback[reviewingCandidate.id] || { rating: 5, notes: '' };
      setCurrentFeedbackNote(fb.notes);
      setCurrentFeedbackRating(fb.rating);
    }
  }, [reviewingCandidate]);

  // Quick Cameroon city references
  const cmrCities = ['Douala', 'Yaoundé', 'Buea', 'Limbe', 'Bafoussam', 'Garoua'];

  const getSectorMatchInfo = (sector: string) => {
    const normalized = sector.toLowerCase();
    if (normalized.includes('tech') || normalized.includes('dev')) {
      return {
        role: 'developer' as const,
        mentorId: 'mentor-1',
        mentorName: 'Devon Carter'
      };
    } else if (normalized.includes('ux') || normalized.includes('design')) {
      return {
        role: 'designer' as const,
        mentorId: 'mentor-2',
        mentorName: 'Mayra Lin'
      };
    } else if (normalized.includes('market') || normalized.includes('brand')) {
      return {
        role: 'marketer' as const,
        mentorId: 'mentor-3',
        mentorName: 'Kaleb Vance'
      };
    } else {
      return {
        role: 'developer' as const,
        mentorId: 'mentor-1',
        mentorName: 'Devon Carter'
      };
    }
  };

  // List of mock applicants for the employer's screening panel
  // Map some active state-based applicant records
  const initialMockApplicants = [
    {
      id: 'app-1',
      name: 'Alex Ndip',
      email: 'alex.ndip@siliconmountain.cm',
      role: 'Junior Frontend Developer',
      city: 'Buea',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
      matchPercent: 95,
      oppId: 'opp-1',
      oppName: 'Junior React Frontend Architect',
      coverSnippet: 'Highly motivated to build super-fast responsive interfaces. I trained extensively in Buea with the Silicon Mountain community and seek local startup leverage.'
    },
    {
      id: 'app-2',
      name: 'Ngo Bella',
      email: 'bella.designer@figmatracks.cm',
      role: 'UX/UI Designer',
      city: 'Douala',
      skills: ['Figma', 'Wireframing', 'Color Theory', 'Prototyping'],
      matchPercent: 90,
      oppId: 'opp-2',
      oppName: 'Product Design & Wireframing Intern',
      coverSnippet: 'Passionate about mobile interaction fidelity and responsive Cameroonian ecosystem service designs. Expert in high-end design layouts and user interviews.'
    },
    {
      id: 'app-3',
      name: 'Audrey Nkonda',
      email: 'audrey.nk@growthly.cm',
      role: 'SEO & Growth Marketer',
      city: 'Yaoundé',
      skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Copywriting'],
      matchPercent: 88,
      oppId: 'opp-3',
      oppName: 'Digital & Growth Marketing Specialist',
      coverSnippet: 'Expert in local SEO directories, English/French bilingual conversion campaigns, and budget-friendly customer acquisition indices for central Africa.'
    },
    {
      id: 'app-4',
      name: 'Frank Tchinda',
      email: 'frank.tchinda@analytica.cm',
      role: 'Business Analytics & Data Intern',
      city: 'Douala',
      skills: ['SQL', 'Tableau', 'Excel', 'Data Analysis'],
      matchPercent: 82,
      oppId: 'opp-4',
      oppName: 'CRM Operations Assistant',
      coverSnippet: 'Highly proficient in database schemas, sales analytics pipelines, and building clean dashboards that help directors locate cost improvements.'
    }
  ];

  // Handling submission of newly created job posted by Employer
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const skillsArray = newSkillsRaw.trim()
      ? newSkillsRaw.split(',').map(s => s.trim())
      : ['Productivity', 'Self-discipline'];
    
    const requirementsArray = newRequirementsRaw.trim()
      ? newRequirementsRaw.split(',').map(req => req.trim())
      : ['Enthusiastic attitude', 'Team player'];

    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newTitle.trim(),
      company: companyName || 'My Startup Studio',
      logoColor: 'from-emerald-500 to-indigo-600',
      location: `${newLocation}, Cameroon`,
      type: newType,
      sector: newSector,
      salary: newSalary,
      description: newDesc.trim() || 'Exciting and premium training launchpad opportunity with direct national mentoring, based in the Cameroon economic territory.',
      requirements: requirementsArray,
      skillsRequired: skillsArray,
      datePosted: 'Just Now',
      status: 'Not Applied'
    };

    if (onPostNewOpportunity) {
      onPostNewOpportunity(newOpportunity);
    }
    
    setPostSuccess(true);
    setNewTitle('');
    setNewDesc('');
    setNewSkillsRaw('');
    setNewRequirementsRaw('');
    setTimeout(() => setPostSuccess(false), 4500);
  };

  // Check if current user is an employer
  const isEmployerMode = userType === 'employer';

  if (isEmployerMode) {
    // Collect active openings posted by this employer
    const myPostings = opportunities.filter(o => o.company === companyName);
    
    // Total applications for screening (represented by opportunities with Applied/InReview/Interview status)
    const activeScreenedJobs = opportunities.filter(o => o.status !== 'Not Applied');

    return (
      <div id="employer-overview-root" className="space-y-8 animate-fade-in p-6 text-slate-800">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/40">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 select-none text-[150px] font-black uppercase text-slate-100 flex items-center justify-center font-sans tracking-tighter">
            PARTNER
          </div>
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="max-w-xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/35 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              JOBRise Enterprise Hub
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'fr' 
                ? `Bienvenue, ${companyName} ! Recrutez vos prochains talents.` 
                : `Partner Terminal: ${companyName}`}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {language === 'fr'
                ? 'Publiez de nouvelles opportunités de carrière, filtrez instantanément les compétences validées par nos quizz et faites passer des entretiens aux meilleurs profils du pays.'
                : 'Formulate new career options, filter instantly vetted talent with custom skills-hub levels, and invite Cameroonian candidates straight into live recruitment loops.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a 
                href="#post-job-form-anchor"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/25"
              >
                <Plus className="w-3.5" /> {language === 'fr' ? 'Publier une offre' : 'Post New Opening'}
              </a>
              <button 
                onClick={() => setActiveTab('opportunities')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                {language === 'fr' ? 'Parcourir la bourse publique' : 'Inspect Portal Directory'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-205 border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Our Openings</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{myPostings.length}</div>
            <div className="text-[9.5px] font-semibold text-indigo-600 mt-1">Live in National Feed</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-205 border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Incoming Submissions</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{activeScreenedJobs.length + 3}</div>
            <div className="text-[9.5px] font-semibold text-emerald-600 mt-1">Verified with Talent Quizzes</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-205 border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Skill Match</span>
            <div className="text-2xl font-black text-slate-800 mt-1">87%</div>
            <div className="text-[9.5px] font-semibold text-slate-450 text-slate-500 mt-1">Ready for immediate placement</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-205 border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Startup Trust tier</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">Tier 1</div>
            <div className="text-[9.5px] font-semibold text-emerald-600 mt-1">Verified Partner status</div>
          </div>
        </div>

        {/* Lower body Grid splits: Candidate Review and Job Creator Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Candidates screening section (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    {language === 'fr' ? 'Dossiers de Candidatures Reçus' : 'Vetted Candidates Pipeline'}
                  </h3>
                  <p className="text-xs text-slate-400">{language === 'fr' ? 'Sélectionnez un profil pour évaluer son CV et valider son statut' : 'Screen student profiles and change their live pipeline status'}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadPipelineCSV}
                    className="bg-indigo-50 text-indigo-800 font-extrabold text-[10.5px] px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Export pipeline data"
                  >
                    <span>Export Report (CSV)</span>
                  </button>
                  <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-25 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    {language === 'fr' ? 'À traiter' : 'Active Pipeline'}
                  </span>
                </div>
              </div>

              {/* Main pipeline table listing applicants */}
              <div className="space-y-3.5">
                {initialMockApplicants.map((cand) => {
                  // Find current live state corresponding to this candidate opportunity ID
                  const matchingOppInState = opportunities.find(o => o.id === cand.oppId);
                  const currentStatusInState = matchingOppInState ? matchingOppInState.status : 'Under Review';

                  return (
                    <div 
                      key={cand.id}
                      onClick={() => setReviewingCandidate(cand)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        reviewingCandidate?.id === cand.id 
                          ? 'bg-indigo-55/40 bg-indigo-50/20 border-indigo-400 shadow-sm shadow-indigo-100' 
                          : 'bg-slate-50 hover:bg-slate-50/75 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-600 font-bold text-white flex items-center justify-center text-xs uppercase shadow-sm">
                          {cand.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-800">{cand.name}</h4>
                            <span className="text-[9.5px] bg-slate-200/80 text-slate-650 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                              {cand.city}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{cand.role}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Applied For: <span className="text-slate-600 italic font-medium">{matchingOppInState?.title || cand.oppName}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0">
                        {/* Match Percent visual circle */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-extrabold text-emerald-600">{cand.matchPercent}%</span>
                          <span className="text-[8px] text-slate-400 tracking-wider">skills fit</span>
                        </div>

                        {/* Current dynamic validation status badge */}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          currentStatusInState === 'Selected' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                          currentStatusInState === 'Interview' ? 'bg-violet-50 text-violet-800 border border-violet-100' :
                          currentStatusInState === 'Declined' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                          'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}>
                          {currentStatusInState === 'Interview' ? 'Interview Slotted' : currentStatusInState}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Candidate Modal Slider */}
              {reviewingCandidate && (
                <div className="mt-6 p-5 bg-slate-50 border border-indigo-150 border-indigo-100 rounded-2xl relative animate-fade-in space-y-4">
                  <button 
                    onClick={() => setReviewingCandidate(null)}
                    className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center font-bold text-white text-sm">
                      {reviewingCandidate.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{reviewingCandidate.name}</h4>
                      <p className="text-xs text-slate-400">{reviewingCandidate.email} • {reviewingCandidate.city}, Cameroon</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {reviewingCandidate.skills.map((sk, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <h5 className="text-[10.5px] uppercase font-extrabold text-slate-450 text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      Candidate Introduction Letter
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{reviewingCandidate.coverSnippet}"
                    </p>
                  </div>

                  {/* New Vetting Note & Scorecard Block */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-150 border-indigo-100 space-y-3">
                    <h5 className="text-[10.5px] uppercase font-extrabold text-indigo-900 tracking-wider flex items-center gap-1.5 font-mono">
                      ★ Recruiter Vetting & Scorecard
                    </h5>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-medium">Candidate Grade (1 to 5):</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setCurrentFeedbackRating(star)}
                            className="text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                            title={`Star ${star}`}
                          >
                            <svg className={`w-4.5 h-4.5 ${currentFeedbackRating >= star ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={currentFeedbackNote}
                      onChange={(e) => setCurrentFeedbackNote(e.target.value)}
                      placeholder="Type brief screening notes or core interview observations here..."
                      rows={2}
                      className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-text"
                    ></textarea>

                    <button
                      onClick={() => handleSaveFeedback(reviewingCandidate.id)}
                      className="text-[10px] bg-indigo-600 text-white hover:bg-indigo-700 font-extrabold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Save Vetting Details
                    </button>
                  </div>

                  {/* Operational recruiting buttons */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Actions for {reviewingCandidate.name}:</p>
                    
                    {showNotificationToast && (
                      <div className="p-2 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2 text-[10.5px] font-bold text-emerald-800 animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>✉ {showNotificationToast}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          if (onUpdateOpportunityStatus) {
                            onUpdateOpportunityStatus(
                              reviewingCandidate.oppId, 
                              'Interview', 
                              reviewingCandidate.name, 
                              reviewingCandidate.email
                            );
                            setShowNotificationToast(`Simulated Interview Invite sent to ${reviewingCandidate.name}! check the mail center envelope at the top!`);
                            setTimeout(() => setShowNotificationToast(null), 5000);
                          }
                        }}
                        className="bg-violet-650 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5" /> {language === 'fr' ? 'Inviter à l’entretien' : 'Invite to Interview'}
                      </button>

                      <button
                        onClick={() => {
                          if (onUpdateOpportunityStatus) {
                            onUpdateOpportunityStatus(
                              reviewingCandidate.oppId, 
                              'Selected', 
                              reviewingCandidate.name, 
                              reviewingCandidate.email
                            );
                            setShowNotificationToast(`Simulated Hiring Offer sent to ${reviewingCandidate.name}! Check the mail center envelope at the top!`);
                            setTimeout(() => setShowNotificationToast(null), 5000);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5" /> {language === 'fr' ? 'Retenir pour Embauche 🎉' : 'Approve & HIRE Candidate 🎉'}
                      </button>

                      <button
                        onClick={() => {
                          if (onUpdateOpportunityStatus) {
                            onUpdateOpportunityStatus(reviewingCandidate.oppId, 'Declined');
                          }
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-all"
                      >
                        {language === 'fr' ? 'Placer en réserve' : 'Decline / Reserve'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Cameroonian Startups Advice block */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex items-start gap-3.5">
              <Compass className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0 animate-spin-slow" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">National Talent Sourcing Directives</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  JOBRise ensures strict adherence to Cameroon territory recruitment policies. By matching candidate quiz scores, recruiters decrease placement timelines as well as guarantee that the hires hold verified competencies matching the Ministry of Youth digital specifications.
                </p>
              </div>
            </div>

            {/* Simulation Outbox Feed inside Employer Dashboard */}
            <div className="bg-white p-5 rounded-2xl border border-slate-205 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>📧</span> {language === 'fr' ? 'Alertes de Recrutement Envoyées (Simulé)' : 'Simulated Email Notification Outbox'}
                  </h4>
                </div>
                <span className="text-[10px] bg-slate-100 font-mono text-slate-550 text-slate-500 font-bold px-2 py-0.5 rounded">
                  Status: ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                JOBRise automatically simulates standard SMTP email triggers when an application pipeline changes to <span className="bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-extrabold text-[10px]">Interview</span> or <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold text-[10px]">Selected</span>.
              </p>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {emails.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No email alerts simulated yet. Use the vetting actions above to trigger one!</p>
                ) : (
                  emails.map((mail) => (
                    <div key={mail.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-left animate-fade-in">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-700">
                          To: <span className="text-indigo-600 font-bold underline">{mail.recipientName}</span> ({mail.recipientEmail})
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400 shrink-0">{mail.sentAt}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-800">{mail.subject}</div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed max-h-20 overflow-y-auto font-medium bg-white p-2 rounded border border-slate-150 whitespace-pre-line">{mail.body}</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md">
                          {mail.type}
                        </span>
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1 text-[10px]">
                          Delivered ✓ (SMTP Sim)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Job creator form (2 cols) */}
          <div id="post-job-form-anchor" className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  {language === 'fr' ? 'Publier un Poste' : 'Post New Job Opening'}
                </h3>
                <p className="text-xs text-slate-400">{language === 'fr' ? 'Ajoutez une offre immédiatement visible par les chercheurs d’emploi' : 'Formulate positions immediately visible in seekers directory'}</p>
              </div>

              {postSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-emerald-700 text-xs text-center font-bold animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckSquare className="w-4" />
                  <span>Job has been successfully generated & published in feed!</span>
                </div>
              )}

              <form onSubmit={handlePostSubmit} className="space-y-4">
                {/* Pos Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Job Position Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Mobile Systems Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2.5 px-3 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* City selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Location</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2 px-3 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {cmrCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Sector</label>
                    <select
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2 px-3 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Tech & Dev">Tech & Dev</option>
                      <option value="UX/UI Design">UX/UI Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business & Sales">Business & Sales</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Offer Contract</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2 px-3 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Salary Package</label>
                    <input
                      type="text"
                      placeholder="e.g. 350,000 FCFA"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2 px-3 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Comma Sep Skills */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Key Skills Required (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vue, Dart, Docker, REST APIs"
                    value={newSkillsRaw}
                    onChange={(e) => setNewSkillsRaw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2.5 px-3 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 text-slate-500">Description of Duties</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a short, elegant mission statement or requirements list..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 border-slate-200 py-2 px-3 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit & Publish Job Feed</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ELSE: Traditional and gorgeous Seeker/Candidate Overview View Mode
  const activeApplications = opportunities.filter(o => o.status !== 'Not Applied');

  // Logic to calculate match score for recommendations
  const matchOpportunities = opportunities
    .filter(o => o.status === 'Not Applied')
    .map(o => {
      const matchingSkills = o.skillsRequired.filter(s => userSkills.includes(s));
      const score = Math.round((matchingSkills.length / o.skillsRequired.length) * 100);
      return { ...o, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Get top 3 matching recommendations

  // Filter inline online mentors
  const onlineMentors = mentors.filter(m => m.online).slice(0, 2);

  // Generate a mock application timeline for selected position
  const getTimelineSteps = (opp: Opportunity) => {
    switch (opp.status) {
      case 'Selected':
        return [
          { title: 'Application Submitted', desc: 'Resumed reviewed by AI system', date: 'May 20, 2026', done: true },
          { title: 'Initial Screening', desc: 'Completed background quiz', date: 'May 23, 2026', done: true },
          { title: 'Technical & UX Review', desc: 'Met with Mentor team', date: 'May 26, 2026', done: true },
          { title: 'Offer Finalized 🎉', desc: 'Selected for immediate startup', date: 'May 29, 2026', done: true },
        ];
      case 'Interview':
        return [
          { title: 'Application Submitted', desc: 'Standard credentials registered', date: 'May 22, 2026', done: true },
          { title: 'Screening Passed', desc: 'Matched 85% skill benchmark', date: 'May 25, 2026', done: true },
          { title: 'Technical Interview', desc: 'Scheduled on Google Meet', date: 'June 3, 2026', done: false, active: true },
          { title: 'Decision Output', desc: 'Offer finalized following review', date: 'Pending', done: false },
        ];
      case 'Under Review':
        return [
          { title: 'Application Submitted', desc: 'Standard materials registered', date: 'May 28, 2026', done: true },
          { title: 'Under Review', desc: 'Recruiter review in progress', date: 'Current', done: true, active: true },
          { title: 'Interview Invitation', desc: 'Pending review criteria match', date: 'TBD', done: false },
          { title: 'Decision Output', desc: 'TBD', date: 'TBD', done: false },
        ];
      default:
        return [
          { title: 'No Applied History', desc: 'Select Apply on Opportunity Tab', date: 'TBD', done: false }
        ];
    }
  };

  return (
    <div id="dashboard-overview-root" className="space-y-8 animate-fade-in p-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-950/20">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 select-none text-[150px] font-black uppercase text-slate-100 flex items-center justify-center font-sans tracking-tighter">
          YOUTH
        </div>
        <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl"></div>
        
        <div className="max-w-xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/25 border border-indigo-500/35 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI Career Readiness Portal
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate your trajectory. Secure your breakthrough role.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Gain verified skill credentials, fine-tune your CV with professional AI-powered feedback, and instantly connect with top startups requesting your expertise.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => setActiveTab('opportunities')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
            >
              Explore Job Board <ArrowRight className="w-3.5" />
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
            >
              Test Your Skills
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Applications Tracker & Quick Action Hub */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Your Recent Opportunities / Applications Pipeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  {t.activeAppsHeader}
                </h3>
                <p className="text-xs text-slate-400">{language === 'fr' ? 'Suivez l’état d’avancement de vos dossiers' : 'Track and view specific recruitment step actions'}</p>
              </div>
              <button 
                onClick={() => setActiveTab('opportunities')}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 group animate-pulse"
              >
                {language === 'fr' ? 'Parcourir les offres' : 'View Job Board'} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {activeApplications.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-205 border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-semibold">No active applications yet.</p>
                <p className="text-xs text-slate-400 mt-1">Select an opportunity from our jobs directory and apply!</p>
                <button 
                  onClick={() => setActiveTab('opportunities')}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeApplications.map((opp) => (
                  <div 
                    key={opp.id} 
                    className="group bg-white hover:bg-slate-50/50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-indigo-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${opp.logoColor} flex items-center justify-center font-bold text-white text-xs shadow-inner`}>
                        {opp.company.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{opp.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span>{opp.company}</span> • <span className="flex items-center gap-1"><MapPin className="w-3" /> {opp.location}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3.5 sm:pt-0">
                      {/* Interactive Badge */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        opp.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        opp.status === 'Interview' ? 'bg-violet-50 text-violet-700 border border-violet-150' :
                        opp.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                        opp.status === 'Declined' ? 'bg-rose-50 text-rose-700 border border-rose-150' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {opp.status === 'Interview' ? 'Interview Scheduled' : opp.status}
                      </span>
                      
                      <button 
                        onClick={() => setSelectedTimelineOpp(selectedTimelineOpp?.id === opp.id ? null : opp)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                      >
                        {selectedTimelineOpp?.id === opp.id ? 'Hide Timeline' : 'Track Status'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Application Steps Timeline Drawer */}
            {selectedTimelineOpp && (
              <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 relative animate-fade-in">
                <button 
                  onClick={() => setSelectedTimelineOpp(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-950 mb-3.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
                  Live Timeline: {selectedTimelineOpp.title}
                </h4>
                
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                  {getTimelineSteps(selectedTimelineOpp).map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Bullet node */}
                      <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.done ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'
                      }`}>
                        {step.done ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        ) : step.active ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
                        ) : null}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${step.done ? 'text-slate-800' : 'text-slate-400'} ${step.active ? 'text-indigo-700 font-extrabold' : ''}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Cross-Tab Relation shortcuts */}
                <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-3">
                  <div className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                        {selectedTimelineOpp.status === 'Interview' 
                          ? 'Action Required: Interview Preparation' 
                          : 'Optimize your Pipeline Match Status'}
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                        {selectedTimelineOpp.status === 'Interview'
                          ? `Prepare for ${selectedTimelineOpp.company}! Launch an active mock interview simulator, or chat directly with specialized advisor ${getSectorMatchInfo(selectedTimelineOpp.sector).mentorName} regarding your upcoming interview details.`
                          : `Elevate your submission review metrics by matching candidate stack requirements like ${selectedTimelineOpp.skillsRequired.slice(0, 3).join(', ')} directly in the CV Optimizer.`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTimelineOpp.status === 'Interview' ? (
                      <>
                        <button 
                          onClick={() => onRerouteToMentor(getSectorMatchInfo(selectedTimelineOpp.sector).mentorId)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                        >
                          Chat with Advisor {getSectorMatchInfo(selectedTimelineOpp.sector).mentorName}
                        </button>
                        <button 
                          onClick={() => setActiveTab('mentor')}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                        >
                          Launch Mock Simulator
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => {
                          const matchInfo = getSectorMatchInfo(selectedTimelineOpp.sector);
                          onRerouteToResume(matchInfo.role, selectedTimelineOpp.title, selectedTimelineOpp.company);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                      >
                        Match CV Keywords (Optimize)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div 
              onClick={() => setActiveTab('skills')}
              className="bg-white hover:bg-slate-50/55 p-4 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Skills Hub Quiz</h4>
                <p className="text-[11px] text-slate-400 mt-1">Unlock certificates and claim immediate matching points.</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('resume')}
              className="bg-white hover:bg-slate-50/55 p-4 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Resume Scorecard</h4>
                <p className="text-[11px] text-slate-400 mt-1">Verify grammar density, optimize structural CV margins.</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('mentor')}
              className="bg-white hover:bg-slate-50/55 p-4 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Mentor Practice</h4>
                <p className="text-[11px] text-slate-400 mt-1">Conduct interactive behavioral rounds with online mentors.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Recommendations & Mentor Widgets */}
        <div id="right-dashboard-widgets" className="space-y-8">
          
          {/* Recommended Jobs Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-indigo-600" />
                  Recommended For You
                </h3>
                <p className="text-[11px] text-slate-400">Based on your certified skills hub path</p>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">
                Smart Match
              </span>
            </div>

            <div className="space-y-3">
              {matchOpportunities.map((opp) => (
                <div 
                  key={opp.id} 
                  id={`match-card-${opp.id}`}
                  onClick={() => onSelectOpportunity(opp)}
                  className="p-3 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-slate-100 cursor-pointer transition-all hover:border-indigo-100 flex items-center justify-between gap-3 group animate-fade-in"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${opp.logoColor} flex items-center justify-center font-bold text-white text-[10px] shrink-0`}>
                      {opp.company.substring(0, 2)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-indigo-600 transition-colors">{opp.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{opp.company} • {opp.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[11px] text-emerald-600 font-extrabold">{opp.matchScore}%</span>
                    <span className="text-[9px] text-slate-400">match</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActiveTab('opportunities')}
              className="mt-4 w-full bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-indigo-100 hover:border-indigo-200 text-center font-semibold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 group"
            >
              Browse All Jobs <ChevronRight className="w-3" />
            </button>
          </div>

          {/* Active Online Mentors Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-indigo-600" />
                  Mentor Match
                </h3>
                <p className="text-[11px] text-slate-400">Instant answers regarding career prep</p>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-3">
              {onlineMentors.map((mentor) => (
                <div 
                  key={mentor.id}
                  onClick={() => setActiveTab('mentor')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${mentor.color} flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-100`}>
                    {mentor.avatarSeed}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-indigo-600 transition-colors">{mentor.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{mentor.role} @ {mentor.company}</p>
                    <div className="flex gap-1.5 mt-1 overflow-hidden">
                      {mentor.specialties.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[8px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 truncate">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActiveTab('mentor')}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold text-xs py-2 rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
            >
              Start Practice Session <ChevronRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
