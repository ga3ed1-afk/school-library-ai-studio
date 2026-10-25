import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Chrome as Google, Facebook, Loader2, AlertCircle } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const translateFirebaseError = (error: any): string => {
    const code = error?.code || '';
    if (code === 'auth/user-not-found') return 'البريد الإلكتروني غير مسجل مسبقاً.';
    if (code === 'auth/wrong-password') return 'كلمة المرور غير صحيحة.';
    if (code === 'auth/email-already-in-use') return 'البريد الإلكتروني مستخدم بالفعل.';
    if (code === 'auth/invalid-email') return 'صيغة البريد الإلكتروني غير صالحة.';
    if (code === 'auth/weak-password') return 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.';
    if (code === 'auth/popup-closed-by-user') return 'تم إغلاق نافذة الدخول قبل إتمام العملية.';
    if (code === 'auth/operation-not-allowed') return 'تسجيل الدخول بهذه الطريقة غير مفعل حالياً في إعدادات الحساب.';
    return error?.message || 'حدث خطأ أثناء المصادقة، يرجى المحاولة مرة أخرى.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCred.user;
        onLoginSuccess({
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'حريف',
          email: fbUser.email,
          uid: fbUser.uid,
          provider: 'email'
        });
        onClose();
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const fbUser = userCred.user;
        onLoginSuccess({
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'حريف جديد',
          email: fbUser.email,
          uid: fbUser.uid,
          provider: 'email'
        });
        onClose();
      }
    } catch (err: any) {
      console.warn('Firebase email auth error:', err);
      setErrorMsg(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAuth = async (providerName: 'google' | 'facebook') => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const provider = providerName === 'google' 
        ? new GoogleAuthProvider() 
        : new FacebookAuthProvider();

      const userCred = await signInWithPopup(auth, provider);
      const fbUser = userCred.user;
      onLoginSuccess({
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'حريف',
        email: fbUser.email,
        uid: fbUser.uid,
        photoURL: fbUser.photoURL,
        provider: providerName
      });
      onClose();
    } catch (err: any) {
      console.warn(`Firebase ${providerName} auth error:`, err);
      // If popup was cancelled or blocked, display readable message
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(translateFirebaseError(err));
      }
    } finally {
      setLoading(false);
    }
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
            <div 
              className="p-6 sm:p-8 flex justify-between items-center text-white"
              style={{ backgroundColor: 'oklch(54.1% 0.281 293.009)' }}
            >
              <div>
                <h2 className="text-2xl font-black text-white">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
                <p className="text-purple-100 text-xs font-bold">مرحباً بك في بن عمار للمكتبية و الإعلامية</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-md transition-all text-white cursor-pointer group"
                aria-label="إغلاق"
              >
                <X size={22} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => handleProviderAuth('google')}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-indigo-100 bg-indigo-50/20 rounded-md font-bold text-stone-700 hover:bg-indigo-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Google size={20} className="text-rose-500" />
                  <span>المتابعة باستخدام جوجل</span>
                </button>
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => handleProviderAuth('facebook')}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-indigo-100 bg-indigo-50/20 rounded-md font-bold text-stone-700 hover:bg-indigo-50 transition-all cursor-pointer disabled:opacity-50"
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

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 mr-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                    <input 
                      type="email" 
                      required
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
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-indigo-50/20 border border-indigo-100 rounded-md py-2.5 pr-11 pl-4 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-sm text-stone-900" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3.5 rounded-md font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}</span>
                </button>
              </form>

              <p className="text-center text-xs font-bold text-stone-500">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMsg(null);
                  }}
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
