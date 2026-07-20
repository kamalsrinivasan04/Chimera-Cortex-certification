import React from 'react';
import { User } from 'lucide-react';
import chimeraEmblem from '../../assets/Chimera Technologies Emblem.png';

const ChatBubble = ({ sender, text, isTyping = false }) => {
  const isAi = sender === 'ai';

  return (
    <div className={`flex w-full mt-4 space-x-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'}`}>
      {/* Avatar Icon */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 border 
        ${isAi
          ? 'bg-white border-primary-300 text-primary-600'
          : 'bg-primary-50 border-primary-500 text-primary-600'}`}
      >
        {isAi ? (
          <img src={chimeraEmblem} alt="Chimera Technologies emblem" className="w-5 h-5 object-contain" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>

      {/* Bubble Box */}
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 mb-1 px-1">
          {isAi ? 'C³' : 'You'}
        </span>
        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line
          ${isAi
            ? 'bg-white border border-slate-200 text-slate-950 rounded-tl-none'
            : 'bg-primary-50 border border-primary-200 text-slate-950 rounded-tr-none'}`}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1.5 py-1">
              <div className="w-2.5 h-2.5 bg-primary-400 rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-primary-400 rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-primary-400 rounded-full typing-dot"></div>
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
