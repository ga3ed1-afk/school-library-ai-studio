import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Github, Chrome as Google, Facebook } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleMockLogin = (provider: string) => {
    // Mock login success
    const mockUser = {
      name: provider === 'email' ? email.split('@')[0] : `مستخدم ${provider}`,
      email: email || `${provider}@example.com`,
      provider
    };
    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-oxford-blue/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col font-sans"
            dir="rtl"
          >
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                <h2 className="text-2xl font-black text-oxford-blue">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">مرحباً بك في إكسترا</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white rounded-xl transition-all shadow-sm group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <button 
                  onClick={() => handleMockLogin('Google')}
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-stone-100 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all"
                >
                  <Google size={20} className="text-red-500" />
                  <span>المتابعة باستخدام جوجل</span>
                </button>
                <button 
                  onClick={() => handleMockLogin('Facebook')}
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-stone-100 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all"
                >
                  <Facebook size={20} className="text-blue-600" />
                  <span>المتابعة باستخدام فيسبوك</span>
                </button>
              </div>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-stone-100"></div>
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">أو عبر البريد</span>
                <div className="flex-1 h-px bg-stone-100"></div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 pr-12 pl-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 pr-12 pl-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleMockLogin('email')}
                className="w-full bg-oxford-blue text-white py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all"
              >
                {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </button>

              <p className="text-center text-sm font-bold text-stone-400">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-oxford-blue hover:text-oxford-red transition-colors"
                >
                  {isLogin ? 'سجل الآن' : 'سجل دخولك'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
