/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Search, 
  CheckCircle, 
  Briefcase, 
  BookOpen, 
  Trophy,
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';
import { Opportunity, Course, AppEmail } from '../types';
import { Language, TRANSLATIONS } from '../translations';

interface HeaderProps {
  userStats: {
    name: string;
    role: string;
    points: number;
    level: number;
    userType?: 'jobseeker' | 'employer';
    companyName?: string;
    email?: string;
  };
  onUpdateName: (newName: string, newRole: string) => void;
  opportunities: Opportunity[];
  courses: Course[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout?: () => void;
  emails: AppEmail[];
  onToggleSidebar?: () => void;
}

export default function Header({ 
  userStats, 
  onUpdateName, 
  opportunities, 
  courses,
  language,
  onLanguageChange,
  onLogout,
  emails = [],
  onToggleSidebar
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userStats.name);
  const [editRole, setEditRole] = useState(userStats.role);
  const [showInbox, setShowInbox] = useState(false);
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const isEmployer = userStats.userType === 'employer';
  const myPostingsCount = opportunities.filter(o => o.company === userStats.companyName).length;

  const appliedCount = isEmployer ? myPostingsCount : opportunities.filter(o => o.status !== 'Not Applied').length;
  const interviewCount = opportunities.filter(o => o.status === 'Interview').length;
  const completedCoursesCount = isEmployer ? (opportunities.filter(o => o.status !== 'Not Applied').length + 3) : courses.filter(c => c.completed).length;

  const handleSave = () => {
    if (editName.trim() && editRole.trim()) {
      onUpdateName(editName, editRole);
      setIsEditing(false);
    }
  };

  return (
    <header id="dash-header" className="bg-white border-b border-slate-200 min-h-20 py-4 px-4 sm:px-8 sticky top-0 z-45 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between shrink-0">
      <div id="header-welcome-identity" className="flex items-center gap-3 sm:gap-4 select-none">
        {/* Mobile hamburger menu */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-lg lg:hidden shrink-0 cursor-pointer transition-colors"
          title="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-lg shadow-inner shrink-0">
          🚀
        </div>
        <div>
          {isEditing ? (
            <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm max-w-sm mt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-2 py-1 text-xs border rounded-md focus:outline-indigo-600 bg-white"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="px-2 py-1 text-xs border rounded-md focus:outline-indigo-600 bg-white"
                  placeholder="Desired Role"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  {t.cancelBtn}
                </button>
                <button 
                  onClick={handleSave}
                  className="text-[11px] bg-indigo-600 text-white font-semibold rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-indigo-700"
                >
                  <Check className="w-3" /> {t.saveBtn}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1">
                  {t.welcomeBack} <span className="text-indigo-600">{userStats.name}</span>
                </h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Edit Profile Name & Role"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                {t.trackingPathFor} <strong className="text-slate-700 font-semibold">{userStats.role}</strong>
              </p>
            </div>
          )}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{t.todayIs}: {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Network Regulator Badge & Billing Toggle */}
      <div id="localized-network-indicator" className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-1.5 rounded-xl text-xs self-start lg:self-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-100/60 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>🇨🇲 {t.localAccredited}</span>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shrink-0 shadow-2xs">
          <button 
            onClick={() => onLanguageChange('en')} 
            className={`px-2 py-0.5 rounded font-extrabold text-[10px] cursor-pointer transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            EN
          </button>
          <button 
            onClick={() => onLanguageChange('fr')} 
            className={`px-2 py-0.5 rounded font-extrabold text-[10px] cursor-pointer transition-all ${language === 'fr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            FR
          </button>
        </div>

        {/* Dynamic Interactive Email Notification Bell */}
        <div id="bell-notification-hub" className="relative shrink-0">
          <button 
            onClick={() => setShowInbox(!showInbox)}
            className={`p-1 flex items-center justify-center relative cursor-pointer rounded-lg transition-all ${
              showInbox 
                ? 'bg-indigo-650 bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-250 border-slate-150'
            }`}
            title={language === 'fr' ? 'Alertes email simulées' : 'Simulated email notifications'}
          >
            <span className="p-0.5"><Bell className="w-3.5 h-3.5" /></span>
            {emails.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse"></span>
            )}
          </button>

          {showInbox && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-left font-sans animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-850 text-slate-805 text-slate-800 uppercase tracking-wider">Simulated Mail Center</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded-md font-mono">
                    {emails.length} Logged
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setShowInbox(false);
                    setSelectedMailId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              {selectedMailId ? (
                // Full view of selected email
                (() => {
                  const mail = emails.find(m => m.id === selectedMailId);
                  if (!mail) return null;
                  return (
                    <div className="space-y-3.5 text-xs">
                      <button 
                        onClick={() => setSelectedMailId(null)}
                        className="text-indigo-600 hover:text-indigo-800 font-extrabold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        ← Back to outbox list
                      </button>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5 text-[11px]">
                        <div>
                          <strong className="text-slate-400 uppercase font-mono text-[9px] block">Sender</strong>
                          <span className="font-semibold text-slate-700">recruitment@jobrise.cm (JOBRise Sourcing)</span>
                        </div>
                        <div>
                          <strong className="text-slate-400 uppercase font-mono text-[9px] block">To (Recipient)</strong>
                          <span className="font-semibold text-slate-700">{mail.recipientName} &lt;{mail.recipientEmail}&gt;</span>
                        </div>
                        <div>
                          <strong className="text-slate-400 uppercase font-mono text-[9px] block">Subject</strong>
                          <span className="font-bold text-slate-800">{mail.subject}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-450 text-slate-400 font-mono text-[9px]">{mail.sentAt}</span>
                          <span className="text-emerald-600 font-extrabold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-250 border-emerald-200">
                             ● DELIVERED SMTP
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-3 border border-slate-150 rounded-xl max-h-56 overflow-y-auto whitespace-pre-line text-slate-600 font-semibold leading-relaxed">
                        {mail.body}
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Email alerts list
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {emails.length === 0 ? (
                    <div className="text-center py-8 px-2">
                      <p className="text-xs text-slate-400 font-medium">No automated email alerts dispatched yet.</p>
                      <p className="text-[10px] text-indigo-500 mt-2 leading-normal">
                        {userStats.userType === 'employer' 
                          ? 'Trigger an email alert by updating an applicant\'s pipeline status to "Interview" or "Selected" in the dashboard below!' 
                          : 'As a student, you will receive emails when a recruiter processes your application!'}
                      </p>
                    </div>
                  ) : (
                    emails.map((mail) => (
                      <div 
                        key={mail.id}
                        onClick={() => setSelectedMailId(mail.id)}
                        className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 cursor-pointer transition-all space-y-1 text-left"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-850 text-slate-800 text-[11px] truncate max-w-[155px]">
                            To: {mail.recipientName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">{mail.sentAt}</span>
                        </div>
                        <p className="font-bold text-slate-700 text-[10.5px] truncate">{mail.subject}</p>
                        <p className="text-[10px] text-slate-400 truncate leading-normal">{mail.body.substring(0, 60).replace(/\n/g, ' ')}...</p>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-md font-mono">
                            {mail.type}
                          </span>
                          <span className="text-[9px] text-emerald-500 font-extrabold">Delivered ✓</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-2.5 py-1 bg-red-55 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-lg transition-colors cursor-pointer border border-red-100/80 shadow-2xs"
            title={t.logoutBtn}
          >
            {t.logoutBtn}
          </button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div id="header-kpis-wrapper" className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-50 p-2 px-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
              {isEmployer ? (language === 'fr' ? 'Nos Offres' : 'Our Openings') : t.appliedCountLabel}
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {appliedCount} {isEmployer ? (language === 'fr' ? 'postes' : 'positions') : t.opportunitiesMetric}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-50 p-2 px-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-650 text-violet-600 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
              {isEmployer ? (language === 'fr' ? 'Entretiens' : 'Interviews Set') : t.interviewsLabel}
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {interviewCount} {isEmployer ? (language === 'fr' ? 'sessions' : 'slots') : t.interviewsMetric}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-50 p-2 px-3.5 rounded-xl border border-slate-205 border-slate-200 shadow-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
              {isEmployer ? (language === 'fr' ? 'Talents Reçus' : 'Vetted Pool') : t.studyBriefsLabel}
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {completedCoursesCount} {isEmployer ? (language === 'fr' ? 'profils' : 'seekers') : t.studyMetric}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-50 p-2 px-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
              {isEmployer ? (language === 'fr' ? 'Rang Partenaire' : 'Partner Tier') : t.profileLevelLabel}
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {isEmployer ? 'Tier 1 Prime' : `${t.level} ${userStats.level} ${t.profileMetric}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
