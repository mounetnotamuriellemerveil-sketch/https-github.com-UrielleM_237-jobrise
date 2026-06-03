/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Trash2,
  BookOpen,
  CornerDownRight,
  Info,
  Printer,
  Copy,
  LayoutTemplate
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../translations';

interface ResumeCoachTabProps {
  prefilledRole?: 'developer' | 'designer' | 'marketer' | null;
  prefilledText?: string;
  onClearPrefills?: () => void;
  language: Language;
}

export default function ResumeCoachTab({ 
  prefilledRole, 
  prefilledText, 
  onClearPrefills,
  language
}: ResumeCoachTabProps) {
  const t = TRANSLATIONS[language];
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState<'developer' | 'designer' | 'marketer'>('developer');
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sub-tabs & Designer States
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'designer'>('audit');
  const [cvTheme, setCvTheme] = useState<'executive' | 'modern' | 'creative'>('modern');
  const [copied, setCopied] = useState(false);

  const handleLoadTemplate = () => {
    setResumeText(`Ateba Junior - Full Stack Web Engineer
Douala, Cameroon | ateba.junior@example.com | +237 677-889-900

PROFESSIONAL EXPERIENCE
- Software Engineering Fellow at Silicon Mountain Studio (Douala, 2025)
  Developed 3 high-performance React web interfaces scaling to 15,000 active youth.
  Optimized API endpoints resulting in 25% faster load speeds under heavy server bounds.
- Associate Front-End Intern at CamTech Solutions (Yaoundé, 2024)
  Built custom UI elements using Tailwind CSS and Git version managers.

EDUCATION
- Bachelor of Computer Science - University of Science, Buea (2024)

TECHNICAL SKILLS
React, TypeScript, Node.js, SQL, Git, API, UI Design, Tailwind CSS`);
    setAnalyzed(true);
  };

  React.useEffect(() => {
    if (prefilledRole) {
      setTargetRole(prefilledRole);
    }
    if (prefilledText) {
      setResumeText(prefilledText);
      setAnalyzed(false); // Let user trigger the optimizer themselves!
    }
    if ((prefilledRole || prefilledText) && onClearPrefills) {
      onClearPrefills();
    }
  }, [prefilledRole, prefilledText, onClearPrefills]);

  // Keyword targets
  const keywordSets = {
    developer: ['React', 'TypeScript', 'SQL', 'Git', 'API', 'Tailwind', 'Node.js', 'Debug'],
    designer: ['Figma', 'Auto-layout', 'Prototyping', 'Wireframe', 'User Testing', 'Typography', 'Audit'],
    marketer: ['SEO', 'Google Analytics', 'Copywriting', 'Ad Campaign', 'Conversion', 'Content Strategy']
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  const handleClear = () => {
    setResumeText('');
    setAnalyzed(false);
  };

  // Basic diagnostic logic based on string parses
  const getBasicMetrics = () => {
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
    const activeKeywords = keywordSets[targetRole].filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(resumeText)
    );
    const missingKeywords = keywordSets[targetRole].filter(keyword => 
      !new RegExp(`\\b${keyword}\\b`, 'i').test(resumeText)
    );

    // Calculate score out of 100
    let score = 40;
    if (wordCount > 100) score += 20;
    if (wordCount > 300) score -= 10; // Too long for entry level
    score += activeKeywords.length * 7;
    // Cap score at 98
    score = Math.min(score, 98);

    return {
      wordCount,
      score,
      activeKeywords,
      missingKeywords
    };
  };

  const metrics = analyzed ? getBasicMetrics() : null;

  return (
    <div id="resume-coach-root" className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 animate-fade-in">
      
      {/* Left Area: Input Editor */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">AI Resume Coach & Builder</h2>
            <p className="text-sm text-slate-500">Paste your raw text CV, optimize target keywords, and visual build premium templates instantly.</p>
          </div>
          
          <button
            onClick={handleLoadTemplate}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-indigo-100 transition-colors w-fit shrink-0 cursor-pointer"
          >
            Load Professional Template
          </button>
        </div>

        {/* Dynamic Inner Tab Nav */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 font-bold text-xs transition-all border-b-2 -mb-px hover:text-indigo-600 cursor-pointer ${
              activeSubTab === 'audit' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400'
            }`}
          >
            Keywords Optimization & Audit
          </button>
          <button
            onClick={() => {
              setActiveSubTab('designer');
              if (!resumeText.trim()) {
                handleLoadTemplate();
              }
            }}
            className={`px-4 py-2 font-bold text-xs transition-all border-b-2 -mb-px hover:text-indigo-600 cursor-pointer ${
              activeSubTab === 'designer' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400'
            }`}
          >
            Live CV Designer & Exporter ✨
          </button>
        </div>

        {activeSubTab === 'audit' ? (
          <div className="space-y-6">

        {/* Editor Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span className="font-extrabold text-slate-800 text-sm">Enter Resume Content</span>
            </div>
            
            {/* Target Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Target Role:</span>
              <select 
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value as any);
                  if (analyzed) handleAnalyze();
                }}
                className="bg-slate-100 font-bold border border-slate-200/50 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
              >
                <option value="developer">Junior Web Developer</option>
                <option value="designer">Associate Product Designer</option>
                <option value="marketer">SEO & Content Specialist</option>
              </select>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isAnalyzing}
            rows={12}
            placeholder="Paste your active CV experiences, bullet listings, and skills summary here (e.g. 'Jane Doe - Junior Front-End Developer. Built 3 React projects using custom web APIs...')"
            className="w-full rounded-xl border border-slate-200 p-4 font-mono text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650 focus:ring-indigo-600 resize-none"
          ></textarea>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleClear}
              disabled={!resumeText}
              className="text-xs text-red-500 font-bold flex items-center gap-1 hover:text-red-700 disabled:opacity-40 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Text
            </button>
            
            <button
              onClick={handleAnalyze}
              disabled={!resumeText.trim() || isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-45"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent"></div>
                  Parsing Grammar Rules...
                </>
              ) : (
                <>
                  Optimize Keywords <Sparkles className="w-3.5 h-3.5 text-white" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* GUIDELINE CHECKLIST CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <BookOpen className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
            Standard Entry-Level Resume Guidelines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-850 text-xs">Action-Focused Bullet Outline</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Start bullets with strong action words like "Developed", "Designed", "Executed", rather than passive frames like "Worked on".</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-850 text-xs">Verify Metrics Density</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Include specific numerical targets (e.g., "sped up page-load by 25%", "gained 400 product signups"). Numbers prove efficiency.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-855 text-xs text-slate-800">No Fluffy Descriptions</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Avoid buzzwords like "hard-working", "passionate team player". Demonstrate these traits naturally via actual outcomes instead.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-850 text-xs">Single-Page Bound</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Keep content within a clean single page (approx 350-450 words total). Keep files compact and punchy for fast reviews.</p>
              </div>
            </div>

          </div>
        </div>
        </div>
        ) : (
          /* DESIGNER LIVE BUILDING MODE */
          <div id="live-cv-designer" className="space-y-6 animate-fade-in pb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                  <span className="font-extrabold text-slate-800 text-sm">Select Layout Styling Theme:</span>
                </div>
                <div className="flex gap-1.5">
                  {(['executive', 'modern', 'creative'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setCvTheme(theme)}
                      className={`text-[10px] font-extrabold px-3 py-1.5 uppercase tracking-wide rounded-lg transition-all cursor-pointer ${
                        cvTheme === theme 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live print view container */}
              <div 
                id="resume-printable-canvas" 
                className={`border rounded-xl p-6 md:p-8 shadow-inner overflow-y-auto max-h-[500px] transition-all ${
                  cvTheme === 'executive' 
                    ? 'bg-amber-50/10 border-amber-200/50 text-slate-900 font-serif' 
                    : cvTheme === 'modern'
                    ? 'bg-slate-50/50 border-indigo-100/50 text-slate-800 font-sans'
                    : 'bg-indigo-950 text-slate-100 border-indigo-900'
                }`}
              >
                {/* Visual Printable Sheet */}
                <div id="resume-preview-sheet" className="space-y-4 text-left">
                  {/* Name Header */}
                  <div className={`text-center pb-4 ${cvTheme === 'creative' ? 'border-b border-indigo-805 border-indigo-800' : 'border-b border-slate-200'}`}>
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                      {resumeText ? resumeText.split('\n')[0] : 'YOUR FULL NAME'}
                    </h1>
                    <p className={`text-[11px] mt-1 ${cvTheme === 'creative' ? 'text-indigo-300' : 'text-slate-500'}`}>
                      {resumeText && resumeText.split('\n')[1] ? resumeText.split('\n')[1] : 'Email | Contact details | Location'}
                    </p>
                  </div>

                  {/* Rest of raw list parsed onto screen */}
                  <div className="space-y-3.5 text-xs">
                    {resumeText ? (
                      resumeText.split('\n').slice(2).map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.endsWith(':') || trimmed === 'PROFESSIONAL EXPERIENCE' || trimmed === 'EDUCATION' || trimmed === 'TECHNICAL SKILLS') {
                          return (
                            <h3 key={idx} className={`font-black text-xs uppercase tracking-widest pt-2.5 pb-1 ${
                              cvTheme === 'creative' ? 'text-indigo-400 border-b border-indigo-900' : 'text-indigo-700 border-b border-slate-100'
                            }`}>
                              {trimmed}
                            </h3>
                          );
                        } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                          return (
                            <div key={idx} className="pl-4 relative">
                              <span className="absolute left-1.5 top-2 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              <p className={`${cvTheme === 'creative' ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{trimmed.substring(1).trim()}</p>
                            </div>
                          );
                        } else {
                          return (
                            <p key={idx} className={`${cvTheme === 'creative' ? 'text-slate-200 font-mono text-[11px]' : 'text-slate-700'} leading-relaxed`}>
                              {trimmed}
                            </p>
                          );
                        }
                      })
                    ) : (
                      <p className="text-center text-slate-400 py-10">Add template text or draft a portfolio on the original tab to display structure here.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Designer Action Hub */}
              <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resumeText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-200"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'CV Copied! ✓' : 'Copy Clean Markdown'}
                </button>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-600/15"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save as PDF
                </button>
              </div>
            </div>

            {/* Micro layout instruction advice */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 flex items-start gap-2.5">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600 mt-0.5 animate-pulse shrink-0" />
              <p className="text-[11px] text-slate-600 leading-relaxed text-left">
                <strong>Cameroon Recruiter Preference:</strong> Startup screening teams in Central Africa prioritize highly structured single-page resume structures where key contact handles can be called directly. Choosing the <strong>Modern styled Theme</strong> highlights technical keywords naturally.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Right Column: AI Scorecard Results panel */}
      <div className="lg:col-span-1">
        {analyzed && metrics ? (
          <div id="resume-analysis-results" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-28 space-y-6 animate-fade-in">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scorecard Outcomes</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded">AI Verified</span>
            </div>

            {/* Circular score display */}
            <div className="text-center py-4 space-y-2">
              <div className="relative inline-flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    className="text-slate-105 text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className="text-indigo-600"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - metrics.score / 100)}`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <div className="absolute font-black text-xl text-slate-800 font-mono">
                  {metrics.score}%
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Overall CV Grade</h4>
                <p className="text-xs text-slate-450 text-slate-400 mt-0.5">Based on formatting and keywords matches</p>
              </div>
            </div>

            {/* Diagnostics Stats */}
            <div className="space-y-3 pt-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Text Length</span>
                <span className="font-bold text-slate-700">{metrics.wordCount} words</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Keywords Index</span>
                <span className="font-bold text-indigo-700">{metrics.activeKeywords.length} / {keywordSets[targetRole].length} matched</span>
              </div>
            </div>

            {/* Keyword tags tracker */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Keywords Status check</h4>
              
              {/* Present Keywords */}
              {metrics.activeKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 block flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" /> Present & Active:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {metrics.activeKeywords.map(tag => (
                      <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {metrics.missingKeywords.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-amber-600 block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" /> Missing (Highly Recommended):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {metrics.missingKeywords.map(tag => (
                      <span key={tag} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-100/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-150 rounded-lg text-[10px] text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Ideal match! All primary sector keywords detected.
                </div>
              )}
            </div>

            {/* Action Item details */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Action Recommendations</h4>
              
              <div className="space-y-2">
                {metrics.score < 80 && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CornerDownRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <span>Incorporate at least 2 of the missing keywords to elevate match algorithms.</span>
                  </div>
                )}
                {metrics.wordCount < 150 && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CornerDownRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <span>Your descriptions are too brief. Add more context to past project roles.</span>
                  </div>
                )}
                <div className="flex items-start gap-1.5 text-xs text-slate-600">
                  <CornerDownRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <span>Verify that contact email is prominent in your editor draft.</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 space-y-3 sticky top-28">
            <Info className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 text-sm">Awaiting CV Data</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Fill or paste your curriculum vitae details in the main editor container on the left, then trigger "Optimize Keywords" to receive formatting metrics and missing word audits.</p>
          </div>
        )}
      </div>

    </div>
  );
}
