/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import OpportunitiesTab from './components/OpportunitiesTab';
import SkillsHubTab from './components/SkillsHubTab';
import ResumeCoachTab from './components/ResumeCoachTab';
import MentorCoachTab from './components/MentorCoachTab';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';

import { INITIAL_OPPORTUNITIES, INITIAL_COURSES, MENTORS } from './data';
import { Opportunity, Course, Application, AppEmail } from './types';
import { Language, TRANSLATIONS } from './translations';
import { Mail, Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export default function App() {
  // Navigation & Session
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Landing page auth modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialType, setAuthInitialType] = useState<'jobseeker' | 'employer'>('jobseeker');

  // Track certifications list separately
  const [certificationsList, setCertificationsList] = useState<string[]>([]);

  // Bridge States to Route pages together
  const [resumePrefilledRole, setResumePrefilledRole] = useState<'developer' | 'designer' | 'marketer' | null>(null);
  const [resumePrefilledText, setResumePrefilledText] = useState<string>('');
  const [mentorPrefilledId, setMentorPrefilledId] = useState<string | null>(null);

  // Core synchronized application state
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // Mock delivery alerts state
  const [emails, setEmails] = useState<AppEmail[]>([]);

  // Interactive Live Toast System states
  const [toasts, setToasts] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: 'Interview' | 'Selected' | 'notify';
  }>>([]);

  const handleAddToast = (title: string, message: string, type: 'Interview' | 'Selected' | 'notify') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto remove after 5500ms
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  };

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSendSimulatedEmail = (recipientName: string, recipientEmail: string, jobTitle: string, type: 'Interview' | 'Selected') => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMail: AppEmail = {
      id: `mail-${Date.now()}`,
      recipientName,
      recipientEmail,
      subject: type === 'Interview'
        ? `🚨 Shortlist Confirmation: ${jobTitle} Interview Stage`
        : `🎉 Congratulatory Offer! Selected for ${jobTitle}`,
      body: type === 'Interview'
        ? `Dear ${recipientName},\n\nFantastic news! Your profile and credentials check out perfectly. The recruiting team has shortlisted your application for the role of "${jobTitle}" and initiated the Interview status.\n\nStep 1: practice typical interview scenarios in the "Mentor Coach Tab" inside your JOBRise candidate panel.\nStep 2: complete any outstanding technical quizzes to demonstrate local territory policy compliance.\n\nWarm regards,\nJOBRise Portal / Sourcing Dept.`
        : `Dear ${recipientName},\n\nWe have completed our evaluation of your portfolio and are ecstatic to inform you that you have been SELECTED for the position of "${jobTitle}"!\n\nAn official employment proposal is being compiled. You will receive secondary instructions via your profile coordinates shortly to align contract sign-offs.\n\nCongratulations!\nJOBRise Recruiting Hub`,
      sentAt: formattedTime,
      status: 'Delivered',
      jobTitle,
      type
    };
    setEmails(prev => [newMail, ...prev]);

    // Dispatch beautiful status/delivery toast
    const titleText = type === 'Interview' ? '📅 Interview Shortlist Invitation' : '🎉 Career Selection Confirmed';
    const bodySnippet = `${recipientName} has been notified via email alert for "${jobTitle}". Review the Simulated Mailbox!`;
    handleAddToast(titleText, bodySnippet, type);
  };
  
  // User Profile Credentials (starts empty)
  const [userStats, setUserStats] = useState({
    name: '',
    role: '',
    points: 0,
    level: 1,
    certifiedCount: 0,
    skills: [] as string[],
    email: '',
    userType: 'jobseeker' as 'jobseeker' | 'employer',
    companyName: ''
  });

  const handleLogin = (profile: { 
    name: string; 
    role: string; 
    location: string; 
    skills: string[];
    email: string;
    userType: 'jobseeker' | 'employer';
    companyName?: string;
  }) => {
    setUserStats({
      name: profile.name,
      role: profile.role,
      points: profile.userType === 'employer' ? 100 : 20, // Initial bonus
      level: 1,
      certifiedCount: 0,
      skills: profile.skills,
      email: profile.email,
      userType: profile.userType,
      companyName: profile.companyName || ''
    });
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserStats({
      name: '',
      role: '',
      points: 0,
      level: 1,
      certifiedCount: 0,
      skills: [],
      email: '',
      userType: 'jobseeker',
      companyName: ''
    });
    setCertificationsList([]);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setCourses(INITIAL_COURSES);
  };

  // Rerouting hand-offs
  const handleRerouteToResume = (role: 'developer' | 'designer' | 'marketer', jobTitle?: string, company?: string) => {
    setResumePrefilledRole(role);
    if (jobTitle && company) {
      setResumePrefilledText(`Jane Doe\nJunior Specialist seeking a role at ${company} as a ${jobTitle}.\n\nCore Competencies:\n- High performance execution\n- Continuous skill upgrades\n- Fast loading times and responsive design templates\n`);
    } else {
      setResumePrefilledText('');
    }
    setActiveTab('resume');
  };

  const handleRerouteToMentor = (mentorId: string) => {
    setMentorPrefilledId(mentorId);
    setActiveTab('mentor');
  };
  
  // State for actively selected opportunity in full detail panel
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Update profile handler (name and desired sector)
  const handleUpdateName = (newName: string, newRole: string) => {
    setUserStats(prev => ({
      ...prev,
      name: newName,
      role: newRole
    }));
  };

  // Add Certification handler
  const handleAddCertification = (certName: string) => {
    if (certificationsList.includes(certName)) return;
    const newList = [...certificationsList, certName];
    setCertificationsList(newList);
    setUserStats(prev => ({
      ...prev,
      points: prev.points + 100, // Large milestone bonus!
      level: Math.floor((prev.points + 100) / 100) + 1,
      certifiedCount: newList.length
    }));
  };

  // Award career points (XP) helper
  const handleAwardXP = (amount: number) => {
    setUserStats(prev => {
      const nextPoints = prev.points + amount;
      const nextLevel = Math.floor(nextPoints / 100) + 1;
      return {
        ...prev,
        points: nextPoints,
        level: nextLevel
      };
    });
  };

  // Complete specific curriculum course
  const handleCompleteCourse = (courseId: string, skillsUnlocked: string[]) => {
    // Prevent duplicate completes
    const targetedCourse = courses.find(c => c.id === courseId);
    if (!targetedCourse || targetedCourse.completed) return;

    // Update course status list
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, progress: 100, completed: true };
      }
      return c;
    }));

    // Unlock new skills for user and grant points!
    const updatedSkills = Array.from(new Set([...userStats.skills, ...skillsUnlocked]));
    setUserStats(prev => {
      const nextPoints = prev.points + 45;
      return {
        ...prev,
        skills: updatedSkills,
        points: nextPoints,
        level: Math.floor(nextPoints / 100) + 1
      };
    });
  };

  // Job Application submission tracker
  const handleApplyToJob = (opportunityId: string, coverLetter: string, portfolio: string) => {
    let currentOppTitle = 'Role';
    // Toggle internal job status in opportunities array
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === opportunityId) {
        currentOppTitle = opp.title;
        return { ...opp, status: 'Under Review' }; // Updates status instantly!
      }
      return opp;
    }));

    // Adjust selectedOpportunity side references
    if (selectedOpportunity && selectedOpportunity.id === opportunityId) {
      setSelectedOpportunity(prev => prev ? { ...prev, status: 'Under Review' } : null);
    }

    // Award XP
    handleAwardXP(35);

    // Toast alert for application submission
    handleAddToast(
      '🚀 Application Transmitted',
      `Your application for "${currentOppTitle}" has been added to the recruiter review stream!`,
      'notify'
    );
  };

  // Recruiter: Post dynamic new opportunity
  const handlePostNewOpportunity = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
    handleAwardXP(50); // Recruiters earn engagement points too!
  };

  // Recruiter: Update state of student applications
  const handleUpdateOpportunityStatus = (id: string, status: Opportunity['status'], candidateName?: string, candidateEmail?: string) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === id) {
        if (candidateName && candidateEmail && (status === 'Interview' || status === 'Selected')) {
          handleSendSimulatedEmail(candidateName, candidateEmail, opp.title, status);
        } else {
          // Toast for other candidate updates
          const namePart = candidateName || 'Candidate';
          handleAddToast(
            `Status Updated: ${status}`,
            `${namePart}'s application status for "${opp.title}" has been updated to "${status}".`,
            'notify'
          );
        }
        return { ...opp, status };
      }
      return opp;
    }));
  };

  // Quick select helper from Dashboard Recommendations
  const handleSelectRecommendation = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setActiveTab('opportunities');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage
          onStart={(userType) => {
            setAuthInitialType(userType);
            setAuthModalOpen(true);
          }}
          language={language}
          onLanguageChange={setLanguage}
        />
        <AuthModal
          open={authModalOpen}
          initialUserType={authInitialType}
          onClose={() => setAuthModalOpen(false)}
          onLogin={(profile) => {
            setAuthModalOpen(false);
            handleLogin(profile);
          }}
          language={language}
        />
      </>
    );
  }

  return (
    <div id="unified-app-viewport" className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* Sleek Vertical Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language}
        userStats={{
          name: userStats.name,
          role: userStats.role,
          certifiedCount: certificationsList.length,
          points: userStats.points,
          level: userStats.level,
          userType: userStats.userType
        }} 
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Panel Frame */}
      <div id="main-content-scroller" className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Persistent Dynamic Header Area */}
        <Header 
          userStats={userStats} 
          onUpdateName={handleUpdateName} 
          opportunities={opportunities} 
          courses={courses} 
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
          emails={emails}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Navigated Content Tab */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto md:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="h-full"
            >
              {activeTab === 'dashboard' ? (
                <DashboardOverview 
                  opportunities={opportunities} 
                  courses={courses}
                  mentors={MENTORS}
                  userSkills={userStats.skills}
                  setActiveTab={setActiveTab}
                  onSelectOpportunity={handleSelectRecommendation}
                  onRerouteToResume={handleRerouteToResume}
                  onRerouteToMentor={handleRerouteToMentor}
                  language={language}
                  userType={userStats.userType}
                  companyName={userStats.companyName}
                  onPostNewOpportunity={handlePostNewOpportunity}
                  onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
                  emails={emails}
                />
              ) : null}

              {activeTab === 'opportunities' && (
                <OpportunitiesTab 
                  opportunities={opportunities}
                  courses={courses}
                  onApply={handleApplyToJob}
                  selectedOpportunity={selectedOpportunity}
                  setSelectedOpportunity={setSelectedOpportunity}
                  onRerouteToResume={handleRerouteToResume}
                  onRerouteToMentor={handleRerouteToMentor}
                  language={language}
                />
              )}

              {activeTab === 'skills' && (
                <SkillsHubTab 
                  courses={courses}
                  userStats={userStats}
                  onCompleteCourse={handleCompleteCourse}
                  onAddCertification={handleAddCertification}
                  certificationsList={certificationsList}
                  language={language}
                />
              )}

              {activeTab === 'resume' && (
                <ResumeCoachTab 
                  prefilledRole={resumePrefilledRole}
                  prefilledText={resumePrefilledText}
                  onClearPrefills={() => {
                    setResumePrefilledRole(null);
                    setResumePrefilledText('');
                  }}
                  language={language}
                />
              )}

              {activeTab === 'mentor' && (
                <MentorCoachTab 
                  onAwardXP={handleAwardXP} 
                  prefilledMentorId={mentorPrefilledId}
                  onClearPrefilledMentor={() => setMentorPrefilledId(null)}
                  language={language}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
      
      {/* Subtle Interactive Toast Notification System Portal */}
      <div id="live-toast-notification-stream" className="fixed bottom-6 right-6 z-100 flex flex-col gap-3.5 w-full max-w-[390px] px-6 sm:px-0 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const isInterview = toast.type === 'Interview';
            const isSelected = toast.type === 'Selected';
            
            // Icon assignment based on type
            let IconComp = Info;
            let themeClass = 'bg-white border-slate-200 text-slate-800 border-l-sky-500 shadow-xl';
            let iconBgClass = 'bg-sky-50 text-sky-600';
            
            if (isInterview) {
              IconComp = Mail;
              themeClass = 'bg-white border-slate-200 text-slate-800 border-l-indigo-600 shadow-xl';
              iconBgClass = 'bg-indigo-50 text-indigo-600';
            } else if (isSelected) {
              IconComp = CheckCircle2;
              themeClass = 'bg-white border-slate-200 text-slate-800 border-l-emerald-500 shadow-xl';
              iconBgClass = 'bg-emerald-50 text-emerald-650 text-emerald-600';
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className={`pointer-events-auto border border-slate-100 border-l-4 p-4 rounded-xl flex gap-3.5 items-start justify-between relative overflow-hidden transition-all ${themeClass}`}
                role="alert"
              >
                {/* Background ambient glowing gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-50/10 pointer-events-none" />

                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${iconBgClass}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[12.5px] leading-tight text-slate-800 flex items-center gap-1.5">
                      {toast.title}
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />}
                    </h5>
                    <p className="text-[11px] font-medium text-slate-500 leading-normal mt-1 pr-4 whitespace-normal">
                      {toast.message}
                    </p>
                    
                    {/* Simulated e-mail badge action helper */}
                    {(isInterview || isSelected) && (
                      <div className="mt-2 text-[9.5px]">
                        <span className="font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded cursor-pointer select-none inline-block border border-indigo-100 transition-colors" title="Simulated SMTP Outbox delivered">
                          📧 SMTP Mail Delivered
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual close/dismiss button */}
                <button
                  onClick={() => handleRemoveToast(toast.id)}
                  className="text-slate-400 hover:text-slate-650 hover:text-slate-600 rounded-lg p-0.5 hover:bg-slate-50 shrink-0 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
