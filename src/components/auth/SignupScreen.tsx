import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Screen } from '../../App';

interface SignupScreenProps {
  onNavigate: (screen: Screen) => void;
}

const getPasswordStrength = (pw: string): { label: string; color: string; width: string; score: number } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-danger-red', width: 'w-1/4', score };
  if (score === 2) return { label: 'Fair', color: 'bg-warning-orange', width: 'w-2/4', score };
  if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: 'w-3/4', score };
  return { label: 'Strong', color: 'bg-success-green', width: 'w-full', score };
};

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const { login } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const strength = password ? getPasswordStrength(password) : null;
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!validateEmail(email)) errs.email = 'Please enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errs.confirm = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        name: name.trim(),
        email,
        savedHome: '',
        savedWork: '',
      });
      setIsLoading(false);
      onNavigate('home');
    }, 1500);
  };

  const fieldClass = (hasError: boolean) =>
    `flex items-center gap-3 bg-white dark:bg-gray-800 border rounded-2xl px-4 py-3.5 transition-all shadow-sm ${
      hasError
        ? 'border-danger-red ring-2 ring-danger-red/10'
        : 'border-neutral-200 dark:border-gray-700 focus-within:border-primary-blue focus-within:ring-2 focus-within:ring-primary-blue/10'
    }`;

  return (
    <div className="h-full bg-[#F5F7FA] dark:bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-primary-blue/8 to-secondary-teal/5 dark:from-primary-blue/15 dark:to-secondary-teal/8 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-5 py-4 pt-12 flex items-center">
        <button
          onClick={() => onNavigate('login')}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-neutral-100 dark:border-gray-700 text-neutral-dark dark:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 pb-8 overflow-y-auto no-scrollbar">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-black text-neutral-dark dark:text-white tracking-tight mb-1">
            Create Account
          </h1>
          <p className="text-neutral-medium dark:text-gray-400 font-medium mb-8">
            Join CrowdSense and travel smarter every day.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-neutral-dark dark:text-gray-300 uppercase tracking-wider block mb-2 ml-1">Full Name</label>
              <div className={fieldClass(!!errors.name)}>
                <UserIcon size={18} className="text-neutral-medium dark:text-gray-400 shrink-0" />
                <input
                  placeholder="John Doe"
                  value={name}
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                  className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
                />
              </div>
              <AnimatePresence>
                {errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-danger-red text-xs font-bold mt-1.5 ml-1">{errors.name}</motion.p>}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-neutral-dark dark:text-gray-300 uppercase tracking-wider block mb-2 ml-1">Email</label>
              <div className={fieldClass(!!errors.email)}>
                <Mail size={18} className="text-neutral-medium dark:text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
                  className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
                  autoComplete="email"
                />
              </div>
              <AnimatePresence>
                {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-danger-red text-xs font-bold mt-1.5 ml-1">{errors.email}</motion.p>}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-neutral-dark dark:text-gray-300 uppercase tracking-wider block mb-2 ml-1">Password</label>
              <div className={fieldClass(!!errors.password)}>
                <Lock size={18} className="text-neutral-medium dark:text-gray-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                  className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="text-neutral-medium dark:text-gray-400 hover:text-neutral-dark dark:hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength indicator */}
              {password && strength && (
                <div className="mt-2 ml-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: undefined }}
                        className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                      />
                    </div>
                    <span className={`text-[11px] font-bold ${strength.score <= 1 ? 'text-danger-red' : strength.score === 2 ? 'text-warning-orange' : strength.score === 3 ? 'text-yellow-500' : 'text-success-green'}`}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-danger-red text-xs font-bold mt-1.5 ml-1">{errors.password}</motion.p>}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-neutral-dark dark:text-gray-300 uppercase tracking-wider block mb-2 ml-1">Confirm Password</label>
              <div className={fieldClass(!!errors.confirm)}>
                <Lock size={18} className="text-neutral-medium dark:text-gray-400 shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); if (errors.confirm) setErrors(p => ({ ...p, confirm: undefined })); }}
                  className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
                  autoComplete="new-password"
                />
                {confirmPassword && password === confirmPassword ? (
                  <CheckCircle size={18} className="text-success-green shrink-0" />
                ) : (
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="text-neutral-medium dark:text-gray-400 hover:text-neutral-dark dark:hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {errors.confirm && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-danger-red text-xs font-bold mt-1.5 ml-1">{errors.confirm}</motion.p>}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-blue to-primary-blue-light text-white font-black py-4 rounded-2xl shadow-lg mt-3 disabled:opacity-70 transition-all text-[15px]"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-neutral-500 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <span className="text-primary-blue font-bold">Terms of Service</span>{' '}
            and{' '}
            <span className="text-primary-blue font-bold">Privacy Policy</span>.
          </p>

          <p className="mt-4 text-center text-sm font-medium text-neutral-500 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-primary-blue font-black hover:underline">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupScreen;
