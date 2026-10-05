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
            className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-md shadow-2xl z-[101] overflow-hidden flex flex-col font-sans border border-indigo-100"
            dir="rtl"
          >
            <div className="p-6 sm:p-8 flex justify-between items-center bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white">
              <div>
                <h2 className="text-2xl font-black text-white">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
                <p className="text-indigo-200 text-xs font-bold">مرحباً بك في مكتبة الهدى</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-md transition-all text-white cursor-pointer group"
              >
                <X size={22} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <button 
                  onClick={() => handleMockLogin('Google')}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-indigo-100 bg-indigo-50/20 rounded-md font-bold text-stone-700 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <Google size={20} className="text-rose-500" />
                  <span>المتابعة باستخدام جوجل</span>
                </button>
                <button 
                  onClick={() => handleMockLogin('Facebook')}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-indigo-100 bg-indigo-50/20 rounded-md font-bold text-stone-700 hover:bg-indigo-50 transition-all cursor-pointer"
                >
                  <Facebook size={20} className="text-indigo-600" />
                  <span>المتابعة باستخدام فيسبوك</span>
                </button>
              </div>

              <div className="relative flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-indigo-50"></div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">أو عبر البريد الإلكتروني</span>
                <div className="flex-1 h-px bg-indigo-50"></div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 mr-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-indigo-50/20 border border-indigo-100 rounded-md py-2.5 pr-11 pl-4 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-sm text-stone-900" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 mr-1">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-indigo-50/20 border border-indigo-100 rounded-md py-2.5 pr-11 pl-4 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-sm text-stone-900" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleMockLogin('email')}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3.5 rounded-md font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </button>

              <p className="text-center text-xs font-bold text-stone-500">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 hover:text-rose-600 font-extrabold transition-colors cursor-pointer"
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
