import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Screen } from '../../App';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login, setGuestMode } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!validateEmail(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      login({
        id: 'user-123',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        savedHome: 'Andheri (W)',
        savedWork: 'Churchgate',
      });
      setIsLoading(false);
      onNavigate('home');
    }, 1200);
  };

  const handleGuest = () => {
    setGuestMode(true);
    onNavigate('home');
  };

  const inputClass = (hasError: boolean) =>
    `flex items-center gap-3 bg-white/15 backdrop-blur-sm border rounded-2xl px-4 py-3.5 transition-all ${
      hasError
        ? 'border-red-300 ring-2 ring-red-300/30'
        : 'border-white/30 focus-within:border-white/70 focus-within:ring-2 focus-within:ring-white/20'
    }`;

  return (
    <div className="h-full bg-gradient-to-br from-[#1A56DB] via-[#1e4cc0] to-[#0E9F6E] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Floating orbs */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-blue-light/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
            <span className="text-3xl">🚊</span>
          </div>
          <h1 className="text-[28px] font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-white/70 font-medium text-sm mt-1">CrowdSense — Smart Transit Intelligence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <div className={inputClass(!!errors.email)}>
              <Mail size={18} className="text-white/60 shrink-0" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
                className="flex-1 bg-transparent text-white font-medium outline-none placeholder-white/40 text-[15px]"
                autoComplete="email"
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-300 text-xs font-bold mt-1.5 ml-1">{errors.email}</motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div>
            <div className={inputClass(!!errors.password)}>
              <Lock size={18} className="text-white/60 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                className="flex-1 bg-transparent text-white font-medium outline-none placeholder-white/40 text-[15px]"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-white/50 hover:text-white/90 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-300 text-xs font-bold mt-1.5 ml-1">{errors.password}</motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-white/75 text-[13px] font-bold hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* General error */}
          <AnimatePresence>
            {errors.general && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-red-400/20 border border-red-300/30 rounded-xl px-4 py-2.5 text-red-200 text-xs font-bold text-center">
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-white text-primary-blue font-black py-4 rounded-2xl shadow-xl mt-1 disabled:opacity-70 transition-all text-[15px]"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-primary-blue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-white/40 text-xs font-bold uppercase tracking-wider">or</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {/* Guest Mode */}
        <motion.button
          onClick={handleGuest}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-white/25 text-white font-semibold py-3.5 rounded-2xl hover:bg-white/10 transition-all text-[14px]"
        >
          <UserIcon size={17} className="opacity-75" />
          Continue as Guest
        </motion.button>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm font-medium text-white/70">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-white font-black hover:underline"
          >
            Sign up free
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
