import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCheatingDetection } from '../../hooks/useCheatingDetection';
import api from '../../services/api';
import Loader from '../../components/Common/Loader';
import { Clock } from 'lucide-react';
import RulesView from './components/RulesView';
import DisqualifiedView from './components/DisqualifiedView';
import SubmitConfirmModal from './components/SubmitConfirmModal';
import WarningModal from './components/WarningModal';
import QuestionControls from './components/QuestionControls';
import ChatConsole from './components/ChatConsole';
import { PERSONA_BRIEFS } from './constants';


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
  const [profileStep, setProfileStep] = useState('useCases');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    employeeId: user?.employeeId || '',
    department: user?.department || 'Engineering',
    useCases: '',
    projectsCount: '',
    experience: '',
    responsibility: '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
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
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [terminationReason, setTerminationReason] = useState('security'); // 'security' or 'user-abort'

  const chatEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  // Keep local fullscreen state in sync so we can show a re-enter action.
  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreenActive(Boolean(document.fullscreenElement));
    };

    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

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
          text: `Hello! I am your AI Assessment Agent. I will configure your persona to generate a custom certification assessment for you.\n\nFirst, what are your primary Use Cases or target domains? (e.g. LLM integration, Fullstack development, Web automation):`,
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
    setTerminationReason('security');
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

      setMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          text: `Question ${questionNum}: ${currentQuestion.text}\n\nAnswer: Unanswered (time expired)`
        }
      ]);
      appendAiMessage(`Timer expired! Moving to the next question.`);
      loadNextQuestion();
    } catch (err) {
      console.error(err);
    }
  };

  const requestExamFullscreen = async () => {
    if (!document.documentElement.requestFullscreen) return;
    if (document.fullscreenElement) return;

    try {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    } catch (err) {
      console.warn('Fullscreen request blocked by browser. Continuing...', err);
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
      case 'useCases':
        setProfile((prev) => ({ ...prev, useCases: value }));
        setProfileStep('projectsCount');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('How many projects have you built or deployed?');
          setIsAgentTyping(false);
          setInputVal('');
        }, 600);
        break;

      case 'projectsCount':
        if (isNaN(value) || Number(value) < 0) {
          appendAiMessage('Please enter a valid numeric value for the number of projects.');
          return;
        }
        setProfile((prev) => ({ ...prev, projectsCount: Number(value) }));
        setProfileStep('experience');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('How many years of professional experience do you have?');
          setIsAgentTyping(false);
          setInputVal('');
        }, 600);
        break;

      case 'experience':
        if (isNaN(value) || Number(value) < 0) {
          appendAiMessage('Please enter a valid numeric value for your years of experience.');
          return;
        }
        setProfile((prev) => ({ ...prev, experience: Number(value) }));
        setProfileStep('responsibility');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('Describe your core Roles and Responsibilities in your projects/team:');
          setIsAgentTyping(false);
          setInputVal('');
        }, 600);
        break;

      case 'responsibility':
        setProfile((prev) => ({ ...prev, responsibility: value }));
        setProfileStep('skillsTools');
        setIsAgentTyping(true);
        setTimeout(() => {
          appendAiMessage('What core Skills and Tools are you familiar with? (comma separated, e.g. React, Node.js, Docker, Git):');
          setIsAgentTyping(false);
          setInputVal('');
        }, 600);
        break;

      case 'skillsTools':
        const skillsVal = value;
        const projCount = Number(profile.projectsCount) || 0;
        const yearsExp = Number(profile.experience) || 0;
        const respLower = profile.responsibility.toLowerCase();
        const skillsLower = skillsVal.toLowerCase();

        // Calculate level automatically based on experience, projects count, roles, and skills
        let calculatedLevel = 'Beginner';
        if (yearsExp === 0 && projCount === 0) {
          calculatedLevel = 'Beginner';
        } else if (yearsExp >= 5 || projCount >= 5 || (yearsExp >= 3 && (respLower.includes('lead') || respLower.includes('architect') || respLower.includes('senior') || respLower.includes('design') || respLower.includes('manage')))) {
          calculatedLevel = 'Advanced';
        } else if (yearsExp >= 2 || projCount >= 2 || respLower.includes('developer') || respLower.includes('engineer') || skillsLower.split(',').length >= 3) {
          calculatedLevel = 'Intermediate';
        }

        const finalProfile = {
          name: profile.name,
          employeeId: user?.employeeId || 'EMP-TEMP',
          department: user?.department || 'Engineering',
          jobRole: profile.responsibility || 'Developer',
          experience: yearsExp, // map years of experience to schema experience parameter
          skills: skillsVal,
          certificationLevel: calculatedLevel
        };

        setProfile(finalProfile);
        setProfileStep('ready');
        setIsAgentTyping(true);

        const briefPoints = PERSONA_BRIEFS[calculatedLevel].map((pt, idx) => `${idx + 1}. ${pt}`).join('\n');

        setTimeout(() => {
          appendAiMessage(`Perfect! I have analyzed your persona details and suggested the target certification path.

**Suggested Certification Level:** ${calculatedLevel} (decided based on your profile inputs)
* Use Cases: ${profile.useCases || 'General'}
* Projects Deployed: ${projCount}
* Experience: ${yearsExp} Years
* Responsibilities: ${finalProfile.jobRole}
* Skills: ${finalProfile.skills}

---

### Recommended Level Persona Brief
To succeed at the **${calculatedLevel}** tier, you should have the following roles, responsibilities, and skillsets:

${briefPoints}

---

Ready to proceed to the exam rules review?`);
          setIsAgentTyping(false);
          setInputVal('');
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
      // Request fullscreen while the click gesture is still active.
      await requestExamFullscreen();

      const { data } = await api.post('/api/assessments/start', profile);
      setAssessmentId(data.assessmentId);
      setTotalQuestions(data.totalQuestions);

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

      setMessages((prev) => [
        ...prev,
        {
          sender: 'user',
          text: `Question ${questionNum}: ${currentQuestion.text}\n\nAnswer: ${answerDisplay}`
        }
      ]);

      await api.post(`/api/assessments/${assessmentId}/answer`, {
        questionId: currentQuestion._id,
        answerText: selectedAnswer || '',
        timeTaken,
      });

      loadNextQuestion();
    } catch (err) {
      console.error(err);
    }
  }
  // Handle click on the Submit button
  const handleSubmitExamClick = () => {
    if (questionNum === totalQuestions) {
      if (!selectedAnswer && selectedAnswer !== '' && currentQuestion.type !== 'Short' && currentQuestion.type !== 'Long' && currentQuestion.type !== 'Scenario' && currentQuestion.type !== 'Logical' && currentQuestion.type !== 'Analytical') {
        alert('Please provide or select an answer before submitting.');
        return;
      }
    }
    setShowSubmitConfirmModal(true);
  };

  // Prematurely terminate assessment
  const handleTerminateExamPrematurely = async () => {
    try {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      await api.post(`/api/assessments/${assessmentId}/terminate`);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      setIsTerminated(true);
      setTerminationReason('user-abort');
      setIsTesting(false);
      setShowSubmitConfirmModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Final successful submit of assessment
  const handleFinalSuccessfulSubmit = async () => {
    try {
      const timeTaken = currentQuestion.timerDuration - timer;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      await api.post(`/api/assessments/${assessmentId}/answer`, {
        questionId: currentQuestion._id,
        answerText: selectedAnswer || '',
        timeTaken,
      });

      setShowSubmitConfirmModal(false);
      setIsTesting(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      runPostGradingAI();
    } catch (err) {
      console.error(err);
    }
  };

  // Restart terminated exam
  const handleRestartExam = () => {
    setIsTerminated(false);
    setAssessmentId(null);
    setIsTesting(false);
    setProfileStep('useCases');
    setShowRules(false);
    startFreshSetup();
  };

  if (loadingResume) return <Loader message="Retrieving ongoing assessment..." fullScreen />;
  if (gradingProgress) return <Loader message="Analyzing results. Calculating subject topic competence and writing final feedback summary report..." fullScreen />;

  if (showRules) {
    return (
      <RulesView
        onBack={() => setShowRules(false)}
        onStart={() => {
          setShowRules(false);
          handleStartExam();
        }}
      />
    );
  }

  const isExamMode = isTesting || isTerminated;
  const showActiveExamLayout = isTesting && currentQuestion;

  return (
    <div
      className={isExamMode
        ? 'fixed inset-0 z-[70] flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-[#fffdf9] via-white to-[#fff4eb] px-4 py-4 text-slate-950 sm:px-6 lg:px-8'
        : 'max-w-4xl mx-auto px-4 py-8 h-[82vh] flex flex-col justify-between text-slate-950'}
    >

      {/* 1. DISQUALIFIED SCREEN */}
      {isTerminated ? (
        <DisqualifiedView
          terminationReason={terminationReason}
          onRestart={handleRestartExam}
        />
      ) : (
        <>
          {/* Active test stats banner */}
          {showActiveExamLayout ? (
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap justify-between items-center space-y-2 sm:space-y-0 shadow-sm shrink-0">
                <div className="flex items-center space-x-3 text-xs font-semibold">
                  <span className="text-[#ff6a1f]">Exam: Active</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-700">Question {questionNum} / {totalQuestions}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 uppercase tracking-wider">{currentQuestion.type}</span>
                </div>

                <div className="flex items-center flex-wrap justify-end gap-3">
                  {!isFullscreenActive && (
                    <button
                      onClick={requestExamFullscreen}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] shadow-[0_8px_18px_rgba(255,106,31,0.20)]"
                    >
                      Re-enter Fullscreen
                    </button>
                  )}
                  <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border
                    ${timer <= 15
                      ? 'bg-[#fff4eb] border-[#ff6a1f] text-[#d63d04] animate-pulse'
                      : 'bg-[#fff4eb] border-[#ff8b4d] text-[#ff4a03]'}`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{timer}s left</span>
                  </div>
                  <div className="text-[10px] text-[#ff4a03] font-semibold uppercase">
                    Violations: {cheatingCount} / 3
                  </div>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.95fr]">
                <ChatConsole
                  messages={messages}
                  isAgentTyping={isAgentTyping}
                  chatEndRef={chatEndRef}
                  profileStep={profileStep}
                  isTesting={isTesting}
                  inputVal={inputVal}
                  setInputVal={setInputVal}
                  onSubmitProfileVal={handleProfileInputSubmit}
                  onShowRules={() => setShowRules(true)}
                  isFullscreenActive={isFullscreenActive}
                  onRequestFullscreen={requestExamFullscreen}
                  isSplitLayout={true}
                />

                <QuestionControls
                  currentQuestion={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  questionNum={questionNum}
                  totalQuestions={totalQuestions}
                  onSubmitExamClick={handleSubmitExamClick}
                  onSubmitActiveAnswer={handleSubmitActiveAnswer}
                  isSplitLayout={true}
                />
              </div>
            </div>
          ) : (
            <ChatConsole
              messages={messages}
              isAgentTyping={isAgentTyping}
              chatEndRef={chatEndRef}
              profileStep={profileStep}
              isTesting={isTesting}
              inputVal={inputVal}
              setInputVal={setInputVal}
              onSubmitProfileVal={handleProfileInputSubmit}
              onShowRules={() => setShowRules(true)}
              isFullscreenActive={isFullscreenActive}
              onRequestFullscreen={requestExamFullscreen}
              isSplitLayout={false}
            />
          )}

          {/* 5. SUBMIT CONFIRMATION MODAL */}
          <SubmitConfirmModal
            isOpen={showSubmitConfirmModal}
            questionNum={questionNum}
            totalQuestions={totalQuestions}
            onCancel={() => setShowSubmitConfirmModal(false)}
            onConfirm={questionNum < totalQuestions ? handleTerminateExamPrematurely : handleFinalSuccessfulSubmit}
          />

          {/* 4. SECURITY WARNING MODAL */}
          <WarningModal
            isOpen={showWarningModal}
            warningMessage={warningMessage}
            cheatingCount={cheatingCount}
            onAcknowledge={() => setShowWarningModal(false)}
          />
        </>
      )}

    </div>
  );
};

export default AssessmentPage;
