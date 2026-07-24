import React from 'react';
import { Send, Play } from 'lucide-react';
import ChatBubble from '../../../components/Chat/ChatBubble';

const ChatConsole = ({
  messages,
  isAgentTyping,
  chatEndRef,
  profileStep,
  isTesting,
  inputVal,
  setInputVal,
  onSubmitProfileVal,
  onShowRules,
  isFullscreenActive,
  onRequestFullscreen,
  isSplitLayout = false
}) => {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmitProfileVal(inputVal);
  };

  if (isSplitLayout) {
    return (
      <div className="flex min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] text-[#ff6a1f] font-bold uppercase tracking-wider">Live Chat</span>
            <p className="text-sm text-slate-600">Assessment agent conversation and prompts</p>
          </div>
          <div className="flex items-center gap-2">
            {!isFullscreenActive && (
              <button
                onClick={onRequestFullscreen}
                className="px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] shadow-[0_8px_16px_rgba(255,106,31,0.20)]"
              >
                Re-enter Fullscreen
              </button>
            )}
            <div className="rounded-full border border-[#ffd0aa] bg-[#fff4eb] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#d63d04]">
              Full Screen Mode
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 mt-4 bg-transparent rounded-2xl">
          {messages.map((m, idx) => (
            <ChatBubble key={idx} sender={m.sender} text={m.text} />
          ))}
          {isAgentTyping && <ChatBubble sender="ai" isTyping />}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input area */}
        {!isTesting && (
          <div className="mt-4 shrink-0">
            {profileStep === 'level' && (
              <div className="flex flex-wrap gap-3 justify-center">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSubmitProfileVal(lvl)}
                    className="px-5 py-2 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] border border-[#ff8b4d] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_10px_22px_rgba(255,106,31,0.20)]"
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            )}

            {profileStep === 'ready' && (
              <div className="flex justify-center">
                <button
                  onClick={onShowRules}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl transition-all shadow-[0_12px_28px_rgba(255,106,31,0.24)]"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Fullscreen Assessment</span>
                </button>
              </div>
            )}

            {profileStep !== 'level' && profileStep !== 'ready' && (
              <form
                onSubmit={handleFormSubmit}
                className="flex space-x-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 items-center shadow-sm"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type your response here..."
                  className="flex-1 bg-transparent py-2 px-3 text-sm focus:outline-none text-slate-950 placeholder-slate-400 cursor-text"
                  style={{ caretColor: '#ff6a1f' }}
                />
                <button
                  type="submit"
                  className="p-2.5 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white rounded-xl transition-colors active:scale-95 shrink-0 shadow-[0_8px_18px_rgba(255,106,31,0.20)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // Non-split layout (for setup / initial greeting step)
  return (
    <>
      {/* Message Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mt-4 max-h-[55vh] border-b border-slate-200 pb-4 bg-transparent rounded-2xl px-3 py-4">
        {messages.map((m, idx) => (
          <ChatBubble key={idx} sender={m.sender} text={m.text} />
        ))}
        {isAgentTyping && <ChatBubble sender="ai" isTyping />}
        <div ref={chatEndRef}></div>
      </div>

      {/* Inputs / Controls */}
      <div className="mt-4 pt-2 shrink-0">
        {!isTesting && (
          <>
            {profileStep === 'level' && (
              <div className="flex flex-wrap gap-3 mb-4 justify-center">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSubmitProfileVal(lvl)}
                    className="px-5 py-2 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] border border-[#ff8b4d] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_10px_22px_rgba(255,106,31,0.20)]"
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            )}

            {profileStep === 'ready' && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={onShowRules}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl transition-all shadow-[0_12px_28px_rgba(255,106,31,0.24)]"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Fullscreen Assessment</span>
                </button>
              </div>
            )}

            {profileStep !== 'level' && profileStep !== 'ready' && (
              <form
                onSubmit={handleFormSubmit}
                className="flex space-x-3 bg-white border border-slate-200 rounded-2xl p-2 items-center shadow-sm"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type your response here..."
                  className="flex-1 bg-transparent py-2 px-3 text-sm focus:outline-none text-slate-950 placeholder-slate-400 cursor-text"
                  style={{ caretColor: '#ff6a1f' }}
                />
                <button
                  type="submit"
                  className="p-2.5 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white rounded-xl transition-colors active:scale-95 shrink-0 shadow-[0_8px_18px_rgba(255,106,31,0.20)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ChatConsole;
