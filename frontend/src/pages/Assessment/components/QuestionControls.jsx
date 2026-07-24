import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const QuestionControls = ({
  currentQuestion,
  selectedAnswer,
  setSelectedAnswer,
  questionNum,
  totalQuestions,
  onSubmitExamClick,
  onSubmitActiveAnswer,
  isSplitLayout = false
}) => {
  if (!currentQuestion) return null;

  // Wrapper class depending on layout mode
  const wrapperClass = isSplitLayout
    ? "flex min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
    : "bg-white border border-slate-200 p-5 rounded-2xl space-y-5 relative shadow-sm shrink-0";

  // Question header class depending on layout mode
  const headerClass = isSplitLayout
    ? "space-y-1 border-b border-slate-200 pb-3"
    : "space-y-1";

  // Options area class depending on layout mode
  const optionsClass = isSplitLayout
    ? "mt-4 flex-1 min-h-0 overflow-y-auto space-y-5 pr-1"
    : "space-y-5";

  // Footer area class depending on layout mode
  const footerClass = isSplitLayout
    ? "mt-4 flex justify-between items-center border-t border-slate-200 pt-4"
    : "flex justify-between items-center pt-2 border-t border-slate-200";

  return (
    <div className={wrapperClass}>
      {/* Question display */}
      <div className={headerClass}>
        <span className="text-[10px] text-[#ff6a1f] font-bold uppercase tracking-wider">Active Question</span>
        <p className="text-sm font-bold text-slate-950 leading-relaxed">{currentQuestion.text}</p>
      </div>

      {/* Answer rendering */}
      <div className={optionsClass}>
        {/* MCQ Options rendering */}
        {currentQuestion.type === 'MCQ' && (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center space-x-3 p-3 rounded-xl border text-sm cursor-pointer transition-all
                  ${selectedAnswer === opt
                    ? 'bg-[#fff4eb] border-[#ff6a1f] text-slate-950 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-[#ff8b4d] text-slate-700'}`}
              >
                <input
                  type="radio"
                  name="mcq"
                  value={opt}
                  checked={selectedAnswer === opt}
                  onChange={() => setSelectedAnswer(opt)}
                  className="sr-only"
                />
                <span className="font-mono text-xs w-5 h-5 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-full text-slate-700">
                  {String.fromCharCode(65 + idx)}
                </span>
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
                      ? 'bg-[#fff4eb] border-[#ff6a1f] text-slate-950 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-[#ff8b4d] text-slate-700'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxToggle}
                    className="sr-only"
                  />
                  <span className="font-mono text-xs w-5 h-5 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-full text-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
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
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff6a1f] text-slate-950 placeholder-slate-400"
              style={{ caretColor: '#ff6a1f' }}
            />
          </div>
        )}

        {/* Long, Scenario, Logical, Analytical Text Area rendering */}
        {['Long', 'Scenario', 'Logical', 'Analytical'].includes(currentQuestion.type) && (
          <div className="relative">
            <textarea
              rows={isSplitLayout ? 7 : 5}
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Write your comprehensive analysis response here... (Pseudocode or detailed steps welcome)"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff6a1f] text-slate-950 placeholder-slate-400 resize-none"
              style={{ caretColor: '#ff6a1f' }}
            />
          </div>
        )}
      </div>

      {/* Submission button */}
      <div className={footerClass}>
        {questionNum < totalQuestions ? (
          <>
            <button
              type="button"
              onClick={onSubmitExamClick}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Submit Exam
            </button>
            <button
              type="button"
              onClick={onSubmitActiveAnswer}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl text-xs transition-all shadow-[0_10px_24px_rgba(255,106,31,0.22)] active:scale-95"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onSubmitExamClick}
            className="w-full flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-bold rounded-xl text-xs transition-all shadow-[0_10px_24px_rgba(255,106,31,0.22)] active:scale-95"
          >
            <Play className="w-3 h-3 shrink-0" />
            <span>Submit Assessment</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionControls;
