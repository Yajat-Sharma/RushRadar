import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginScreenProps {
  onNavigate: (screen: 'signup' | 'home') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login, setGuestMode } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      login({
        id: 'user-123',
        name: email.split('@')[0],
        email: email,
        savedHome: 'Andheri (W)',
        savedWork: 'Churchgate'
      });
      setIsLoading(false);
      onNavigate('home');
    }, 1200);
  };

  const handleGuest = () => {
    setGuestMode(true);
    onNavigate('home');
  };

  return (
    <div className="h-full bg-gradient-to-br from-primary-blue to-secondary-teal flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      {/* Main Card */}
      <motion.div 
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <span className="text-3xl">🚊</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome to RushRadar</h1>
          <p className="text-white/70 font-medium text-sm mt-1">Smart transit for smart commuters.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              icon={<Mail size={18} />}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 border-transparent focus:bg-white"
            />
          </div>
          <div>
            <Input
              icon={<Lock size={18} />}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/90 border-transparent focus:bg-white"
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-300 text-xs font-bold text-center">
              {error}
            </motion.p>
          )}

          <div className="flex justify-end pt-1">
            <button type="button" className="text-white/80 text-xs font-bold hover:text-white transition-colors">
              Forgot password?
            </button>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            className="mt-2 bg-white text-primary-blue hover:bg-neutral-50 shadow-lg !py-3.5"
            isLoading={isLoading}
            type="submit"
          >
            {!isLoading && <>Sign In <ArrowRight size={18} className="ml-2" /></>}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="h-px bg-white/20 flex-1" />
          <span className="px-4 text-white/50 text-xs font-bold uppercase tracking-wider">or</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        <div className="mt-6 space-y-3">
          <Button 
            variant="outline" 
            fullWidth 
            className="border-white/30 text-white hover:bg-white/10 !py-3"
            onClick={handleGuest}
          >
            <UserIcon size={18} className="mr-2 opacity-80" />
            Continue as Guest
          </Button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-white/80 text-sm font-medium">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-white font-bold hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
