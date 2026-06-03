/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Play, 
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import { Course, QuizQuestion } from '../types';
import { SKILL_QUIZ } from '../data';
import { Language, TRANSLATIONS } from '../translations';

interface SkillsHubTabProps {
  courses: Course[];
  userStats: {
    points: number;
    level: number;
    certifiedCount: number;
    skills: string[];
  };
  onCompleteCourse: (courseId: string, skillsUnlocked: string[]) => void;
  onAddCertification: (certName: string) => void;
  certificationsList: string[];
  language: Language;
}

export default function SkillsHubTab({ 
  courses, 
  userStats, 
  onCompleteCourse, 
  onAddCertification,
  certificationsList,
  language
}: SkillsHubTabProps) {
  const t = TRANSLATIONS[language];
  // Quiz states
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Simulated Lecture state for learning
  const [activeLearningCourse, setActiveLearningCourse] = useState<Course | null>(null);
  const [lectureSlide, setLectureSlide] = useState(1);

  // Start the Quiz
  const handleStartQuiz = () => {
    setQuizActive(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  // Select Option
  const handleSelectOption = (idx: number) => {
    if (selectedAnswerIdx !== null) return; // Prevent double select
    setSelectedAnswerIdx(idx);
    setShowExplanation(true);
    if (idx === SKILL_QUIZ[currentQuestionIdx].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    setSelectedAnswerIdx(null);
    setShowExplanation(false);
    if (currentQuestionIdx < SKILL_QUIZ.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      // If score is 4 or 5 out of 5, award certification!
      if (quizScore >= 4 && !certificationsList.includes('Youth Professional Core Credentials')) {
        onAddCertification('Youth Professional Core Credentials');
      }
    }
  };

  // Simulate study step
  const handleSimulateStudy = (course: Course) => {
    setActiveLearningCourse(course);
    setLectureSlide(1);
  };

  // Next Lecture Slide
  const handleNextSlide = () => {
    if (lectureSlide < 3) {
      setLectureSlide(prev => prev + 1);
    } else if (activeLearningCourse) {
      // complete course!
      onCompleteCourse(activeLearningCourse.id, activeLearningCourse.skillsUnlocked);
      setActiveLearningCourse(null);
    }
  };

  const activeQuizQuestion = SKILL_QUIZ[currentQuestionIdx];

  return (
    <div id="skills-hub-root" className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 animate-fade-in">
      
      {/* Middle/Left Areas: Active Courses & Quiz Modules */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Hub Titles */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Skills & Insights Academy</h2>
          <p className="text-sm text-slate-500">Acquire micro-certifications regarding modern development, UX layouts, and marketing workflows.</p>
        </div>

        {/* ACTIVE COURSES BRIEF */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 animate-pulse" />
                Active Career Courses
              </h3>
              <p className="text-xs text-slate-400">Finish each brief to unlock matching profile score updates</p>
            </div>
            <span className="text-xs text-indigo-650 text-indigo-600 font-bold">
              {courses.filter(c => c.completed).length} / {courses.length} Completed
            </span>
          </div>

          {/* Interactive Course list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-colors shadow-sm ${
                  course.completed 
                    ? 'bg-slate-50 border-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider font-mono">
                      {course.category}
                    </span>
                    {course.completed ? (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" /> Done
                      </span>
                    ) : (
                      <span className="text-[9px] bg-slate-100 text-slate-650 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{course.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">By {course.provider} • {course.level}</p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        course.completed ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  {/* Course Action Buttons */}
                  {!course.completed && (
                    <button
                      onClick={() => handleSimulateStudy(course)}
                      className="mt-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-150 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 text-indigo-700 fill-indigo-700" /> Study & Boost
                    </button>
                  )}
                  {course.completed && (
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3" /> Unlocked: {course.skillsUnlocked.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* LECTURE PLAY VIEW INTERFACE */}
        {activeLearningCourse && (
          <div id="lecture-briefcase-frame" className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-950/25 space-y-4 animate-fade-in border border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin-slow w-2.5 h-2.5 rounded-full bg-indigo-505 bg-indigo-500"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecture Lab Room • {activeLearningCourse.title}</span>
              </div>
              <button 
                onClick={() => setActiveLearningCourse(null)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                Quit Class
              </button>
            </div>

            <div className="py-4 space-y-3">
              {lectureSlide === 1 && (
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-1.5 leading-tight">
                    <span className="text-indigo-400">01.</span> Core Architectural Constraints & Framework Variables
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    When optimizing user applications or databases, always prioritize component stability and lazy client loadings. Reducing browser rendering overhead increases user satisfaction and ranks you highest in recruiter algorithms.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400">
                    // Rule: avoid global mutation in React renders<br />
                    const memoValue = useMemo(() =&gt; calculateHeavyMetrics(props), [props.deps]);
                  </div>
                </div>
              )}

              {lectureSlide === 2 && (
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-1.5 leading-tight">
                    <span className="text-indigo-400">02.</span> Figma Layout Consistency & Design Variables
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Always align coordinates with adaptive padding parameters. Hardcoding layouts leads to layout breaks on different viewport configurations. Auto-Layout mimics standard HTML CSS flex directives perfectly.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-pink-400">
                    // Constraint Token Reference:<br />
                    --spacing-gutter: clamp(1rem, 2.5vw, 2.5rem);
                  </div>
                </div>
              )}

              {lectureSlide === 3 && (
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-1.5 leading-tight">
                    <span className="text-indigo-400">03.</span> Organic Search Optimization & Content Authority
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Never overflow pages with identical keywords (stuffing). Ensure clean backlink indexing from authoritative domains. Use semantic tag formats in HTML (`article`, `section`, `header`) to let crawler indexes prioritize your headers.
                  </p>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-[11px] text-sky-400">
                    &lt;article&gt;<br />
                    &nbsp;&nbsp;&lt;h1&gt;Core Industry Solutions&lt;/h1&gt;<br />
                    &lt;/article&gt;
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs msg-actions">
              <span className="text-slate-400">Concept Slide {lectureSlide} of 3</span>
              <button 
                onClick={handleNextSlide}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-all"
              >
                {lectureSlide === 3 ? 'Complete Course & Graduate 🎓' : 'Continue Lecture'} <ChevronRight className="w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* INTERACTIVE ASSESSMENT QUIZ */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Skills Core Benchmark Assessment</h3>
              <p className="text-xs text-slate-400">Validate specialized frontend, design auto-layouts, SEO logic, and proxy guidelines.</p>
            </div>
            {!quizActive && !quizCompleted && (
              <button 
                onClick={handleStartQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Begin Skills Brief
              </button>
            )}
          </div>

          {/* Quiz Active Interface */}
          {quizActive && !quizCompleted && (
            <div id="active-quiz-container" className="p-5 bg-indigo-50/40 rounded-xl border border-indigo-100/60 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-900 font-extrabold uppercase tracking-wide">Question {currentQuestionIdx + 1} of {SKILL_QUIZ.length}</span>
                <span className="text-slate-400 font-mono">Current Grade: {quizScore} / {SKILL_QUIZ.length}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-25 bg-slate-200 rounded-full h-1">
                <div 
                  className="bg-indigo-600 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIdx) / SKILL_QUIZ.length) * 100}%` }}
                ></div>
              </div>

              <h4 className="font-extrabold text-slate-800 text-sm leading-relaxed pt-2">
                {activeQuizQuestion.question}
              </h4>

              {/* Options list */}
              <div id="quiz-options" className="space-y-2.5">
                {activeQuizQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswerIdx === idx;
                  const isCorrectAnswer = idx === activeQuizQuestion.correctIndex;
                  const showAsCorrect = selectedAnswerIdx !== null && isCorrectAnswer;
                  const showAsIncorrect = selectedAnswerIdx !== null && isSelected && !isCorrectAnswer;

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswerIdx !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all border flex justify-between items-center ${
                        showAsCorrect 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : showAsIncorrect
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : isSelected
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                          : 'bg-white border-slate-250 border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{option}</span>
                      {selectedAnswerIdx !== null && isCorrectAnswer && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Context Explanation */}
              {showExplanation && (
                <div className="mt-4 p-3.5 bg-white border border-slate-200 rounded-xl text-xs animate-fade-in shadow-sm">
                  <div className="flex gap-2 items-start">
                    <HelpCircle className="w-4 h-4 text-indigo-600 mt-1 shrink-0" />
                    <div>
                      <p className="font-extrabold text-indigo-950 mb-1">Concept Insight</p>
                      <p className="text-slate-650 leading-relaxed text-slate-600">{activeQuizQuestion.explanation}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={handleNextQuestion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      {currentQuestionIdx === SKILL_QUIZ.length - 1 ? 'Analyze Outcomes' : 'Next Question'} <ArrowRight className="w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Outcome State */}
          {quizCompleted && (
            <div id="quiz-completed-panel" className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-150 border-indigo-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
                {quizScore >= 4 ? '🏅' : '📚'}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">
                  {quizScore >= 4 ? 'Assessment Succeeded!' : 'Keep Studying!'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">You solved {quizScore} out of {SKILL_QUIZ.length} challenges successfully.</p>
              </div>

              {quizScore >= 4 ? (
                <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl max-w-sm mx-auto">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-emerald-900">Credential Issued</p>
                  <p className="text-[11px] text-emerald-600 mt-1"><strong>"Youth Professional Core Badge"</strong> is locked to your profile. Select opportunities can now be applied to.</p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-150 p-4 rounded-xl max-w-sm mx-auto">
                  <p className="text-xs font-bold text-amber-900">Score Requirement: 80% (4/5)</p>
                  <p className="text-[11px] text-amber-600 mt-1">Unlock recommendations by checking lectures above, then retry!</p>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-3">
                <button 
                  onClick={handleStartQuiz}
                  className="bg-white hover:bg-slate-100 text-slate-650 text-slate-700 border border-slate-200 font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5" /> Retry Brief
                </button>
                {quizScore >= 4 && (
                  <button 
                    onClick={() => setQuizCompleted(false)}
                    className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold text-xs py-2 px-4 rounded-lg"
                  >
                    Close Result
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Non Active Default */}
          {!quizActive && !quizCompleted && (
            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/80">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Ready to challenge the benchmark?</p>
              <p className="text-[10px] text-slate-400 mt-1">Get 80% or better to pin the core certified tag to your user profile card.</p>
            </div>
          )}

        </div>

      </div>

      {/* Right Column: Certifications Wallet */}
      <div id="certifications-wallet" className="lg:col-span-1 space-y-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 shrink-0" />
            <h3 className="font-extrabold text-slate-805 text-slate-800 text-sm">Your Certified Badges</h3>
          </div>
          
          <div className="space-y-3">
            {certificationsList.length === 0 ? (
              <div className="text-center py-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200/60">
                <Shield className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <h4 className="text-[11px] font-bold text-slate-650 text-slate-600">Wallet is Empty</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Pass the Skills Core quiz or complete React lessons to gain visual credentials.</p>
              </div>
            ) : (
              certificationsList.map((cert, index) => (
                <div 
                  key={index} 
                  id={`badge-cert-${index}`}
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl border border-indigo-700/20 shadow-md relative overflow-hidden flex items-start gap-3 transform hover:scale-[1.02] transition-transform"
                >
                  {/* Subtle Glowing circles */}
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg shrink-0 shadow-inner">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xs mb-0.5">{cert}</h4>
                    <p className="text-[9px] text-indigo-150 text-indigo-200 uppercase tracking-widest font-mono">Status: Active Security Checked</p>
                    <div className="flex items-center gap-1 mt-2 text-[8px] text-indigo-100 bg-indigo-700/50 px-1.5 py-0.5 rounded-md w-max font-semibold">
                      <Clock className="w-2 h-2 text-indigo-200" />
                      Issued: June 2026
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>

        {/* Dynamic Skill Tags List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Active Profile Skills</h3>
          {userStats.skills.length === 0 ? (
            <p className="text-xs text-slate-400">Complete active course lessons to populate your stack profile.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {userStats.skills.map((skill) => (
                <span key={skill} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
