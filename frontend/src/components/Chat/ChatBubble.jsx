import React from 'react';
import { Award, User } from 'lucide-react';

const ChatBubble = ({ sender, text, isTyping = false }) => {
  const isAi = sender === 'ai';

  return (
    <div className={`flex w-full mt-4 space-x-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'}`}>
      {/* Avatar Icon */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 border 
        ${isAi 
          ? 'bg-slate-900 border-primary-800 text-primary-400' 
          : 'bg-primary-950 border-primary-700 text-primary-300'}`}
      >
        {isAi ? <Award className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble Box */}
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 mb-1 px-1">
          {isAi ? 'Assessment Agent' : 'You'}
        </span>
        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line
          ${isAi 
            ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none' 
            : 'bg-primary-600 text-white rounded-tr-none'}`}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1.5 py-1">
              <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-slate-400 rounded-full typing-dot"></div>
            </div>
          ) : (
            text
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
