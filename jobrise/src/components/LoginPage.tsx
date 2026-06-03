/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  User, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  CheckCircle,
  Code,
  Brush,
  TrendingUp,
  BarChart,
  Lock,
  Mail,
  Building,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface LoginPageProps {
  onLogin: (profile: { 
    name: string; 
    role: string; 
    location: string; 
    skills: string[];
    email: string;
    userType: 'jobseeker' | 'employer';
    companyName?: string;
  }) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LoginPage({ onLogin, language, onLanguageChange }: LoginPageProps) {
  const t = TRANSLATIONS[language];
  
  // Local login/registration inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');
  
  // Conditionally required inputs
  const [selectedRole, setSelectedRole] = useState<'developer' | 'designer' | 'marketer' | 'analyst'>('developer');
  const [companyName, setCompanyName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Douala');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Local preset selections for Cameroon cities
  const cmrCities = [
    { name: 'Douala', desc: 'Economic Hub (Littoral)' },
    { name: 'Buea', desc: 'Silicon Mountain (Southwest)' },
    { name: 'Yaoundé', desc: 'Political Capital (Centre)' },
    { name: 'Limbe', desc: 'Beachfront Tech Hub (Southwest)' },
    { name: 'Bafoussam', desc: 'Regional Hub (West)' },
    { name: 'Garoua', desc: 'Commercial Center (North)' }
  ];

  // Map roles to titles & default core skills for candidate pre-creation
  const roleMetadata = {
    developer: {
      title: 'Junior Frontend Developer',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS']
    },
    designer: {
      title: 'UX/UI Designer',
      skills: ['Figma', 'Wireframing', 'Typography', 'Prototyping']
    },
    marketer: {
      title: 'SEO & Growth Marketer',
      skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Copywriting']
    },
    analyst: {
      title: 'Business Analytics & Data Intern',
      skills: ['SQL', 'Tableau', 'Excel', 'Data Analysis']
    }
  };

  const handleApplyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(language === 'fr' ? 'Veuillez entrer votre nom complet pour continuer.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'fr' ? 'Veuillez entrer une adresse e-mail valide.' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(language === 'fr' ? 'Le mot de passe doit faire au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    if (userType === 'employer' && !companyName.trim()) {
      setErrorMsg(language === 'fr' ? 'Veuillez entrer le nom de votre entreprise.' : 'Please enter your company name.');
      return;
    }
    
    // Create profile
    if (userType === 'jobseeker') {
      const roleMeta = roleMetadata[selectedRole];
      onLogin({
        name: name.trim(),
        role: roleMeta.title,
        location: `${selectedCity}, Cameroon • Active`,
        skills: roleMeta.skills,
        email: email.trim(),
        userType: 'jobseeker'
      });
    } else {
      onLogin({
        name: name.trim(),
        role: `Hiring Representative @ ${companyName.trim()}`,
        location: `${selectedCity}, Cameroon`,
        skills: ['Recruiting', 'Talent Sourcing', 'System Screening'],
        email: email.trim(),
        userType: 'employer',
        companyName: companyName.trim()
      });
    }
  };

  // Quick preset loading helper to test easily
  const loadPresetGuest = (preset: 'developer' | 'designer' | 'marketer' | 'employer_pres') => {
    setErrorMsg('');
    if (preset === 'employer_pres') {
      onLogin({
        name: 'Mbah Patrick',
        role: 'Recruiting Director @ Maviance Cameroon',
        location: 'Douala, Cameroon',
        skills: ['Fintech Recruiting', 'CEMAC Sourcing', 'Leadership'],
        email: 'recruiting@maviance.cm',
        userType: 'employer',
        companyName: 'Maviance'
      });
    } else {
      const names = {
        developer: 'Alex Ndip',
        designer: 'Ngo Bella',
        marketer: 'Audrey Nkonda'
      };
      const cities = {
        developer: 'Buea',
        designer: 'Douala',
        marketer: 'Yaoundé'
      };
      const emails = {
        developer: 'alex.ndip@siliconmountain.cm',
        designer: 'bella.designer@figmatracks.cm',
        marketer: 'audrey.nk@growthly.cm'
      };

      const roleMeta = roleMetadata[preset];
      onLogin({
        name: names[preset],
        role: roleMeta.title,
        location: `${cities[preset]}, Cameroon • Active`,
        skills: roleMeta.skills,
        email: emails[preset],
        userType: 'jobseeker'
      });
    }
  };

  return (
    <div id="login-screen-view" className="min-h-screen bg-slate-900 text-white flex flex-col lg:flex-row relative overflow-hidden">
      
      {/* Decorative national flag dynamic top accent strip */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-red-500 to-amber-400 z-50"></div>
      
      {/* Soft atmospheric lighting overlay effects */}
      <div className="absolute -top-40 -left-40 w-96.5 h-96.5 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96.5 h-96.5 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Column: Vision Statement and Feature Pitch */}
      <div className="lg:w-[42%] bg-slate-950 p-8 lg:p-14 flex flex-col justify-between border-r border-slate-800/60 relative z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <span className="text-white text-xl font-black italic tracking-tighter">JR</span>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">JOB<span className="text-indigo-500">Rise</span></span>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 block -mt-1">{t.localEcosystemBadge}</span>
            </div>
          </div>

          <div className="mt-12 lg:mt-20 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {language === 'fr' ? 'Portail de recrutement bilatéral' : 'Dual Recruiting Gateway'}
              </div>
              <h1 className="text-3xl lg:text-[42px] font-black tracking-tight leading-none text-white">
                {language === 'fr' ? 'La rencontre des talents et des recruteurs.' : 'Connecting ambition with enterprise.'}
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                {language === 'fr'
                  ? 'Une plateforme unifiée qui permet aux chercheurs d’emploi de valoriser leurs compétences et aux employeurs de recruter de manière ciblée.'
                  : 'A unified digital space for job seekers seeking high-yield career paths and employers aiming to hire trained professional talent.'}
              </p>
            </motion.div>

            {/* Platform USP stats items */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                <div className="text-indigo-400 text-base lg:text-lg font-black block">Candidates Pool</div>
                <div className="text-[10px] uppercase font-semibold text-slate-500 mt-1">
                  {language === 'fr' ? 'Aptitudes vérifiées' : 'Vetted Skill Badges'}
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                <div className="text-emerald-400 text-base lg:text-lg font-black block">Startup Engine</div>
                <div className="text-[10px] uppercase font-semibold text-slate-500 mt-1">
                  {language === 'fr' ? 'Emploi direct CEMAC' : 'Direct Hiring Authority'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div id="login-footer-credits" className="mt-12 lg:mt-0 pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[14px]">🇨🇲</span>
            <span className="font-bold text-slate-450 text-slate-400">JOBRise National Initiative Portal</span>
          </div>
          <p className="text-[9.5px] leading-relaxed">
            {language === 'fr' 
              ? 'Sécurisé par protocole d’optimisation intelligent. Douala, Yaoundé, Buea, Limbe.' 
              : 'End-to-end recruitment pipelines for startups and young professionals across central Cameroon hubs.'}
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Login & Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-12 relative z-10 bg-slate-900 overflow-y-auto min-h-screen">
        
        {/* Languages Switcher floating to top-right layout */}
        <div className="absolute top-6 right-6 flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
          <button 
            type="button"
            onClick={() => onLanguageChange('fr')}
            className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${language === 'fr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            FR
          </button>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg bg-slate-950/75 p-6 lg:p-10 rounded-[32px] border border-slate-800 backdrop-blur-md shadow-2xl space-y-6 my-8"
        >
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              {userType === 'jobseeker' 
                ? (language === 'fr' ? 'Espace Candidat' : 'Job Seeker Access')
                : (language === 'fr' ? 'Espace Employeur' : 'Employer Console')
              }
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              {language === 'fr' 
                ? 'Remplissez le formulaire sécurisé pour vous connecter.' 
                : 'Kindly complete the secure parameters below.'}
            </p>
          </div>

          {/* User Type Tab Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setUserType('jobseeker');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                userType === 'jobseeker'
                  ? 'bg-indigo-650 bg-indigo-600 text-white shadow-md'
                  : 'text-slate-450 text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.userTypeSeeker}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('employer');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                userType === 'employer'
                  ? 'bg-indigo-650 bg-indigo-600 text-white shadow-md'
                  : 'text-slate-450 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t.userTypeEmployer}</span>
            </button>
          </div>

          <form onSubmit={handleApplyLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Input: Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                {t.fullNameLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Ex: Alex Ndip' : 'e.g. Alex Ndip'}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Input: Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@company.cm"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Employer Only Option: Company Name */}
            {userType === 'employer' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  {t.companyNameLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Building className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Maviance, MTT, Orange, Cameroon Dev Hub"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Job Seeker Only option: Track Selection */}
            {userType === 'jobseeker' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  {t.desiredRoleLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'developer', title: language === 'fr' ? 'Développeur' : 'Developer', icon: Code },
                    { id: 'designer', title: language === 'fr' ? 'Designer' : 'Designer', icon: Brush },
                    { id: 'marketer', title: language === 'fr' ? 'Marketing' : 'Marketer', icon: TrendingUp },
                    { id: 'analyst', title: language === 'fr' ? 'Data Analyst' : 'Data Analyst', icon: BarChart }
                  ].map((roleOption) => {
                    const Icon = roleOption.icon;
                    const isSelected = selectedRole === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => setSelectedRole(roleOption.id as any)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-250'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-[10.5px] font-bold">{roleOption.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input: Location */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                {t.selectCityLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  {cmrCities.map((city) => (
                    <option key={city.name} value={city.name} className="bg-slate-950 text-white">
                      {city.name} — {city.desc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/15 group mt-4"
            >
              <span>{userType === 'employer' ? (language === 'fr' ? 'Accéder au Portefeuille Recruteur' : 'Enter Recruiting Center') : t.loginSubmitBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick presets helper info box */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                💡 {t.quickPresetBtn}
              </span>
              <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                {language === 'fr' ? 'Remplissage instantané' : 'Instant pre-fill'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button 
                  type="button"
                  onClick={() => loadPresetGuest('developer')}
                  className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800/65 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all"
                  title="Test as Resume Optimizer & Developer"
                >
                  Candidate Dev
                </button>
                <button 
                  type="button"
                  onClick={() => loadPresetGuest('designer')}
                  className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800/65 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all"
                  title="Test as UX Designer candidate"
                >
                  Candidate UX
                </button>
                <button 
                  type="button"
                  onClick={() => loadPresetGuest('marketer')}
                  className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800/65 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all"
                  title="Test as Growth Marketer"
                >
                  Candidate Mktg
                </button>
              </div>
              
              <button 
                type="button"
                onClick={() => loadPresetGuest('employer_pres')}
                className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/40 py-2 rounded-xl text-[10px] font-extrabold cursor-pointer text-center transition-all flex items-center justify-center gap-1"
                title="Enter instantly as a Hiring start-up Recruiter"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Tester en tant qu’Employeur / Recruteur' : 'Quick Access: Start as Employer representative'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
