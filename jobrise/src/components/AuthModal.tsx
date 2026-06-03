/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Briefcase,
  MapPin,
  User,
  ArrowRight,
  Code,
  Brush,
  TrendingUp,
  BarChart,
  Lock,
  Mail,
  Building,
  UserCheck,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface AuthModalProps {
  open: boolean;
  initialUserType: 'jobseeker' | 'employer';
  onClose: () => void;
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
}

const cmrCities = [
  { name: 'Douala', desc: 'Economic Hub (Littoral)' },
  { name: 'Buea', desc: 'Silicon Mountain (Southwest)' },
  { name: 'Yaoundé', desc: 'Political Capital (Centre)' },
  { name: 'Limbe', desc: 'Beachfront Tech Hub (Southwest)' },
  { name: 'Bafoussam', desc: 'Regional Hub (West)' },
  { name: 'Garoua', desc: 'Commercial Center (North)' }
];

const roleMetadata = {
  developer: { title: 'Junior Frontend Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
  designer: { title: 'UX/UI Designer', skills: ['Figma', 'Wireframing', 'Typography', 'Prototyping'] },
  marketer: { title: 'SEO & Growth Marketer', skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Copywriting'] },
  analyst: { title: 'Business Analytics & Data Intern', skills: ['SQL', 'Tableau', 'Excel', 'Data Analysis'] }
};

export default function AuthModal({ open, initialUserType, onClose, onLogin, language }: AuthModalProps) {
  const t = TRANSLATIONS[language];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>(initialUserType);
  const [selectedRole, setSelectedRole] = useState<'developer' | 'designer' | 'marketer' | 'analyst'>('developer');
  const [companyName, setCompanyName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Douala');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setUserType(initialUserType);
      setErrorMsg('');
    }
  }, [open, initialUserType]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
      const names = { developer: 'Alex Ndip', designer: 'Ngo Bella', marketer: 'Audrey Nkonda' };
      const cities = { developer: 'Buea', designer: 'Douala', marketer: 'Yaoundé' };
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

  const inputClass =
    'w-full bg-[#0c1828] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/15 transition-all';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#040a14]/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full max-w-md bg-[#0a131f] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {userType === 'jobseeker'
                  ? language === 'fr' ? 'Espace Candidat' : 'Job Seeker Access'
                  : language === 'fr' ? 'Espace Employeur' : 'Employer Console'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                {language === 'fr' ? 'Remplissez le formulaire sécurisé pour continuer.' : 'Complete the secure parameters below.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0c1828] rounded-2xl border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => { setUserType('jobseeker'); setErrorMsg(''); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userType === 'jobseeker' ? 'bg-emerald-500 text-[#04210f] shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t.userTypeSeeker}</span>
                <span className="sm:hidden">{language === 'fr' ? 'Candidat' : 'Candidate'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setUserType('employer'); setErrorMsg(''); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userType === 'employer' ? 'bg-emerald-500 text-[#04210f] shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">{t.userTypeEmployer}</span>
                <span className="sm:hidden">{language === 'fr' ? 'Recruteur' : 'Recruiter'}</span>
              </button>
            </div>

            <form onSubmit={handleApplyLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-bold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.fullNameLabel}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    placeholder={language === 'fr' ? 'Ex: Alex Ndip' : 'e.g. Alex Ndip'}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.emailLabel}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    placeholder="name@company.cm"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.passwordLabel}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Lock className="w-4 h-4" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    className={`${inputClass} pr-10`}
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

              {userType === 'employer' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.companyNameLabel}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Building className="w-4 h-4" /></span>
                    <input
                      type="text"
                      placeholder="e.g. Maviance, MTN, Orange, Cameroon Dev Hub"
                      value={companyName}
                      onChange={(e) => { setCompanyName(e.target.value); setErrorMsg(''); }}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {userType === 'jobseeker' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.desiredRoleLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'developer', title: language === 'fr' ? 'Développeur' : 'Developer', icon: Code },
                      { id: 'designer', title: 'Designer', icon: Brush },
                      { id: 'marketer', title: language === 'fr' ? 'Marketing' : 'Marketer', icon: TrendingUp },
                      { id: 'analyst', title: 'Data Analyst', icon: BarChart }
                    ].map((roleOption) => {
                      const Icon = roleOption.icon;
                      const isSelected = selectedRole === roleOption.id;
                      return (
                        <button
                          key={roleOption.id}
                          type="button"
                          onClick={() => setSelectedRole(roleOption.id as any)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-[#0c1828] border-white/10 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-[10.5px] font-bold">{roleOption.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.selectCityLabel}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><MapPin className="w-4 h-4" /></span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#0c1828] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/70 transition-colors appearance-none cursor-pointer"
                  >
                    {cmrCities.map((city) => (
                      <option key={city.name} value={city.name} className="bg-[#0a131f] text-white">
                        {city.name} — {city.desc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">▼</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 group mt-1"
              >
                <span>{userType === 'employer' ? (language === 'fr' ? 'Accéder au Portefeuille Recruteur' : 'Enter Recruiting Center') : t.loginSubmitBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="pt-4 mt-4 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">💡 {t.quickPresetBtn}</span>
                <span className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                  {language === 'fr' ? 'Remplissage instantané' : 'Instant pre-fill'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button type="button" onClick={() => loadPresetGuest('developer')} className="bg-[#0c1828] hover:bg-[#10203a] hover:text-white border border-white/10 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all">Candidate Dev</button>
                <button type="button" onClick={() => loadPresetGuest('designer')} className="bg-[#0c1828] hover:bg-[#10203a] hover:text-white border border-white/10 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all">Candidate UX</button>
                <button type="button" onClick={() => loadPresetGuest('marketer')} className="bg-[#0c1828] hover:bg-[#10203a] hover:text-white border border-white/10 py-1.5 px-1 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer text-center leading-tight transition-all">Candidate Mktg</button>
              </div>
              <button
                type="button"
                onClick={() => loadPresetGuest('employer_pres')}
                className="w-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/25 hover:border-amber-400/40 py-2 rounded-xl text-[10px] font-extrabold cursor-pointer text-center transition-all flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Tester en tant qu’Employeur / Recruteur' : 'Quick Access: Start as Employer representative'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
