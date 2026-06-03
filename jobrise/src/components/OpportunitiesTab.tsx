/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  ChevronRight, 
  X, 
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  ChevronDown
} from 'lucide-react';
import { Opportunity, Course } from '../types';
import { Language, TRANSLATIONS } from '../translations';

interface OpportunitiesTabProps {
  opportunities: Opportunity[];
  courses: Course[];
  onApply: (opportunityId: string, coverLetter: string, portfolio: string) => void;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  onRerouteToResume: (role: 'developer' | 'designer' | 'marketer', jobTitle?: string, company?: string) => void;
  onRerouteToMentor: (mentorId: string) => void;
  language: Language;
}

export default function OpportunitiesTab({ 
  opportunities, 
  courses,
  onApply, 
  selectedOpportunity, 
  setSelectedOpportunity,
  onRerouteToResume,
  onRerouteToMentor,
  language
}: OpportunitiesTabProps) {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Apply Application dialog state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverText, setCoverText] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [emailText, setEmailText] = useState('');
  const [successApplyMsg, setSuccessApplyMsg] = useState(false);

  // Check if corresponding course is completed
  const hasCourseMatch = () => {
    if (!selectedOpportunity || !courses) return false;
    const sector = selectedOpportunity.sector.toLowerCase();
    if (sector.includes('tech') || sector.includes('dev')) {
      return courses.some(c => c.id === 'course-1' && c.completed) || courses.some(c => c.id === 'course-4' && c.completed);
    } else if (sector.includes('ux') || sector.includes('design')) {
      return courses.some(c => c.id === 'course-2' && c.completed);
    } else if (sector.includes('market') || sector.includes('brand')) {
      return courses.some(c => c.id === 'course-3' && c.completed);
    }
    return false;
  };

  // Filter listings
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSector = selectedSector === 'All' || opp.sector === selectedSector;
    const matchesType = selectedType === 'All' || opp.type === selectedType;
    
    return matchesSearch && matchesSector && matchesType;
  });

  const handleOpenApplyModal = () => {
    setShowApplyModal(true);
    setSuccessApplyMsg(false);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOpportunity && emailText.trim()) {
      onApply(selectedOpportunity.id, coverText, portfolioLink);
      setSuccessApplyMsg(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setSelectedOpportunity(null);
        setSuccessApplyMsg(false);
        setCoverText('');
        setPortfolioLink('');
        setEmailText('');
      }, 2500);
    }
  };

  const sectors = ['All', 'Tech & Dev', 'UX/UI Design', 'Marketing', 'Business & Sales', 'Finance'];
  const types = ['All', 'Full-time', 'Internship', 'Apprenticeship', 'Part-time'];

  return (
    <div id="opportunities-root" className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6 animate-fade-in relative min-h-[600px]">
      
      {/* Search and Filters Hub */}
      <div className={`xl:col-span-2 space-y-6 ${selectedOpportunity ? 'hidden xl:block' : 'block'}`}>
        
        {/* Title Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Opportunity Hub</h2>
          <p className="text-sm text-slate-500">Discover hand-picked startup placements, fellowships, and software apprenticeship slots.</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job titles, creators, or stack skills (e.g. React)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Sector Select */}
            <div className="relative min-w-[150px]">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full appearance-none px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              >
                {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Quick Type Select */}
            <div className="relative min-w-[150px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              >
                {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>Popular:</span>
            {['React', 'Figma', 'SEO', 'SQL', 'TypeScript'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity Card Directory */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base text-slate-800 font-bold">No opportunities match your filter criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the sector selector, or clearing your input query.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedSector('All'); setSelectedType('All'); }}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map((opp) => {
              const isAppliedStatus = opp.status !== 'Not Applied';
              return (
                <div 
                  key={opp.id} 
                  id={`job-card-${opp.id}`}
                  onClick={() => setSelectedOpportunity(opp)}
                  className={`p-5 bg-white rounded-2xl border cursor-pointer shadow-sm transition-colors ${
                    selectedOpportunity?.id === opp.id 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/10' 
                    : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${opp.logoColor} flex items-center justify-center font-bold text-white text-sm shadow-md`}>
                        {opp.company.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-80s text-slate-800 text-sm">{opp.title}</h3>
                        <p className="text-xs text-slate-500">{opp.company}</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    {isAppliedStatus ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        opp.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        opp.status === 'Interview' ? 'bg-violet-50 text-violet-700 border border-violet-150' :
                        'bg-amber-50 text-amber-700 border border-amber-150'
                      }`}>
                        {opp.status === 'Interview' ? 'Interview' : opp.status}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                        {opp.type}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.skillsRequired.map((skill) => (
                      <span key={skill} className="text-[10px] bg-indigo-50/50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100/20">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}</span>
                    <span className="font-semibold text-slate-600">{opp.salary.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Opportunity Side Detail Panel */}
      <div className={`xl:col-span-1 ${selectedOpportunity ? 'block' : 'hidden xl:block'}`}>
        {selectedOpportunity ? (
          <div id="side-job-detail-panel" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-28 space-y-6 animate-fade-in">
            
            {/* Mobile explicit back button */}
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="flex xl:hidden items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-extrabold mb-1 cursor-pointer transition-colors"
            >
              <span>← {language === 'fr' ? 'Retour aux opportunités' : 'Back to job openings'}</span>
            </button>

            {/* Detail Close */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected Detail</span>
              <button 
                onClick={() => setSelectedOpportunity(null)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                title="Deselect Position"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedOpportunity.logoColor} flex items-center justify-center font-black text-white text-xl mx-auto shadow-md`}>
                {selectedOpportunity.company.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base leading-tight">{selectedOpportunity.title}</h3>
                <p className="text-xs text-indigo-600 font-bold mt-0.5">{selectedOpportunity.company}</p>
              </div>
              <div className="flex justify-center gap-2 text-xs">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">{selectedOpportunity.type}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">{selectedOpportunity.sector}</span>
              </div>
              {hasCourseMatch() && (
                <div className="flex items-center justify-center gap-1.5 bg-emerald-55 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold py-1 px-3 rounded-full border border-emerald-100 w-fit mx-auto animate-fade-in shadow-sm">
                  <Award className="w-3.5 h-3.5 text-emerald-605 text-emerald-600 shrink-0" />
                  Verified Course Match (+35% Recruiter Boost)
                </div>
              )}
            </div>

            {/* Core Info Row */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/30">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Compensation</span>
                <span className="text-xs font-extrabold text-slate-700">{selectedOpportunity.salary}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Location</span>
                <span className="text-xs font-extrabold text-slate-700">{selectedOpportunity.location}</span>
              </div>
            </div>

            {/* Opportunity Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Position Focus</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedOpportunity.description}</p>
            </div>

            {/* Mandatory Requirements Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Candidate Outline</h4>
              <ul className="space-y-2">
                {selectedOpportunity.requirements.map((req, index) => (
                  <li key={index} className="flex gap-2.5 items-start text-xs text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skill tags */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Required Stack Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpportunity.skillsRequired.map((skill) => (
                  <span key={skill} className="text-xs bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2.5 py-0.5 rounded-lg font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Cross-Integrations */}
            <div className="bg-indigo-50/20 rounded-xl p-4 border border-indigo-150/40 space-y-3">
              <h5 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                Preparation Suite
              </h5>
              <p className="text-[11px] text-slate-600 leading-normal">
                Optimize your CV keywords or discuss interview tactics with an industry advisor.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const mappedRole = 
                      selectedOpportunity.sector.toLowerCase().includes('design') || selectedOpportunity.sector.toLowerCase().includes('ux') ? 'designer' :
                      selectedOpportunity.sector.toLowerCase().includes('market') || selectedOpportunity.sector.toLowerCase().includes('sales') ? 'marketer' : 'developer';
                    onRerouteToResume(mappedRole, selectedOpportunity.title, selectedOpportunity.company);
                  }}
                  className="bg-white hover:bg-indigo-50/50 text-indigo-700 font-bold text-[10px] py-1.5 border border-indigo-100 hover:border-indigo-200 rounded-xl text-center transition-all cursor-pointer leading-tight shadow-sm"
                >
                  Match CV Stack
                </button>
                <button
                  onClick={() => {
                    const mentorId = 
                      selectedOpportunity.sector.toLowerCase().includes('design') || selectedOpportunity.sector.toLowerCase().includes('ux') ? 'mentor-2' :
                      selectedOpportunity.sector.toLowerCase().includes('market') || selectedOpportunity.sector.toLowerCase().includes('sales') ? 'mentor-3' : 'mentor-1';
                    onRerouteToMentor(mentorId);
                  }}
                  className="bg-white hover:bg-indigo-50/50 text-indigo-700 font-bold text-[10px] py-1.5 border border-indigo-100 hover:border-indigo-200 rounded-xl text-center transition-all cursor-pointer leading-tight shadow-sm"
                >
                  Consult Expert Advisor
                </button>
              </div>
            </div>

            {/* Submit application block */}
            {selectedOpportunity.status !== 'Not Applied' ? (
              <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">Application in Pipeline</h5>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Your application materials were successfully registered. Check the tracking dashboard for progress schedules.</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleOpenApplyModal}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none"
              >
                Apply for Position <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 space-y-3 sticky top-28">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 text-sm">No Selection Made</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Click on any opportunity card on the left to review compensation tables, mandatory requirements, and trigger submissions.</p>
          </div>
        )}
      </div>

      {/* Multi-Step Glassmorphic Application Dialog */}
      {showApplyModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-fade-in space-y-5">
            
            {/* Modal Heading */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded uppercase">Job Submission Form</span>
                <h3 className="font-extrabold text-slate-850 text-slate-800 text-lg mt-1 truncate">Apply to {selectedOpportunity.company}</h3>
                <p className="text-xs text-slate-400 truncate">Position: {selectedOpportunity.title}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-250 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {successApplyMsg ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-10 h-10 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Application Transmitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">Excellent job! Your application credentials registered successfully.</p>
                  <p className="text-xs font-bold text-indigo-600 mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> +35 Career Points Awarded!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-650 text-slate-700 block">Contact Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Portfolio URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Portfolio / Github URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://github.com/my-portfolio"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                  />
                </div>

                {/* Quick Cover Pitch */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Why do you match this role? <span className="text-slate-400 font-normal">(Quick pitch description)</span></label>
                  <textarea
                    rows={4}
                    value={coverText}
                    onChange={(e) => setCoverText(e.target.value)}
                    placeholder="Briefly state your standout projects or background skills aligned with this company requirement."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                {/* Submit Row */}
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    Transmit Application <CheckCircle className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
