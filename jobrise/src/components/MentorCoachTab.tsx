/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Send, 
  X, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  HelpCircle,
  Play,
  Star
} from 'lucide-react';
import { Mentor, InterviewQuestion } from '../types';
import { MENTORS, INTERVIEW_QUESTIONS } from '../data';
import { Language, TRANSLATIONS } from '../translations';

interface MentorCoachTabProps {
  onAwardXP: (amount: number) => void;
  prefilledMentorId?: string | null;
  onClearPrefilledMentor?: () => void;
  language: Language;
}

export default function MentorCoachTab({ 
  onAwardXP, 
  prefilledMentorId, 
  onClearPrefilledMentor,
  language
}: MentorCoachTabProps) {
  const t = TRANSLATIONS[language];
  // Selected Mentor Chat State
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'mentor'; text: string }[]>([]);
  const [userMsgInput, setUserMsgInput] = useState('');

  React.useEffect(() => {
    if (prefilledMentorId) {
      const found = MENTORS.find(m => m.id === prefilledMentorId);
      if (found) {
        // Trigger chat directly with prefilled mentor
        setActiveMentor(found);
        setChatMessages([
          { sender: 'mentor', text: `Hi there! I'm ${found.name}, specialized in ${found.specialties.slice(0, 2).join(' & ')}. Glad you connected directly from your Opportunity board! What specific layout, query, or application tips do you need today?` }
        ]);
      }
      if (onClearPrefilledMentor) {
        onClearPrefilledMentor();
      }
    }
  }, [prefilledMentorId, onClearPrefilledMentor]);

  // Interview Simulator State
  const [interviewActive, setInterviewActive] = useState(false);
  const [currentIntIdx, setCurrentIntIdx] = useState(0);
  const [userIntResponse, setUserIntResponse] = useState('');
  const [evaluated, setEvaluated] = useState(false);
  const [interviewScorecard, setInterviewScorecard] = useState<number[]>([]);
  const [interviewFinished, setInterviewFinished] = useState(false);

  // New Camera Interactivity States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera / mic not detected. Running simulation mode without live video feed.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Pre-determined Chat Prompts depending on Mentor
  const getPredefinedPrompts = (mentor: Mentor) => {
    switch (mentor.id) {
      case 'mentor-1': // Devon Tech
        return [
          { label: 'How can I stand out with my Git/GitHub portfolio?', reply: 'Focus on readable commit histories, clean Readme.md structures, and host live applet previews! Recruiters spend less than 30 seconds reviewing, so standard interactive mockups or visual layout proofs of your codes are vital.' },
          { label: 'How do I negotiate my first junior developer salary?', reply: 'Always search for regional sector averages on Glassdoor. Avoid committing to a hard number first; say, "I am open to competitive offers based on standard local developer metrics." If they press, give a logical $10k scope.' },
          { label: 'What frontend stack should I prioritize in early 2026?', reply: 'Master React v19 core states, focus on Tailwind CSS architectures for fast UI grids (like the modern v4 import structures), and get comfortable building clean database structures using simple client-server logic!' }
        ];
      case 'mentor-2': // Mayra Design
        return [
          { label: 'What is the biggest auto-layout mistake in Figma?', reply: 'Forgetting to set child elements to "Fill Container" or "Hug Contents", leading to broken text overflows when the frames are resized. Try resizing your frame back and forth to ensure elements shrink gracefully!' },
          { label: 'How do I build a UX portfolio if I lack company experience?', reply: 'Case studies! Conduct unsolicited audits of existing slow layout directories, design a polished bento-grid alternative, and write precise visual reports outlining why your structure improves user metrics.' },
          { label: 'What is your core typography recommendation for dashboards?', reply: 'Clarity and density. Pair an assertive modern display font like Outfit/Inter for high-level numbers, with clear monospace for technical labels. Limit yourself to exactly two typeface families max.' }
        ];
      case 'mentor-3': // Kaleb Marketing
        return [
          { label: 'How do I optimize organic SEO schemas?', reply: 'Use semantic tag anchors in your layouts. Write clear, descriptive headings, ensure high-contrast accessibility tags, and map out structured keyword indexes aligned with real search queries.' },
          { label: 'What skills are scaling fastest in growth marketing?', reply: 'Conversion analytics! Getting comfortable writing clean SQL queries to measure user registration funnels, and compiling structured marketing dashboards in Tableau or Recharts.' },
          { label: 'How do I pitch a startup on LinkedIn for internships?', reply: 'Send highly targeted, personalized notes. Mention a specific visual detail they published recently, write a 2-sentence value prompt, and share a clean interactive mock preview links.' }
        ];
      default:
        return [];
    }
  };

  // Launch Mentor Chatroom
  const handleStartChat = (mentor: Mentor) => {
    setActiveMentor(mentor);
    setChatMessages([
      { sender: 'mentor', text: `Hi! I'm ${mentor.name}, doing ${mentor.role} at ${mentor.company}. ${mentor.bio} What can I assist you with today?` }
    ]);
  };

  // Send message
  const handleSendMessage = (text: string) => {
    if (!text.trim() || !activeMentor) return;
    
    // Add User message
    const updatedMessages = [...chatMessages, { sender: 'user', text }];
    setChatMessages(updatedMessages);

    // Simulated Mentor typing response
    setTimeout(() => {
      // Find matches in predefined prompts or make a generic helpful statement
      const predefined = getPredefinedPrompts(activeMentor);
      const match = predefined.find(p => p.label === text);
      const replyText = match 
        ? match.reply 
        : `That's a very analytical concern! Aligned with my background in ${activeMentor.specialties.slice(0, 2).join(', ')}, my primary advise is to focus on practical, interactive evidence. Continue building mock dashboard cases and testing yourself with assessments. Ready to review specific elements?`;
      
      setChatMessages(prev => [...prev, { sender: 'mentor', text: replyText }]);
      onAwardXP(5); // Small interaction boost
    }, 1000);

    setUserMsgInput('');
  };

  // Launch Mock Interview simulator
  const handleStartInterview = () => {
    setInterviewActive(true);
    setCurrentIntIdx(0);
    setUserIntResponse('');
    setEvaluated(false);
    setInterviewScorecard([]);
    setInterviewFinished(false);
    startCamera(); // Ask for camera/mic and activate immersive preview
  };

  // Submit interview round response for review
  const handleSubmitIntResponse = () => {
    if (!userIntResponse.trim()) return;
    setEvaluated(true);
  };

  // Save score and progress
  const handleNextIntQuestion = (scoreRating: number) => {
    const updatedScores = [...interviewScorecard, scoreRating];
    setInterviewScorecard(updatedScores);
    setEvaluated(false);
    setUserIntResponse('');

    if (currentIntIdx < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentIntIdx(prev => prev + 1);
    } else {
      setInterviewFinished(true);
      setInterviewActive(false);
      stopCamera(); // Clean up camera feed stream
      onAwardXP(40); // Finish completion bonus
    }
  };

  const activeIntQuestion = INTERVIEW_QUESTIONS[currentIntIdx];

  return (
    <div id="mentor-coach-root" className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 animate-fade-in">
      
      {/* Left Column: Mentorship Directory & Chat Screen */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Hub Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Mentorship & Prep Room</h2>
          <p className="text-sm text-slate-500">Engage in rapid diagnostic advice exchanges with online leads or test yourself on mock interview templates.</p>
        </div>

        {/* Directory Card */}
        {!activeMentor ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-805 text-slate-800 text-sm flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              Available Career Mentors
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MENTORS.map((mentor) => (
                <div 
                  key={mentor.id} 
                  id={`mentor-card-${mentor.id}`}
                  className="bg-slate-50/50 p-4 border border-slate-200/50 rounded-xl flex flex-col justify-between hover:border-indigo-200 transition-all text-center space-y-3 shadow-xs"
                >
                  <div className="relative w-14 h-14 mx-auto">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${mentor.color} flex items-center justify-center text-white text-base font-extrabold`}>
                      {mentor.avatarSeed}
                    </div>
                    {mentor.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-50"></span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{mentor.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{mentor.role}</p>
                    <p className="text-[9px] text-indigo-600 font-bold">{mentor.company}</p>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-3 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {mentor.specialties.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="text-[8px] bg-slate-200 text-slate-650 px-1 py-0.5 rounded text-slate-500 truncate font-semibold">{s}</span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStartChat(mentor)}
                    className="w-full bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-extrabold text-[10px] py-1.5 rounded-lg transition-colors border border-indigo-100"
                  >
                    Consult Advice
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MENTOR LIVE CHATROOM INTERFACE */
          <div id="active-chat-frame" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[450px] animate-fade-in">
            
            {/* Header chat metadata */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${activeMentor.color} flex items-center justify-center text-white font-bold text-xs`}>
                  {activeMentor.avatarSeed}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xs leading-none">{activeMentor.name}</h3>
                  <p className="text-[9px] text-slate-400 mt-1">{activeMentor.role} • <strong className="text-indigo-600">{activeMentor.company}</strong></p>
                </div>
              </div>
              <button 
                onClick={() => setActiveMentor(null)}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                title="Exit Chatroom"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bubble lists */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-2">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-50/80 border border-slate-200/60 text-slate-850 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined prompt helpers */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block px-1">Suggested Discussion Points</span>
              <div className="flex flex-wrap gap-1.5 pb-2">
                {getPredefinedPrompts(activeMentor).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.label)}
                    className="bg-indigo-50/55 hover:bg-indigo-55 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors text-left"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              {/* Text Area line */}
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={userMsgInput}
                  onChange={(e) => setUserMsgInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userMsgInput)}
                  placeholder="Ask a custom career advice query... (or choose options above)"
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50 text-xs"
                />
                
                <button
                  onClick={() => handleSendMessage(userMsgInput)}
                  disabled={!userMsgInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl cursor-pointer disabled:opacity-40"
                  title="Send Advice Inquiry"
                >
                  <Send className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Right Column: Interactive Mock Interview Simulator */}
      <div className="lg:col-span-1">
        
        {!interviewActive && !interviewFinished && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 shrink-0" />
              <h3 className="font-extrabold text-slate-800 text-sm">Interactive Interview Simulator</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Answer real questions from tech recruiters, compare key responses with optimal outlines, and self-grade your readiness metrics.
            </p>

            <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-900">• 3 Rounds (Design, Tech, Behavior)</p>
              <p className="text-[10px] font-bold text-indigo-900">• Grade Outcomes</p>
              <p className="text-[10px] font-bold text-indigo-900">• Earn +45 Career XP</p>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/15 cursor-pointer leading-none"
            >
              Start Interview Prep <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ACTIVE INTERVIEW SIMULATOR PANEL */}
        {interviewActive && (
          <div id="active-interview-sim" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md space-y-5 animate-fade-in text-left">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                Question {currentIntIdx + 1} of {INTERVIEW_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-400 capitalize font-medium">{activeIntQuestion.role}</span>
            </div>

            {/* IMMERSIVE LIVE CAMERA PLAYER VIEWPORT */}
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-center items-center">
              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <div className="animate-ping w-3 h-3 rounded-full bg-indigo-500 mx-auto"></div>
                  <p className="text-[10px] text-slate-400 font-mono px-3">
                    {cameraError || 'Activate camera & microphone permissions for conferencing mode...'}
                  </p>
                </div>
              )}
              {/* Overlay elements */}
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono font-black text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SIMULATED CONFERENCING
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-slate-900/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                CAM_REC : ACTIVE
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-950 font-mono block mb-1">Recruiter query:</span>
              <p className="font-extrabold text-slate-800 text-sm leading-relaxed">{activeIntQuestion.question}</p>
            </div>

            {/* Answer Editor or assessment feedback */}
            {!evaluated ? (
              <div className="space-y-3">
                <textarea
                  value={userIntResponse}
                  onChange={(e) => setUserIntResponse(e.target.value)}
                  rows={4}
                  placeholder="Record your simulated response summary here... Outline key actions followed by numeric result details."
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-slate-50 focus:bg-white resize-none"
                ></textarea>
                
                <button
                  disabled={!userIntResponse.trim()}
                  onClick={handleSubmitIntResponse}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-2.5 rounded-xl cursor-pointer disabled:opacity-40 transition-opacity"
                >
                  Submit & Evaluate Answer
                </button>
              </div>
            ) : (
              /* REAL EVALUATION FEEDBACK COMPONENT */
              <div className="space-y-4 animate-fade-in bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                
                {/* Recruiting coach instructions */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Key Outline Tips:
                  </h4>
                  <p className="text-[10.5px] text-slate-650 text-slate-600 leading-relaxed italic">{activeIntQuestion.tips}</p>
                </div>

                {/* Candidate Outline */}
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Ideal outline structure:</h4>
                  <ul className="space-y-1 pl-1">
                    {activeIntQuestion.idealOutline.map((point, idx) => (
                      <li key={idx} className="text-[10px] text-slate-600 flex items-center gap-1">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Self evaluation grading trigger */}
                <div className="space-y-1.5 border-t border-slate-150 pt-2.5">
                  <h4 className="text-[10px] uppercase font-bold text-indigo-900 block text-center">Rate your response depth:</h4>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleNextIntQuestion(star)}
                        className="p-1 rounded hover:bg-white hover:scale-105 transition-all text-amber-400"
                        title={`${star} Star Rating`}
                      >
                        <Star className="w-5 h-5 fill-amber-400" />
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 text-center block">Clicking a star records score and proceeds</span>
                </div>

              </div>
            )}

            <button 
              onClick={() => {
                setInterviewActive(false);
                stopCamera();
              }}
              className="text-[10px] text-red-500 hover:text-red-700 block text-center font-bold mx-auto pt-2 cursor-pointer"
            >
              Force Quit prep
            </button>
          </div>
        )}

        {/* INTERVIEW SUMMARY COMPLETION OVERLAY */}
        {interviewFinished && (
          <div id="interview-completion-banner" className="bg-white p-5 rounded-2xl border border-emerald-150 shadow-md text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg mx-auto shadow-inner">
              🏅
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Round Concluded!</h3>
              <p className="text-[11px] text-slate-400 mt-1">Excellent performance. You spent valuable time reviewing critical recruitment standards.</p>
              
              <div className="mt-3 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-none">
                <span className="font-semibold text-slate-500">Average Self Evaluation Rating:</span><br />
                <strong className="text-slate-800 text-sm font-bold mt-1 block">
                  {Math.round((interviewScorecard.reduce((a, b) => a + b, 0) / Math.max(1, interviewScorecard.length)) * 10) / 10} / 5.0 Stars
                </strong>
              </div>

              <p className="text-[10px] text-indigo-600 font-extrabold mt-3 flex items-center justify-center gap-1 animate-bounce">
                🎉 +40 Career XP added!
              </p>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2 rounded-lg"
            >
              Restart New Prep
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
