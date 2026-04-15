import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { Screen } from '../../App';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-primary-blue/10 to-secondary-teal/5 dark:from-primary-blue/20 dark:to-secondary-teal/10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-5 py-4 pt-12 flex items-center">
        <button
          onClick={() => onNavigate('login')}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-neutral-100 dark:border-gray-700 text-neutral-dark dark:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto flex flex-col">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <Mail size={28} className="text-white" />
              </div>

              <h1 className="text-3xl font-black text-neutral-dark dark:text-white tracking-tight mb-2">
                Forgot Password?
              </h1>
              <p className="text-neutral-medium dark:text-gray-400 font-medium mb-10 leading-relaxed">
                No worries. Enter your email and we'll send you a reset link right away.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-dark dark:text-gray-300 uppercase tracking-wider block mb-2 ml-1">
                    Email Address
                  </label>
                  <div className={`flex items-center gap-3 bg-white dark:bg-gray-800 border rounded-2xl px-4 py-3.5 transition-all shadow-sm ${
                    error
                      ? 'border-danger-red focus-within:ring-2 focus-within:ring-danger-red/20'
                      : 'border-neutral-200 dark:border-gray-700 focus-within:border-primary-blue focus-within:ring-2 focus-within:ring-primary-blue/10'
                  }`}>
                    <Mail size={18} className={error ? 'text-danger-red' : 'text-neutral-medium dark:text-gray-400'} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                      className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
                      autoComplete="email"
                    />
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-danger-red text-xs font-bold mt-2 ml-1"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-blue to-primary-blue-light text-white font-bold py-4 rounded-2xl shadow-lg mt-2 disabled:opacity-70 transition-all text-[15px]"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Link
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-8 text-center text-sm font-medium text-neutral-500 dark:text-gray-400">
                Remembered it?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-primary-blue font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 flex flex-col items-center justify-center text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 bg-gradient-to-br from-success-green to-teal-500 rounded-full flex items-center justify-center shadow-xl mb-6"
              >
                <CheckCircle size={36} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-black text-neutral-dark dark:text-white tracking-tight mb-3">
                Check Your Email
              </h2>
              <p className="text-neutral-medium dark:text-gray-400 font-medium max-w-xs leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-primary-blue font-bold text-[15px] mb-8">{email}</p>
              <p className="text-xs text-neutral-400 dark:text-gray-500 mb-8">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-gradient-to-r from-primary-blue to-primary-blue-light text-white font-bold py-4 rounded-2xl shadow-lg text-[15px]"
              >
                Back to Sign In
              </button>
              <button
                onClick={() => { setIsSuccess(false); setEmail(''); }}
                className="mt-3 w-full bg-neutral-100 dark:bg-gray-800 text-neutral-600 dark:text-gray-300 font-semibold py-4 rounded-2xl text-[15px]"
              >
                Try a Different Email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
