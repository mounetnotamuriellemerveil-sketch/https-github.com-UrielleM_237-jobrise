/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, animate } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Search,
  ShieldCheck,
  Cpu,
  Banknote,
  Megaphone,
  Wrench,
  HeartPulse,
  GraduationCap,
  Sprout,
  BadgeCheck,
  MapPin,
  Quote,
  Star,
  TrendingUp,
  Users,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { Language } from '../translations';
import Logo from './Logo';

interface LandingPageProps {
  onStart: (userType: 'jobseeker' | 'employer') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const COPY = {
  en: {
    nav: { jobs: 'Find Jobs', companies: 'Companies', advice: 'Advice', about: 'About', signIn: 'Sign in' },
    hero: {
      badge: 'Cameroon’s talent marketplace',
      title1: 'Let’s build the careers that',
      title2: 'build Cameroon.',
      subtitle: 'Connecting the best Cameroonian talent with the companies shaping the future of Africa.',
      ctaSeeker: 'Find a job',
      ctaEmployer: 'Hire talent'
    },
    trust: 'Trusted by leading Cameroonian companies and startups',
    stats: [
      { value: 15000, suffix: '+', label: 'Candidates', icon: Users },
      { value: 850, suffix: '+', label: 'Companies', icon: Building2 },
      { value: 2500, suffix: '+', label: 'Active Jobs', icon: Briefcase },
      { value: 10, suffix: '+', label: 'Regions Covered', icon: MapPin }
    ],
    categoriesTitle: 'Opportunities across every sector',
    categoriesSub: 'From Douala’s fintech scene to Buea’s Silicon Mountain — find your path.',
    salaryLabel: 'Salary',
    skillsLabel: 'Top skills',
    growthLabel: 'growth',
    exploreLabel: 'Explore Opportunities',
    categories: [
      { name: 'Technology', jobs: '620+ jobs', salary: '350K - 1.2M FCFA', skills: 'React • Node.js • Python', growth: '+18%', icon: Cpu, img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80' },
      { name: 'Finance', jobs: '340+ jobs', salary: '400K - 1.5M FCFA', skills: 'Analysis • Accounting • Risk', growth: '+18%', icon: Banknote, img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80' },
      { name: 'Marketing', jobs: '280+ jobs', salary: '250K - 900K FCFA', skills: 'SEO • Content • Branding', growth: '+14%', icon: Megaphone, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80' },
      { name: 'Engineering', jobs: '410+ jobs', salary: '350K - 1.3M FCFA', skills: 'AutoCAD • Project Mgmt • Civil', growth: '+17%', icon: Wrench, img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
      { name: 'Healthcare', jobs: '190+ jobs', salary: '300K - 1.1M FCFA', skills: 'Nursing • Patient Care • Pharma', growth: '+12%', icon: HeartPulse, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80' },
      { name: 'Education', jobs: '210+ jobs', salary: '200K - 700K FCFA', skills: 'Teaching • Training • Coaching', growth: '+10%', icon: GraduationCap, img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80' },
      { name: 'Agriculture', jobs: '160+ jobs', salary: '180K - 600K FCFA', skills: 'Farming • Agronomy • Supply Chain', growth: '+15%', icon: Sprout, img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80' }
    ],
    featured: {
      badge: 'Featured Sector',
      title: 'Tech & Innovation',
      jobs: '620+ active jobs',
      subtitle: 'Cameroon’s fastest growing sector',
      skills: ['React', 'AI', 'Cloud', 'Cybersecurity', 'Data'],
      cta: 'Explore Opportunities',
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80'
    },
    talentsTitle: 'Verified talent, ready to hire',
    talentsSub: 'Skill-badged professionals with reviewed portfolios across the country.',
    talents: [
      { name: 'Alex Ndip', role: 'Frontend Developer', city: 'Buea', skills: ['React', 'TypeScript', 'Tailwind'], img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ngo Bella', role: 'UX/UI Designer', city: 'Douala', skills: ['Figma', 'Design Systems', 'Prototyping'], img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80' },
      { name: 'Audrey Nkonda', role: 'Growth Marketer', city: 'Yaoundé', skills: ['SEO', 'Analytics', 'Content'], img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Eric Fometeu', role: 'Data Analyst', city: 'Douala', skills: ['SQL', 'Tableau', 'Python'], img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
    ],
    dashTitle: 'A recruiter dashboard built for speed',
    dashSub: 'Track candidates, manage your pipeline, and make confident hiring decisions with clear analytics.',
    dashPoints: ['Candidate analytics & skill verification', 'Drag-free hiring pipeline stages', 'Real-time application tracking'],
    dashCta: 'Explore the dashboard',
    storiesTitle: 'Success stories from across Cameroon',
    stories: [
      { quote: 'JOBRise connected me with a Douala fintech within two weeks. The skill badges made my profile stand out instantly.', name: 'Marlyse T.', role: 'Backend Engineer • Maviance', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
      { quote: 'We hired three engineers for our Buea startup. The pipeline tools cut our time-to-hire in half.', name: 'Junior M.', role: 'CTO • Silicon Mountain startup', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { quote: 'As a recent graduate, the mentor simulator prepared me for real interviews. I landed my first role in Yaoundé.', name: 'Clarisse A.', role: 'Data Analyst • Centre Region', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }
    ],
    impactTitle: 'Real impact, region by region',
    impactSub: 'Opportunities and economic momentum mapped across Cameroon’s 10 regions.',
    regions: [
      { name: 'Littoral (Douala)', jobs: '920 jobs' },
      { name: 'Centre (Yaoundé)', jobs: '740 jobs' },
      { name: 'Southwest (Buea)', jobs: '430 jobs' },
      { name: 'West (Bafoussam)', jobs: '210 jobs' },
      { name: 'North (Garoua)', jobs: '180 jobs' }
    ],
    finalTitle: 'Your next opportunity starts here.',
    finalSub: 'Join thousands of professionals and companies building the future of work in Cameroon.',
    footerTagline: 'Building the careers that build Cameroon.',
    rights: 'All rights reserved.'
  },
  fr: {
    nav: { jobs: 'Offres d’emploi', companies: 'Entreprises', advice: 'Conseils', about: 'À propos', signIn: 'Se connecter' },
    hero: {
      badge: 'La marketplace des talents du Cameroun',
      title1: 'Construisons les carrières qui',
      title2: 'construisent le Cameroun.',
      subtitle: 'Connectez les meilleurs talents camerounais aux entreprises qui façonnent l’avenir de l’Afrique.',
      ctaSeeker: 'Trouver un emploi',
      ctaEmployer: 'Recruter des talents'
    },
    trust: 'La confiance des entreprises et startups camerounaises de référence',
    stats: [
      { value: 15000, suffix: '+', label: 'Candidats', icon: Users },
      { value: 850, suffix: '+', label: 'Entreprises', icon: Building2 },
      { value: 2500, suffix: '+', label: 'Offres actives', icon: Briefcase },
      { value: 10, suffix: '+', label: 'Régions couvertes', icon: MapPin }
    ],
    categoriesTitle: 'Des opportunités dans tous les secteurs',
    categoriesSub: 'De la fintech de Douala à la Silicon Mountain de Buea — trouvez votre voie.',
    salaryLabel: 'Salaire',
    skillsLabel: 'Compétences clés',
    growthLabel: 'croissance',
    exploreLabel: 'Explorer les opportunités',
    categories: [
      { name: 'Technologie', jobs: '620+ postes', salary: '350K - 1.2M FCFA', skills: 'React • Node.js • Python', growth: '+18%', icon: Cpu, img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80' },
      { name: 'Finance', jobs: '340+ postes', salary: '400K - 1.5M FCFA', skills: 'Analyse • Comptabilité • Risque', growth: '+18%', icon: Banknote, img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80' },
      { name: 'Marketing', jobs: '280+ postes', salary: '250K - 900K FCFA', skills: 'SEO • Contenu • Branding', growth: '+14%', icon: Megaphone, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80' },
      { name: 'Ingénierie', jobs: '410+ postes', salary: '350K - 1.3M FCFA', skills: 'AutoCAD • Gestion de projet • Génie civil', growth: '+17%', icon: Wrench, img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
      { name: 'Santé', jobs: '190+ postes', salary: '300K - 1.1M FCFA', skills: 'Soins infirmiers • Patients • Pharma', growth: '+12%', icon: HeartPulse, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80' },
      { name: 'Éducation', jobs: '210+ postes', salary: '200K - 700K FCFA', skills: 'Enseignement • Formation • Coaching', growth: '+10%', icon: GraduationCap, img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80' },
      { name: 'Agriculture', jobs: '160+ postes', salary: '180K - 600K FCFA', skills: 'Culture • Agronomie • Chaîne logistique', growth: '+15%', icon: Sprout, img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80' }
    ],
    featured: {
      badge: 'Secteur à la une',
      title: 'Tech & Innovation',
      jobs: '620+ postes actifs',
      subtitle: 'Le secteur qui croît le plus vite au Cameroun',
      skills: ['React', 'IA', 'Cloud', 'Cybersécurité', 'Data'],
      cta: 'Explorer les opportunités',
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80'
    },
    talentsTitle: 'Des talents vérifiés, prêts à l’embauche',
    talentsSub: 'Des profils certifiés avec des portfolios évalués à travers tout le pays.',
    talents: [
      { name: 'Alex Ndip', role: 'Développeur Frontend', city: 'Buea', skills: ['React', 'TypeScript', 'Tailwind'], img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ngo Bella', role: 'Designer UX/UI', city: 'Douala', skills: ['Figma', 'Design Systems', 'Prototypage'], img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80' },
      { name: 'Audrey Nkonda', role: 'Growth Marketer', city: 'Yaoundé', skills: ['SEO', 'Analytics', 'Contenu'], img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Eric Fometeu', role: 'Data Analyst', city: 'Douala', skills: ['SQL', 'Tableau', 'Python'], img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
    ],
    dashTitle: 'Un tableau de bord recruteur conçu pour la vitesse',
    dashSub: 'Suivez les candidats, gérez votre pipeline et prenez des décisions de recrutement éclairées grâce à des analyses claires.',
    dashPoints: ['Analytics candidats & vérification des compétences', 'Étapes de recrutement fluides', 'Suivi des candidatures en temps réel'],
    dashCta: 'Découvrir le tableau de bord',
    storiesTitle: 'Des réussites partout au Cameroun',
    stories: [
      { quote: 'JOBRise m’a connecté à une fintech de Douala en deux semaines. Les badges de compétences ont fait ressortir mon profil.', name: 'Marlyse T.', role: 'Ingénieure Backend • Maviance', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
      { quote: 'Nous avons recruté trois ingénieurs pour notre startup à Buea. Les outils de pipeline ont divisé par deux notre délai.', name: 'Junior M.', role: 'CTO • Startup Silicon Mountain', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { quote: 'Jeune diplômée, le simulateur de mentor m’a préparée aux vrais entretiens. J’ai décroché mon premier poste à Yaoundé.', name: 'Clarisse A.', role: 'Data Analyst • Région Centre', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }
    ],
    impactTitle: 'Un impact réel, région par région',
    impactSub: 'Opportunités et dynamique économique cartographiées à travers les 10 régions du Cameroun.',
    regions: [
      { name: 'Littoral (Douala)', jobs: '920 offres' },
      { name: 'Centre (Yaoundé)', jobs: '740 offres' },
      { name: 'Sud-Ouest (Buea)', jobs: '430 offres' },
      { name: 'Ouest (Bafoussam)', jobs: '210 offres' },
      { name: 'Nord (Garoua)', jobs: '180 offres' }
    ],
    finalTitle: 'Votre prochaine opportunité commence ici.',
    finalSub: 'Rejoignez des milliers de professionnels et d’entreprises qui bâtissent l’avenir du travail au Cameroun.',
    footerTagline: 'Construire les carrières qui construisent le Cameroun.',
    rights: 'Tous droits réservés.'
  }
};

const PARTNERS = ['Maviance', 'MTN', 'Orange', 'Afriland', 'Ecobank', 'ActivSpaces'];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.floor(v))
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 }
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function LandingPage({ onStart, language, onLanguageChange }: LandingPageProps) {
  const c = COPY[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Page-wide scroll progress bar
  const { scrollYProgress: pageProgress } = useScroll();
  const progressX = useSpring(pageProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLink = 'text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer';

  return (
    <div className="bg-[#08111F] text-white antialiased selection:bg-emerald-500/30">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressX }}
        className="fixed top-0 left-0 right-0 z-[120] h-1 origin-left bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"
      />

      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? 'bg-[#08111F]/85 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#categories" className={navLink}>{c.nav.jobs}</a>
            <a href="#employers" className={navLink}>{c.nav.companies}</a>
            <a href="#talents" className={navLink}>{c.nav.advice}</a>
            <a href="#stories" className={navLink}>{c.nav.about}</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button onClick={() => onLanguageChange('en')} className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-emerald-500 text-[#04210f]' : 'text-slate-400 hover:text-white'}`}>EN</button>
              <button onClick={() => onLanguageChange('fr')} className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${language === 'fr' ? 'bg-emerald-500 text-[#04210f]' : 'text-slate-400 hover:text-white'}`}>FR</button>
            </div>
            <button onClick={() => onStart('jobseeker')} className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#04210f] text-sm font-bold px-5 py-2 rounded-lg transition-all cursor-pointer shadow-lg shadow-emerald-500/20">
              {c.nav.signIn}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2 cursor-pointer">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#08111F] border-t border-white/10 px-5 py-4 space-y-3">
            <a href="#categories" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-300">{c.nav.jobs}</a>
            <a href="#employers" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-300">{c.nav.companies}</a>
            <a href="#talents" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-300">{c.nav.advice}</a>
            <a href="#stories" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-300">{c.nav.about}</a>
            <div className="flex gap-3 pt-2">
              <button onClick={() => onStart('jobseeker')} className="flex-1 bg-white/5 border border-white/10 text-white text-sm font-bold py-2.5 rounded-lg cursor-pointer">{c.hero.ctaSeeker}</button>
              <button onClick={() => onStart('employer')} className="flex-1 bg-emerald-500 text-[#04210f] text-sm font-bold py-2.5 rounded-lg cursor-pointer">{c.hero.ctaEmployer}</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <div ref={heroRef} className="relative h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src="/hero-cameroon.png"
            alt="Cameroonian professionals collaborating with city skyline"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2400&q=80';
              }
            }}
          />
        </motion.div>
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08111F]/35 via-[#08111F]/15 to-[#08111F]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08111F]/90 via-[#08111F]/25 to-transparent" />
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 rounded-full text-emerald-300 text-xs font-bold backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {c.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              {c.hero.title1}{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">{c.hero.title2}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">{c.hero.subtitle}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
              <button onClick={() => onStart('jobseeker')} className="group inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-bold text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer shadow-xl shadow-emerald-500/25">
                <Search className="w-4 h-4" />
                {c.hero.ctaSeeker}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => onStart('employer')} className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer backdrop-blur-sm">
                <Briefcase className="w-4 h-4" />
                {c.hero.ctaEmployer}
              </button>
            </div>

            {/* Inline hero statistics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 max-w-2xl">
              {c.stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col gap-2">
                    <span className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Icon className="w-4 h-4 text-[#04210f]" />
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-white leading-none">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-300">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="w-5 h-9 rounded-full border-2 border-slate-500 flex justify-center pt-1.5">
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-1 h-1.5 rounded-full bg-slate-300" />
          </span>
        </motion.div>
      </div>

      {/* TRUST */}
      <div className="border-y border-white/5 bg-[#0a1322]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">{c.trust}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {PARTNERS.map((p) => (
              <span key={p} className="text-lg sm:text-xl font-black text-slate-600 hover:text-slate-300 transition-colors tracking-tight">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="relative bg-[#07101D] [background-image:radial-gradient(circle_at_top,rgba(0,184,107,0.10),transparent_50%)]">
        <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
          <div id="categories" className="scroll-mt-24">
            <motion.div variants={fadeUp} className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{c.exploreLabel}</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight">{c.categoriesTitle}</h2>
              <p className="mt-3 text-slate-400">{c.categoriesSub}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {c.categories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.name}
                    onClick={() => onStart('jobseeker')}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`group relative h-72 rounded-3xl overflow-hidden text-left border border-white/10 hover:border-emerald-500 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] ${
                      index === 6 ? 'lg:col-span-1' : ''
                    }`}
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/85" />

                    <div className="absolute top-5 left-5">
                      <span className="w-11 h-11 rounded-xl bg-emerald-500/90 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:rotate-[6deg]">
                        <Icon className="w-5 h-5 text-[#04210f]" />
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-black text-xl text-white">{cat.name}</h3>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{cat.jobs}</p>
                      <div className="mt-3 text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-200">{c.salaryLabel}:</span> {cat.salary}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="font-bold text-slate-200">{c.skillsLabel}:</span> {cat.skills}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" /> {cat.growth} {c.growthLabel}
                        </span>
                        <span className="arrow w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1.5 group-hover:bg-emerald-500 group-hover:text-[#04210f]">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              {/* Featured Sector — large card */}
              <motion.button
                onClick={() => onStart('jobseeker')}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative h-72 rounded-3xl overflow-hidden text-left sm:col-span-2 lg:col-span-2 border border-emerald-500/40 hover:border-emerald-500 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer shadow-[0_0_50px_rgba(0,184,107,0.18)] hover:shadow-[0_25px_70px_rgba(0,184,107,0.35)]"
              >
                <img
                  src={c.featured.img}
                  alt={c.featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#04210f]/95 via-[#062b16]/80 to-emerald-900/40" />

                <div className="relative h-full p-7 flex flex-col justify-center max-w-md">
                  <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-[#04210f] text-[10px] font-black uppercase tracking-wider">
                    {c.featured.badge}
                  </span>
                  <h3 className="mt-4 text-3xl font-black text-white">{c.featured.title}</h3>
                  <p className="text-sm font-bold text-emerald-400 mt-1">{c.featured.jobs}</p>
                  <p className="text-sm text-slate-200 mt-2">{c.featured.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {c.featured.skills.map((sk) => (
                      <span key={sk} className="text-[11px] font-bold text-white bg-white/10 border border-white/20 px-2.5 py-1 rounded-lg">{sk}</span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex w-fit items-center gap-2 bg-emerald-500 group-hover:bg-emerald-400 text-[#04210f] font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                    {c.featured.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        </Section>
      </div>

      {/* TALENTS */}
      <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div id="talents" className="scroll-mt-24">
          <motion.div variants={fadeUp} className="max-w-2xl mb-12">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{c.talentsTitle}</h2>
            <p className="mt-3 text-slate-400">{c.talentsSub}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.talents.map((tal) => (
              <motion.div
                key={tal.name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-emerald-500/40 transition-colors"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={tal.img} alt={tal.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] to-transparent" />
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-emerald-500/90 text-[#04210f] text-[10px] font-black px-2 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="p-5 -mt-6 relative">
                  <h3 className="font-bold text-base">{tal.name}</h3>
                  <p className="text-sm text-emerald-400 font-semibold">{tal.role}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {tal.city}, Cameroon</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tal.skills.map((sk) => (
                      <span key={sk} className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{sk}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* RECRUITER DASHBOARD PREVIEW */}
      <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div id="employers" className="scroll-mt-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">For Employers</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight">{c.dashTitle}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{c.dashSub}</p>
            <ul className="mt-6 space-y-3">
              {c.dashPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <button onClick={() => onStart('employer')} className="mt-8 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#04210f] font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20">
              {c.dashCta} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <div className="rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recruiter Pipeline</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'New', value: '128', icon: Users, color: 'text-sky-400' },
                  { label: 'Interview', value: '34', icon: TrendingUp, color: 'text-amber-400' },
                  { label: 'Hired', value: '12', icon: Building2, color: 'text-emerald-400' }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <Icon className={`w-4 h-4 ${m.color}`} />
                      <div className="text-2xl font-black mt-2">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">{m.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  { n: 'Alex Ndip', r: 'Frontend Dev', s: 92 },
                  { n: 'Ngo Bella', r: 'UX Designer', s: 88 },
                  { n: 'Eric Fometeu', r: 'Data Analyst', s: 81 }
                ].map((row) => (
                  <div key={row.n} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center text-xs font-black">
                      {row.n.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{row.n}</div>
                      <div className="text-[10px] text-slate-500">{row.r}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">{row.s}%</div>
                      <div className="w-16 h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${row.s}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -z-10 -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </Section>

      {/* STORIES */}
      <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div id="stories" className="scroll-mt-24">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black tracking-tight max-w-2xl mb-12">{c.storiesTitle}</motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {c.stories.map((st) => (
              <motion.div key={st.name} variants={fadeUp} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 flex flex-col">
                <Quote className="w-7 h-7 text-emerald-500/40" />
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed flex-1">“{st.quote}”</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10">
                  <img src={st.img} alt={st.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold">{st.name}</div>
                    <div className="text-xs text-slate-500">{st.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* IMPACT */}
      <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#0a1729] to-[#08111F] border border-white/10 p-8 lg:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeUp}>
            <span className="text-3xl">🇨🇲</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight">{c.impactTitle}</h2>
            <p className="mt-3 text-slate-400">{c.impactSub}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-3">
            {c.regions.map((r, i) => {
              const pct = [100, 80, 47, 23, 20][i];
              return (
                <div key={r.name} className="flex items-center gap-4">
                  <div className="w-40 shrink-0 text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {r.name}
                  </div>
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                    />
                  </div>
                  <div className="w-20 text-right text-xs font-bold text-slate-400">{r.jobs}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-10 lg:p-16 text-center">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-[#04210f]">{c.finalTitle}</h2>
          <p className="mt-4 text-[#063a1c] font-medium max-w-xl mx-auto">{c.finalSub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center">
            <button onClick={() => onStart('jobseeker')} className="inline-flex items-center justify-center gap-2 bg-[#04210f] hover:bg-[#063019] text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer">
              {c.hero.ctaSeeker} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onStart('employer')} className="inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#04210f] font-bold text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer">
              {c.hero.ctaEmployer}
            </button>
          </div>
        </motion.div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0a1322]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Logo />
              <p className="mt-3 text-sm text-slate-500 max-w-xs">{c.footerTagline}</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-400">
              <a href="#categories" className="hover:text-white transition-colors">{c.nav.jobs}</a>
              <a href="#employers" className="hover:text-white transition-colors">{c.nav.companies}</a>
              <a href="#talents" className="hover:text-white transition-colors">{c.nav.advice}</a>
              <a href="#stories" className="hover:text-white transition-colors">{c.nav.about}</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} JOBRise Cameroon. {c.rights}</span>
            <span className="flex items-center gap-1.5">Made with care in 🇨🇲 Douala • Yaoundé • Buea</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
