import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Clock, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface AIAssistantProps {
  onNavigate: (screen: any) => void;
}

const SMART_TIPS = [
  {
    icon: Clock,
    color: 'text-primary-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    title: 'Leave in 12 minutes',
    desc: 'Beat the 8:30 AM rush spike. Trains are 40% less crowded before 8:15.',
  },
  {
    icon: TrendingUp,
    color: 'text-success-green',
    bg: 'bg-green-50 dark:bg-green-900/30',
    title: 'Harbour Line today',
    desc: 'Alternative via Harbour Line is 35% less crowded with only 8 min extra.',
  },
  {
    icon: MapPin,
    color: 'text-warning-orange',
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    title: 'Platform tip',
    desc: 'Stand near Coach 9–11. They board faster and are less crowded at peak.',
  },
  {
    icon: AlertTriangle,
    color: 'text-danger-red',
    bg: 'bg-red-50 dark:bg-red-900/30',
    title: 'Delay alert',
    desc: 'Western Line running 6 min late due to signal work at Dadar.',
  },
];

const MOCK_CHAT: Record<string, string> = {
  default: "I'm your smart commute assistant. Ask me about crowd levels, best times to travel, or route tips!",
  crowd: "Right now, Fast Locals on Western Line are 78% full. Slow Locals are only 42% crowded — great choice if you have 8 extra minutes.",
  time: "The best time to travel is between 10 AM – 12 PM (off-peak). Crowd drops by 55% compared to 8:30 AM.",
  ladies: "Ladies Coach is Coach 1 and Coach 12 on most Mumbai locals. During peak hours, it's 35% less crowded than general coaches.",
  platform: "For Andheri → Churchgate Fast Local, Platform 1 is your boarding spot. Arrive 3 min early for a good position.",
  delay: "No major delays right now. Western Line is running on schedule. Central Line has a 4-min delay at Kurla.",
};

const getReply = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('crowd') || lower.includes('busy') || lower.includes('full')) return MOCK_CHAT.crowd;
  if (lower.includes('time') || lower.includes('when') || lower.includes('best')) return MOCK_CHAT.time;
  if (lower.includes('ladies') || lower.includes('women') || lower.includes('coach')) return MOCK_CHAT.ladies;
  if (lower.includes('platform') || lower.includes('stand') || lower.includes('where')) return MOCK_CHAT.platform;
  if (lower.includes('delay') || lower.includes('late') || lower.includes('slow')) return MOCK_CHAT.delay;
  return MOCK_CHAT.default;
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ onNavigate }) => {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'ai' | 'user'; text: string }[]>([
    { from: 'ai', text: `Hi ${state.user?.name?.split(' ')[0] ?? 'there'}! I'm your AI commute assistant. Tap a tip or ask me anything.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'ai', text: getReply(text) }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* FAB — positioned above bottom nav */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        className="absolute bottom-[100px] right-5 w-14 h-14 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-2xl shadow-xl flex items-center justify-center z-30"
        style={{ boxShadow: '0 8px 24px rgba(26, 86, 219, 0.4)' }}
      >
        <Sparkles size={22} className="text-white" />
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[28px] z-50 overflow-hidden border-t border-neutral-100 dark:border-gray-700"
              style={{ maxHeight: '86%' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3">
                <div className="w-10 h-1 bg-neutral-200 dark:bg-gray-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-xl flex items-center justify-center">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-black text-neutral-900 dark:text-white">AI Commute Assistant</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-gray-400 font-medium">CrowdSense AI · Always up to date</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-gray-800 hover:bg-neutral-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={15} className="text-neutral-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Smart Tips */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-[10px] font-black text-neutral-400 dark:text-gray-500 uppercase tracking-wider mb-2">Smart Tips For You</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {SMART_TIPS.map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <button
                        key={tip.title}
                        onClick={() => sendMessage(tip.title)}
                        className={`shrink-0 ${tip.bg} rounded-2xl p-3 text-left w-44 border border-transparent hover:border-neutral-200 dark:hover:border-gray-600 transition-colors`}
                      >
                        <Icon size={15} className={`${tip.color} mb-1.5`} />
                        <p className="text-[12px] font-black text-neutral-900 dark:text-white leading-tight">{tip.title}</p>
                        <p className="text-[10px] text-neutral-500 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2">{tip.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="px-4 py-2 space-y-3 overflow-y-auto no-scrollbar" style={{ maxHeight: '220px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] font-medium leading-snug ${
                      msg.from === 'user'
                        ? 'bg-primary-blue text-white rounded-br-md'
                        : 'bg-neutral-100 dark:bg-gray-800 text-neutral-800 dark:text-gray-200 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 bg-neutral-400 dark:bg-gray-500 rounded-full" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-4 pb-8 pt-2 border-t border-neutral-100 dark:border-gray-700 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about crowd, delays, platforms…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  className="flex-1 bg-neutral-100 dark:bg-gray-800 rounded-2xl px-4 py-3 text-[13px] font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-blue/30 dark:placeholder-gray-500 border border-transparent dark:border-gray-700"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="w-11 h-11 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
