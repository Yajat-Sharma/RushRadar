import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SignupScreenProps {
  onNavigate: (screen: 'login' | 'home') => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const { login } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        savedHome: '',
        savedWork: ''
      });
      setIsLoading(false);
      onNavigate('home');
    }, 1500);
  };

  return (
    <div className="h-full bg-[#F5F7FA] flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-4 pt-10 flex items-center">
        <button 
          onClick={() => onNavigate('login')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 text-neutral-dark active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-32 pb-8 overflow-y-auto w-full max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-black text-neutral-dark tracking-tight mb-2">Create Account</h1>
          <p className="text-neutral-medium font-medium mb-10">Sign up to save routes and access smart analytics.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <p className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-1.5 ml-1">Full Name</p>
              <Input
                icon={<UserIcon size={18} />}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div>
              <p className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-1.5 ml-1">Email</p>
              <Input
                icon={<Mail size={18} />}
                placeholder="john@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div>
              <p className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-1.5 ml-1">Password</p>
              <Input
                icon={<Lock size={18} />}
                placeholder="Create a strong password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </div>

            {error && (
              <p className="text-danger-red text-xs font-bold mt-2">
                {error}
              </p>
            )}

            <Button 
              variant="primary" 
              fullWidth 
              className="mt-6 !py-3.5"
              isLoading={isLoading}
              type="submit"
            >
              {!isLoading && "Sign Up"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-neutral-500">
            By signing up, you agree to our <span className="text-primary-blue font-bold">Terms of Service</span> and <span className="text-primary-blue font-bold">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupScreen;
