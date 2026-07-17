import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCheatingDetection } from '../../hooks/useCheatingDetection';
import api from '../../services/api';
import ChatBubble from '../../components/Chat/ChatBubble';
import Loader from '../../components/Common/Loader';
import { Send, Clock, AlertTriangle, ShieldCheck, Play, ArrowRight, CornerDownLeft } from 'lucide-react';

const AssessmentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume');

  // Chat message logs
  const [messages, setMessages] = useState([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  // Profile collection state variables
  const [profileStep, setProfileStep] = useState('name');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    employeeId: '',
    department: '',
    jobRole: '',
    experience: '',
    skills: '',
    certificationLevel: '',
  });

  // Active exam states
  const [assessmentId, setAssessmentId] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNum, setQuestionNum] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // String or Array for MSQ

  // Timers and violations
  const [timer, setTimer] = useState(60);
  const [cheatingCount, setCheatingCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTerminated, setIsTerminated] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(false);

  const chatEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  // Initial Greet or Resume Fetch
  useEffect(() => {
    const init = async () => {
      if (resumeId) {
        // Resuming an existing assessment
        setLoadingResume(true);
        try {
          const { data } = await api.get(`/api/assessments/${resumeId}/question`);
          if (data.status === 'terminated') {
            setIsTerminated(true);
          } else if (data.status === 'completed') {
            navigate(`/results/${resumeId}`);
          } else {
            setAssessmentId(resumeId);
            setQuestionNum(data.questionIndex);
            setTotalQuestions(data.totalQuestions);
            setCurrentQuestion(data.question);
            setTimer(data.question.timerDuration);
            setIsTesting(true);
            setProfileStep('testing');
            
            // Build greeting
            setMessages([
              { sender: 'ai', text: `Resuming assessment in progress. We are at question ${data.questionIndex} of ${data.totalQuestions}.` }
            ]);
          }
        } catch (err) {
          console.error(err);
          // Fallback to fresh setup
          startFreshSetup();
        } finally {
          setLoadingResume(false);
        }
      } else {
        startFreshSetup();
      }
    };
    init();
  }, [resumeId]);

  const [loadingResume, setLoadingResume] = useState(false);

  const startFreshSetup = () => {
    setIsAgentTyping(true);
    setTimeout(() => {
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I am your AI Assessment Agent. I will generate a personalized certification assessment for you. Let's configure your profile.\n\nFirst, please verify your Full Name:`,
        },
      ]);
      setIsAgentTyping(false);
    }, 800);
  };

  // Assessment individual question timer ticking
  useEffect(() => {
    if (!isTesting || !currentQuestion || isTerminated || gradingProgress) return;

    // Reset interval on question update
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleTimeOutSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTesting, currentQuestion, isTerminated, gradingProgress]);

  // Cheating hook hookup
  const handleWarningDetected = (eventType, count) => {
    setCheatingCount(count);
    setWarningMessage(`Warning: ${eventType} detected! Multiple security violations will automatically fail and discard your assessment.`);
    setShowWarningModal(true);
  };

  const handleTerminationTriggered = () => {
    setIsTerminated(true);
    setIsTesting(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  useCheatingDetection(assessmentId, isTesting, handleWarningDetected, handleTerminationTriggered);

  // Submit on timeout
  const handleTimeOutSubmit = async () => {
    if (!assessmentId || !currentQuestion) return;
    
    // Auto submit unanswered
    try {
      await api.post(`/api/assessments/${assessmentId}/answer`, {
        questionId: currentQuestion._id,
        answerText: '',
        timeTaken: currentQuestion.timerDuration,
        isUnanswered: true,
      });

      appendAiMessage(`Timer expired! Moving to the next question.`);
      loadNextQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  // Append AI text agent bubble helper
  const appendAiMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'ai', text }]);
  };

  // Profile input step handler
  const handleProfileInputSubmit = (value) => {
    if (!value.trim()) return;

    // Append candidate message
    setMessages((prev) => [...prev, { sender: 'user', text: value }]);
    setInputVal('');

    // Advance states
    switch (profileStep) {
      case 'name':
        setProfile((prev) => ({ ...prev, name: value }));
        setProfileStep('empId');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage(`Thanks, ${value}. What is your Employee ID? (This is optional, type 'skip' to ignore)`);
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'empId':
        setProfile((prev) => ({ ...prev, employeeId: value.toLowerCase() === 'skip' ? '' : value }));
        setProfileStep('dept');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('Which Department do you work in?');
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'dept':
        setProfile((prev) => ({ ...prev, department: value }));
        setProfileStep('role');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('What is your exact Job Role? (e.g. Senior Frontend Engineer, Full Stack Developer)');
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'role':
        setProfile((prev) => ({ ...prev, jobRole: value }));
        setProfileStep('experience');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('How many Years of Experience do you possess in this role?');
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'experience':
        if (isNaN(value)) {
          appendAiMessage('Please enter a valid numeric value for your years of experience.');
          return;
        }
        setProfile((prev) => ({ ...prev, experience: Number(value) }));
        setProfileStep('skills');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('List your core Skills (comma separated, e.g. React, Node.js, MongoDB, JavaScript):');
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'skills':
        setProfile((prev) => ({ ...prev, skills: value }));
        setProfileStep('level');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('Select your target Certification Level (Choose from the buttons below or type Beginner, Intermediate, or Advanced):');
          setIsAgentTyping(false);
        }, 600);
        break;

      case 'level':
        const cleanVal = value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(cleanVal)) {
          appendAiMessage("Please choose a valid level: 'Beginner', 'Intermediate', or 'Advanced'.");
          return;
        }
        
        const finalProfile = { ...profile, certificationLevel: cleanVal };
        setProfile(finalProfile);
        setProfileStep('ready');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage(`Perfect! I have compiled your credentials profile.\n\nLevel: ${cleanVal}\nRole: ${finalProfile.jobRole}\nSkills: ${finalProfile.skills}\n\nI will analyze your details and generate a personalized ${cleanVal} adaptive assessment containing 20 custom questions.\n\nReady to start?`);
          setIsAgentTyping(false);
        }, 800);
        break;

      default:
        break;
    }
  };

  // Launch assessment API
  const handleStartExam = async () => {
    setIsAgentTyping(true);
    try {
      const { data } = await api.post('/api/assessments/start', profile);
      setAssessmentId(data.assessmentId);
      setTotalQuestions(data.totalQuestions);
      
      // Request Fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen request blocked by browser. Continuing...', err);
        });
      }

      setProfileStep('testing');
      setIsTesting(true);
      
      // Fetch first question
      const qRes = await api.get(`/api/assessments/${data.assessmentId}/question`);
      setQuestionNum(qRes.data.questionIndex);
      setCurrentQuestion(qRes.data.question);
      setTimer(qRes.data.question.timerDuration);
      
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Welcome to the active exam interface. We have generated exactly 20 questions based on your profile.\n\nRules:\n1. Solve one question at a time.\n2. Timers tick individually.\n3. Exiting fullscreen/switching tabs is tracked.\n\nLet's begin with Question 1!` }
      ]);
    } catch (err) {
      console.error(err);
      appendAiMessage('An error occurred during assessment generation. Please try starting again.');
    } finally {
      setIsAgentTyping(false);
    }
  };

  // Load next question
  const loadNextQuestion = async () => {
    setSelectedAnswer(null);
    try {
      const { data } = await api.get(`/api/assessments/${assessmentId}/question`);
      
      if (data.status === 'completed') {
        // Assessment finished, transition to grading loader
        setIsTesting(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => console.log(err));
        }
        runPostGradingAI();
      } else {
        setQuestionNum(data.questionIndex);
        setCurrentQuestion(data.question);
        setTimer(data.question.timerDuration);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run final AI evaluation
  const runPostGradingAI = async () => {
    setGradingProgress(true);
    try {
      await api.post(`/api/assessments/${assessmentId}/evaluate`);
      navigate(`/results/${assessmentId}`);
    } catch (err) {
      console.error(err);
      setGradingProgress(false);
      appendAiMessage('Evaluation error occurred. Please contact admin.');
    }
  };

  // Submit Answer Action
  const handleSubmitActiveAnswer = async () => {
    if (!selectedAnswer && selectedAnswer !== '' && currentQuestion.type !== 'Short' && currentQuestion.type !== 'Long' && currentQuestion.type !== 'Scenario' && currentQuestion.type !== 'Logical' && currentQuestion.type !== 'Analytical') {
      alert('Please provide or select an answer before proceeding.');
      return;
    }

    const timeTaken = currentQuestion.timerDuration - timer;

    try {
      // Append candidate response bubble
      const answerDisplay = Array.isArray(selectedAnswer) 
        ? selectedAnswer.join(', ') 
        : (selectedAnswer || 'Answer submitted');
        
      setMessages((prev) => [...prev, { sender: 'user', text: answerDisplay }]);
      
      await api.post(`/api/assessments/${assessmentId}/answer`, {
        questionId: currentQuestion._id,
        answerText: selectedAnswer || '',
        timeTaken,
      });

      loadNextQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  // Restart terminated exam
  const handleRestartExam = () => {
    setIsTerminated(false);
    setAssessmentId(null);
    setIsTesting(false);
    setProfileStep('name');
    startFreshSetup();
  };

  if (loadingResume) return <Loader message="Retrieving ongoing assessment..." fullScreen />;
  if (gradingProgress) return <Loader message="Analyzing results. Calculating subject topic competence and writing final feedback summary report..." fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[82vh] flex flex-col justify-between">
      
      {/* 1. DISQUALIFIED SCREEN */}
      {isTerminated ? (
        <div className="bg-slate-900 border-2 border-red-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 my-auto text-center shadow-xl">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-bounce" />
          <h2 className="text-2xl font-extrabold text-white">Assessment Disqualified</h2>
          <p className="text-sm text-slate-400 max-w-md">
            The security integrity system logged 3 or more tab switching/exit-fullscreen events. This attempt has been permanently discarded.
          </p>
          <button
            onClick={handleRestartExam}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Restart New Assessment
          </button>
        </div>
      ) : (
        <>
          {/* Active test stats banner */}
          {isTesting && currentQuestion && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap justify-between items-center space-y-2 sm:space-y-0 shadow-md">
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="text-primary-400">Exam: Active</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-300">Question {questionNum} / {totalQuestions}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400 uppercase tracking-wider">{currentQuestion.type}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Timer badge */}
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border 
                  ${timer <= 15 
                    ? 'bg-red-950/20 border-red-800 text-red-400 animate-pulse' 
                    : 'bg-slate-950 border-slate-800 text-slate-300'}`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{timer}s left</span>
                </div>
                {/* Violation tracker */}
                <div className="text-[10px] text-red-500 font-semibold uppercase">
                  Violations: {cheatingCount} / 3
                </div>
              </div>
            </div>
          )}

          {/* 2. CHAT BUBBLE CONSOLE AREA */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mt-4 max-h-[55vh] border-b border-slate-900 pb-4">
            {messages.map((m, idx) => (
              <ChatBubble key={idx} sender={m.sender} text={m.text} />
            ))}
            {isAgentTyping && <ChatBubble sender="ai" isTyping />}
            <div ref={chatEndRef}></div>
          </div>

          {/* 3. CONTROLS / INPUT PANEL */}
          <div className="mt-4 pt-2">
            
            {/* Setup Options rendering */}
            {!isTesting && (
              <>
                {profileStep === 'level' && (
                  <div className="flex flex-wrap gap-3 mb-4 justify-center">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleProfileInputSubmit(lvl)}
                        className="px-5 py-2 bg-slate-900 border border-slate-800 hover:border-primary-500 rounded-xl text-sm font-semibold transition-all"
                      >
                        {lvl} Level
                      </button>
                    ))}
                  </div>
                )}

                {profileStep === 'ready' && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={handleStartExam}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/10"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Fullscreen Assessment</span>
                    </button>
                  </div>
                )}

                {/* Normal text collector input */}
                {profileStep !== 'level' && profileStep !== 'ready' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProfileInputSubmit(inputVal);
                    }}
                    className="flex space-x-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 items-center"
                  >
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Type your response here..."
                      className="flex-1 bg-transparent py-2 px-3 text-sm focus:outline-none text-slate-100 placeholder-slate-600"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors active:scale-95 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Active exam questions input rendering */}
            {isTesting && currentQuestion && (
              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-5 relative">
                {/* Question display */}
                <div className="space-y-1">
                  <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Active Question</span>
                  <p className="text-sm font-bold text-white leading-relaxed">{currentQuestion.text}</p>
                </div>

                {/* MCQ Options rendering */}
                {currentQuestion.type === 'MCQ' && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((opt, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all
                          ${selectedAnswer === opt 
                            ? 'bg-primary-950 border-primary-500 text-primary-300' 
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'}`}
                      >
                        <input
                          type="radio"
                          name="mcq"
                          value={opt}
                          checked={selectedAnswer === opt}
                          onChange={() => setSelectedAnswer(opt)}
                          className="sr-only"
                        />
                        <span className="font-mono text-xs w-5 h-5 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* MSQ Options rendering */}
                {currentQuestion.type === 'MSQ' && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const ansArray = Array.isArray(selectedAnswer) ? selectedAnswer : [];
                      const isSelected = ansArray.includes(opt);
                      
                      const handleCheckboxToggle = () => {
                        if (isSelected) {
                          setSelectedAnswer(ansArray.filter(v => v !== opt));
                        } else {
                          setSelectedAnswer([...ansArray, opt]);
                        }
                      };

                      return (
                        <label
                          key={idx}
                          className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all
                            ${isSelected 
                              ? 'bg-primary-950 border-primary-500 text-primary-300' 
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleCheckboxToggle}
                            className="sr-only"
                          />
                          <span className="font-mono text-xs w-5 h-5 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full">{String.fromCharCode(65 + idx)}</span>
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer text block rendering */}
                {currentQuestion.type === 'Short' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedAnswer || ''}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Type your short answer response..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-100 placeholder-slate-700"
                    />
                  </div>
                )}

                {/* Long, Scenario, Logical, Analytical Text Area rendering */}
                {['Long', 'Scenario', 'Logical', 'Analytical'].includes(currentQuestion.type) && (
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={selectedAnswer || ''}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Write your comprehensive analysis response here... (Pseudocode or detailed steps welcome)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-100 placeholder-slate-700 resize-none"
                    />
                  </div>
                )}

                {/* Submission button */}
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={handleSubmitActiveAnswer}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-xs transition-all hover:shadow-lg shadow-primary-600/10 active:scale-95"
                  >
                    <span>Submit & Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* 4. SECURITY WARNING MODAL */}
          {showWarningModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white">Security Alert</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{warningMessage}</p>
                <div className="text-xs text-red-500 font-bold uppercase tracking-wider">
                  Violations: {cheatingCount} / 3
                </div>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-white font-semibold rounded-xl text-xs transition-all"
                >
                  Acknowledge & Resume
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AssessmentPage;
