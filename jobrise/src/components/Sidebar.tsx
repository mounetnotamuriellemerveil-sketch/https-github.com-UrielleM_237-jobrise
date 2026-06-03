/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Users, 
  Settings, 
  Sparkles,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  userStats: {
    name: string;
    role: string;
    certifiedCount: number;
    points: number;
    level: number;
    userType?: 'jobseeker' | 'employer';
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  language, 
  userStats,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const t = TRANSLATIONS[language];

  const isEmployer = userStats.userType === 'employer';

  const menuItems = isEmployer ? [
    { id: 'dashboard', label: language === 'fr' ? 'Console Recruteur' : 'Employer Console', icon: LayoutDashboard },
    { id: 'opportunities', label: language === 'fr' ? 'Publier / Gérer' : 'Hiring Postings', icon: Briefcase, badge: 'New' },
  ] : [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'opportunities', label: t.opportunities, icon: Briefcase, badge: '8' },
    { id: 'skills', label: t.skillsHub, icon: GraduationCap, badge: userStats.certifiedCount > 0 ? (language === 'fr' ? 'Certifié' : 'Certified') : 'Quiz' },
    { id: 'resume', label: t.resumeCoach, icon: FileText },
    { id: 'mentor', label: t.mentorCoach, icon: Users, highlight: true },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-49 lg:hidden transition-opacity cursor-pointer duration-300"
        />
      )}

      <aside 
        id="sidebar-container" 
        className={`bg-white border-r border-slate-200 flex flex-col justify-between py-8 px-6 shrink-0 h-screen transition-all duration-300 z-50
          ${isMobileOpen 
            ? 'fixed inset-y-0 left-0 w-64 translate-x-0 shadow-2xl' 
            : 'hidden lg:flex lg:w-64 lg:sticky lg:top-0'
          }
        `}
      >
        <div id="sidebar-upper-section" className="flex flex-col">
          {/* Platform Brand */}
          <div 
            id="brand-header" 
            className="flex items-center gap-3 mb-8 px-2 cursor-pointer group" 
            onClick={() => {
              setActiveTab('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-800 block">Opportunity</span>
              <span className="text-[9px] font-extrabold text-emerald-600 tracking-wider uppercase block">{t.localEcosystemBadge}</span>
            </div>
          </div>

          {/* User Card with unified look */}
          <div id="user-badge-card" className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm border border-indigo-200 uppercase">
                {userStats.name.substring(0, 2)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] text-white font-bold" title="XP Level">
                {userStats.level}
              </div>
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="font-bold text-slate-800 text-xs truncate leading-normal">{userStats.name}</h4>
              <span className="text-[10px] text-slate-500 block truncate leading-tight">{userStats.role}</span>
            </div>
          </div>

          {/* Navigation Section */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Navigation</p>
          <nav id="nav-list" className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    isActive
                      ? 'bg-indigo-55 bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg'
                  }`}
                >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${
                    isActive ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <div className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div id="sidebar-lower-section" className="space-y-4">
        {/* Interactive Stats Banner */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
            {isEmployer ? (
              <div className="w-full">
                <p className="text-[11px] font-bold text-slate-800">{language === 'fr' ? 'Évaluation Recruteur' : 'Partner Trust Score'}</p>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-1 rounded-full w-[95%]"></div>
                </div>
                <div className="flex justify-between items-center mt-1 text-[9px] text-slate-400">
                  <span>95% Trust Index</span>
                  <span className="text-emerald-600 font-semibold">{language === 'fr' ? 'Vérifié' : 'Vetted'}</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-bold text-slate-800">{t.level} {userStats.level} Ascent</p>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${(userStats.points % 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1 text-[9px] text-slate-400">
                  <span>{(userStats.points % 100)} / 100 XP</span>
                  <span className="text-indigo-650 text-indigo-605 text-indigo-600 font-semibold">{userStats.certifiedCount} {language === 'fr' ? 'certifs' : 'certs'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Upgrade Spot widget */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">{t.upgradeTitle}</p>
            <p className="text-xs mb-4 leading-relaxed text-slate-300">{t.upgradeDesc}</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white">{t.upgradeBtn}</button>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full -mr-10 -mt-10"></div>
        </div>

        {/* Legal Credits */}
        <p className="text-[9px] text-slate-400 text-center uppercase tracking-widest leading-relaxed">
          {t.legalCredits} © 2026
        </p>
      </div>
    </aside>
  </>
);
}
