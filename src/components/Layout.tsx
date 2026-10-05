import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, User, Heart, Phone, MapPin, Mail, Facebook, Instagram, Twitter, LayoutDashboard, LogOut, Truck, Palette } from 'lucide-react';
import LoginModal from './LoginModal';
import StyleSwitcherModal from './StyleSwitcherModal';
import { useStoreTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { brands, categories } from '../constants';
import { Product, CartItem } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Layout({ children, cart, setCart, searchQuery, setSearchQuery }: LayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { currentStyle, config, setIsStyleModalOpen } = useStoreTheme();
  const isOxfordCity = currentStyle === 'oxfordcity';
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open_cart', handleOpenCart);
    return () => window.removeEventListener('open_cart', handleOpenCart);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const allCategories = [{ name: 'الكل', icon: '🎒', subcategories: [] }, ...categories];

  const renderIcon = (icon?: string, className?: string) => {
    if (!icon || typeof icon !== 'string' || !icon.trim()) return null;
    if (icon.startsWith('http')) {
      return <img src={icon.trim()} alt="" className={cn("w-10 h-10 object-contain", className)} />;
    }
    return <span className={cn("text-2xl sm:text-3xl flex items-center justify-center", className)}>{icon}</span>;
  };

  const renderSubcategoryLabel = (sub: string) => {
    const match = sub.match(/^(\p{Extended_Pictographic}+|\S+)\s+(.+)$/u);
    if (match) {
      const [, icon, text] = match;
      return (
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl shrink-0 group-hover/item:scale-110 transition-transform leading-none">
            {icon}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover/item:text-indigo-600 transition-colors">{text}</span>
        </div>
      );
    }
    return <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover/item:text-indigo-600">{sub}</span>;
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={cn(
      "min-h-screen font-sans",
      isOxfordCity 
        ? "bg-white text-oxford-blue selection:bg-oxford-red selection:text-white" 
        : "bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-950"
    )}>
      {/* Header - Dynamically styles between Oxford City White and other themes */}
      <header className={cn(
        "relative z-40 w-full border-b transition-colors shadow-xs",
        isOxfordCity 
          ? "bg-white text-slate-900 border-stone-200" 
          : "bg-[#5794ff] text-white border-white/20"
      )}>
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-4 lg:py-5">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "p-2 lg:hidden rounded-xs transition-colors",
                isOxfordCity ? "text-oxford-blue hover:bg-stone-100" : "text-white hover:text-amber-200 hover:bg-white/15"
              )}
            >
              <Menu size={24} />
            </button>

            {/* Logo - Al Huda in all styles + smooth scroll to bottom */}
            <div className="flex-shrink-0">
              <button 
                type="button"
                onClick={handleLogoClick}
                className="flex items-center gap-2.5 group cursor-pointer text-right bg-transparent border-0 p-0"
                title="مكتبة الهدى - النزول لأسفل الصفحة"
              >
                <div className="w-11 h-11 lg:w-13 lg:h-13 bg-white rounded-xs flex items-center justify-center text-slate-900 shadow-md border border-white/50 overflow-hidden transition-transform group-hover:scale-105">
                  <img 
                    src="/logo.jpg" 
                    alt="مكتبة الهدى" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xl lg:text-2xl font-black tracking-tight leading-none",
                    isOxfordCity ? "text-oxford-blue" : "text-white"
                  )}>
                    مكتبة
                  </span>
                  <span className={cn(
                    "text-xs lg:text-sm font-extrabold tracking-widest leading-none mt-1",
                    isOxfordCity ? "text-oxford-red" : "text-amber-300"
                  )}>
                    الهدى
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
              <div className="relative w-full group">
                <Search className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
                  isOxfordCity ? "text-stone-500 group-focus-within:text-oxford-blue" : "text-white/80 group-focus-within:text-amber-300"
                )} size={19} />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات، كتب، حقائب، لوازم مدرسية..."
                  className={cn(
                    "w-full rounded-xs py-2.5 pr-12 pl-4 transition-all outline-none text-sm font-medium",
                    isOxfordCity 
                      ? "bg-stone-100 border-2 border-transparent text-stone-900 focus:bg-white focus:border-oxford-blue placeholder:text-stone-500" 
                      : "bg-white/20 border border-white/30 text-white focus:bg-white/30 focus:border-amber-300 placeholder:text-blue-100"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Style Switcher Button */}
              <button
                type="button"
                onClick={() => setIsStyleModalOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-black rounded-xs transition-all border shadow-xs cursor-pointer active:scale-95",
                  isOxfordCity 
                    ? "text-oxford-blue bg-stone-100 hover:bg-stone-200 border-stone-200" 
                    : "text-slate-900 bg-white hover:bg-slate-100 border-white/60"
                )}
                title="تغيير ستايل ومظهر المتجر"
              >
                <Palette size={15} className={isOxfordCity ? "text-oxford-red" : "text-blue-600"} />
                <span className="hidden sm:inline">الستايل</span>
              </button>

              <Link
                to="/track-order"
                className={cn(
                  "hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xs transition-colors border shadow-xs",
                  isOxfordCity 
                    ? "text-oxford-blue bg-stone-100 hover:bg-stone-200 border-stone-200" 
                    : "text-slate-950 bg-amber-300 hover:bg-amber-200 border-amber-400"
                )}
                title="تتبع مسار طلبيتك"
              >
                <Truck size={17} className={isOxfordCity ? "text-oxford-red" : "text-slate-950"} />
                <span>تتبع الطلب</span>
              </Link>
              <button 
                onClick={() => user ? setUser(null) : setIsLoginModalOpen(true)}
                className={cn(
                  "hidden sm:flex p-2 rounded-xs transition-colors items-center gap-2",
                  isOxfordCity ? "text-oxford-blue hover:bg-stone-100" : "text-white hover:text-amber-200 hover:bg-white/15"
                )}
              >
                {user ? (
                  <>
                    <div className="w-8 h-8 bg-oxford-blue text-white rounded-xs flex items-center justify-center text-xs font-black shadow-xs">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-sm font-black">{user.name}</span>
                    <LogOut size={16} className="text-oxford-red ml-1" />
                  </>
                ) : (
                  <User size={22} />
                )}
              </button>
              <button className={cn(
                "hidden sm:flex p-2 rounded-xs transition-colors",
                isOxfordCity ? "text-oxford-blue hover:bg-stone-100" : "text-white hover:text-amber-200 hover:bg-white/15"
              )}>
                <Heart size={22} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className={cn(
                  "relative p-2 rounded-xs transition-colors group cursor-pointer",
                  isOxfordCity ? "text-oxford-blue hover:bg-stone-100" : "text-white hover:text-amber-200 hover:bg-white/15"
                )}
              >
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className={cn(
                    "absolute top-0.5 right-0.5 text-white text-[10px] font-black w-5 h-5 rounded-xs flex items-center justify-center shadow-xs",
                    isOxfordCity ? "bg-oxford-red" : "bg-gradient-to-r from-[#DFB15B] to-[#B8860B] text-slate-950 border border-white/40"
                  )}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={cn(
            "hidden lg:flex items-center justify-center border-t",
            isOxfordCity ? "border-stone-100" : "border-white/20"
          )}>
            <ul className="flex items-center gap-0">
              {allCategories.map((cat, idx) => {
                const isCurrent = cat.name === 'الكل' 
                  ? location.pathname === '/' 
                  : (location.pathname === `/category/${cat.name}` || location.pathname === `/category/${encodeURIComponent(cat.name)}`);
                const isLeftSide = idx >= 5;

                return (
                  <li 
                    key={cat.name}
                    className="relative group"
                    onMouseEnter={() => setActiveSubMenu(cat.name)}
                    onMouseLeave={() => setActiveSubMenu(null)}
                  >
                    <Link
                      to={cat.name === 'الكل' ? '/' : `/category/${encodeURIComponent(cat.name)}`}
                      className={cn(
                        "flex flex-col items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 transition-all border-b-2 min-w-[110px] sm:min-w-[125px] rounded-t-xs text-xs uppercase tracking-tight",
                        isOxfordCity
                          ? (isCurrent 
                              ? "border-oxford-red text-oxford-red bg-stone-50 font-black" 
                              : "border-transparent hover:border-oxford-red group-hover:bg-stone-50 text-oxford-blue font-bold")
                          : (isCurrent 
                              ? "border-amber-300 text-amber-200 bg-white/15 font-black shadow-inner" 
                              : "border-transparent hover:border-amber-300 group-hover:bg-white/10 text-white hover:text-amber-200 font-bold")
                      )}
                    >
                      <div className="mb-1.5 transition-transform group-hover:scale-110 duration-300 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9">
                        {renderIcon(cat.icon, "w-8 h-8 object-contain")}
                      </div>
                      <span className="text-center whitespace-nowrap">{cat.name}</span>
                    </Link>

                    {cat.subcategories.length > 0 && activeSubMenu === cat.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "absolute top-full w-[580px] sm:w-[640px] max-w-[calc(100vw-2rem)] bg-[#1e40af] border border-amber-300/40 shadow-2xl rounded-lg p-5 z-50 grid grid-cols-2 gap-x-6 gap-y-2.5 text-white",
                          isLeftSide ? "left-0 right-auto" : "right-0 left-auto"
                        )}
                      >
                        <div className="col-span-2 mb-1 border-b border-white/20 pb-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-white/15 border border-white/20 flex items-center justify-center">
                              {renderIcon(cat.icon, "w-6 h-6")}
                            </div>
                            <h4 className="text-amber-300 font-black text-sm sm:text-base">{cat.name}</h4>
                          </div>
                          <Link
                            to={`/category/${encodeURIComponent(cat.name)}`}
                            onClick={() => setActiveSubMenu(null)}
                            className="text-xs font-bold text-slate-950 bg-amber-300 hover:bg-amber-200 px-2.5 py-1 rounded-sm border border-amber-400 transition-colors"
                          >
                            عرض الكل ({cat.subcategories.length} أقسام فرعية) ←
                          </Link>
                        </div>
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              navigate(`/category/${encodeURIComponent(cat.name)}?sub=${encodeURIComponent(sub)}`);
                              setActiveSubMenu(null);
                            }}
                            className="text-right py-2 px-2.5 rounded-md text-xs font-bold text-white hover:bg-white/15 hover:text-amber-200 transition-all flex items-center justify-between group/item cursor-pointer border border-transparent hover:border-amber-300/40"
                          >
                            <span className="text-white group-hover/item:text-amber-200">{sub}</span>
                            <ArrowRight size={13} className="opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all rotate-180 text-amber-300 shrink-0 mr-1.5" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className={cn(
        "text-white pt-16 pb-12 relative overflow-hidden transition-colors",
        isOxfordCity ? "bg-[#0A192F] rounded-t-[1.5rem] border-t border-slate-800" : "bg-[#102a5c] border-t border-[#5794ff]/30"
      )}>
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5794ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E31B23]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-12 h-12 bg-white rounded-xs flex items-center justify-center text-slate-900 shadow-lg border border-white/40 overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="مكتبة الهدى" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white leading-none">مكتبة</span>
                  <span className="text-xs font-bold text-amber-300 tracking-widest leading-none mt-1">الهدى</span>
                </div>
              </div>
              <p className="text-stone-300 text-sm font-medium leading-relaxed mb-6">
                سلسلة مكتبات ولوازم مدرسية . نقدم لكم أفضل الماركات العالمية بجودة لا تضاهى.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xs bg-white/10 flex items-center justify-center hover:bg-[#5794ff] text-white hover:text-white transition-all group border border-white/15">
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black mb-6 flex items-center gap-2 text-white">
                <span className={cn("w-1.5 h-5 rounded-xs", isOxfordCity ? "bg-[#E31B23]" : "bg-[#5794ff]")} />
                روابط سريعة
              </h4>
              <ul className="space-y-3.5 text-stone-200 text-sm font-bold">
                <li><Link to="/track-order" className="hover:text-amber-300 transition-colors flex items-center gap-2"><Truck size={15} className="text-amber-400" /> تتبع مسار طلبيتك</Link></li>
                <li><a href="#" className="hover:text-amber-300 transition-colors">من نحن؟</a></li>
                <li><a href="#" className="hover:text-amber-300 transition-colors">متاجرنا</a></li>
                <li><a href="#" className="hover:text-amber-300 transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-amber-300 transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black mb-6 flex items-center gap-2 text-white">
                <span className={cn("w-1.5 h-5 rounded-xs", isOxfordCity ? "bg-[#E31B23]" : "bg-[#5794ff]")} />
                تواصل معنا
              </h4>
              <ul className="space-y-4 text-stone-300 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <MapPin className="text-amber-400 shrink-0 mt-0.5" size={18} />
                  <span>مقابل مدرسة عمر بن الخطاب, البليدات, قبلي</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-amber-400 shrink-0" size={18} />
                  <a href="tel:21693997226" dir="ltr" className="hover:text-amber-300 transition-colors">21693997226</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-amber-400 shrink-0" size={18} />
                  <a href="mailto:infobenammar1@gmail.com" className="hover:text-amber-300 transition-colors">infobenammar1@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter Column with Dashboard Access */}
            <div>
              <div className="mb-4">
                <Link 
                  to="/dashboard"
                  className="text-lg font-black flex items-center gap-2 text-white hover:text-amber-300 transition-colors group cursor-pointer inline-flex"
                  title="الدخول إلى لوحة التحكم الإدارية"
                >
                  <span className={cn("w-1.5 h-5 rounded-xs transition-colors", isOxfordCity ? "bg-[#E31B23]" : "bg-amber-300")} />
                  <span>النشرة الإخبارية</span>
                  <LayoutDashboard size={16} className="text-amber-400 opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-transform mr-1" />
                </Link>
              </div>
              <p className="text-stone-300 text-sm font-medium mb-4">اشترك للحصول على آخر العروض والخصومات الحصرية.</p>
              <form className="relative mb-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="w-full bg-white/10 border border-white/20 rounded-xs py-3 pr-4 pl-24 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 outline-none transition-all text-xs font-bold text-white placeholder:text-stone-400"
                />
                <button className={cn(
                  "absolute left-1.5 top-1.5 bottom-1.5 text-white px-4 rounded-xs text-xs font-black transition-all cursor-pointer",
                  isOxfordCity ? "bg-[#E31B23] hover:bg-red-700" : "bg-[#5794ff] hover:bg-[#4686f5]"
                )}>
                  إرسال
                </button>
              </form>
              <div className="pt-2 border-t border-white/10">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-2 text-xs font-bold text-stone-300 hover:text-amber-300 transition-colors py-1 group/dash"
                  title="لوحة تحكم المتجر"
                >
                  <LayoutDashboard size={14} className="text-amber-400 group-hover/dash:rotate-12 transition-transform" />
                  <span>الدخول إلى لوحة التحكم</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-stone-400 text-xs font-bold">
            &copy; 2026 مكتبة الهدى. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 sm:p-7 border-b border-blue-100 flex justify-between items-center bg-[#5794ff] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-md flex items-center justify-center text-[#5794ff] shadow-md">
                    <ShoppingCart size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">سلة التسوق</h2>
                    <p className="text-amber-200 text-xs font-bold uppercase tracking-wider">{cartCount} منتجات مختارة</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2.5 hover:bg-white/15 rounded-md transition-all shadow-xs group cursor-pointer text-white"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center mb-5 text-[#5794ff]">
                      <ShoppingBag size={42} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">سلتك فارغة تماماً</h3>
                    <p className="text-slate-500 text-xs font-medium mb-8 max-w-[240px]">ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك الآن!</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-[#5794ff] hover:bg-[#4686f5] text-white px-8 py-3 rounded-md font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      تصفح المنتجات
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group p-3 rounded-md border border-slate-200/80 hover:border-[#5794ff] bg-slate-50/50 transition-colors">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-white flex-shrink-0 border border-slate-200 p-1">
                        <img
                          src={(item.image && item.image.trim() !== '') ? item.image.trim() : '/logo.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-sm group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#5794ff] transition-colors line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-[#5794ff] font-black text-xs sm:text-sm">{item.price.toFixed(3)} د.ت</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center bg-white rounded-md p-0.5 border border-slate-200 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-sm transition-colors text-slate-600"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-black min-w-[2rem] text-center text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-sm transition-colors text-slate-600"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/80">
                  <div className="space-y-3 mb-6 text-xs font-bold text-slate-600">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي</span>
                      <span className="text-slate-900 font-black">{cartTotal.toFixed(3)} د.ت</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الشحن</span>
                      <span className="text-emerald-600 font-bold">مجاني</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                      <span>الإجمالي</span>
                      <span className="text-[#5794ff] font-black">{cartTotal.toFixed(3)} د.ت</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-[#5794ff] hover:bg-[#4686f5] text-white py-3.5 rounded-md font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
                  >
                    <span>إتمام الشراء والدفع</span>
                    <ArrowRight size={20} className="rotate-180 text-white" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#5794ff] text-white z-50 flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-white/20 flex justify-between items-center bg-[#4686f5]">
                <span className="text-lg font-black text-white">القائمة الرئيسية</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/15 rounded-md text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-3">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-3 rounded-md text-right font-bold transition-all bg-white text-[#5794ff] shadow-md mb-2 text-xs"
                  >
                    <LayoutDashboard size={20} />
                    لوحة التحكم
                  </Link>
                  <Link
                    to="/track-order"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-3 rounded-md text-right font-bold transition-all bg-white/15 text-white hover:bg-white/25 mb-4 text-xs border border-white/20"
                  >
                    <Truck size={20} className="text-amber-200" />
                    تتبع طلبيتك
                  </Link>
                  {allCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <Link
                        to={cat.name === 'الكل' ? '/' : `/category/${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-md text-right font-bold transition-all text-xs",
                          "bg-white/15 hover:bg-white/25 text-white"
                        )}
                      >
                        {renderIcon(cat.icon, "w-5 h-5")}
                        {cat.name}
                      </Link>
                      
                      {cat.subcategories.length > 0 && (
                        <div className="mr-8 space-y-1 border-r-2 border-white/30 pr-3">
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => {
                                navigate(`/category/${encodeURIComponent(cat.name)}?sub=${encodeURIComponent(sub)}`);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-right py-1.5 px-2 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 rounded-md transition-colors flex items-center justify-between"
                            >
                              <span className="text-blue-100 hover:text-white">{sub}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={(userData) => setUser(userData)}
      />

      <StyleSwitcherModal />
    </div>
  );
}
