import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, User, Heart, Phone, MapPin, Facebook, Instagram, Twitter, LayoutDashboard, LogOut, Truck } from 'lucide-react';
import LoginModal from './LoginModal';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open_cart', handleOpenCart);
    return () => window.removeEventListener('open_cart', handleOpenCart);
  }, []);

  const allCategories = [{ name: 'الكل', icon: '🎒', subcategories: [] }, ...categories];

  const renderIcon = (icon: string, className?: string) => {
    if (icon.startsWith('http')) {
      return <img src={icon} alt="" className={cn("w-6 h-6 object-contain", className)} />;
    }
    return <span className={cn("text-lg", className)}>{icon}</span>;
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
    <div className="min-h-screen bg-white text-oxford-blue font-sans selection:bg-oxford-red selection:text-white">
      {/* Header */}
      <header className="relative z-40 w-full bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-4 lg:py-6">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 lg:hidden text-oxford-blue hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-oxford-blue rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden">
                   <img 
                    src="https://oxfordcity.tn/cdn/shop/files/LOGO_oxford1_32x32.png?v=1746725742" 
                    alt="Logo" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl lg:text-2xl font-extrabold tracking-tighter text-oxford-blue leading-none">أكسفورد</span>
                  <span className="text-sm lg:text-base font-bold text-oxford-red tracking-widest leading-none">سيتي</span>
                </div>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-oxford-blue transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات، كتب، حقائب..."
                  className="w-full bg-stone-100 border-2 border-transparent rounded-xl py-3 pr-12 pl-4 focus:bg-white focus:border-oxford-blue focus:ring-0 transition-all outline-none text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                to="/track-order"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-oxford-blue bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                title="تتبع مسار طلبيتك"
              >
                <Truck size={18} className="text-oxford-red" />
                <span>تتبع الطلب</span>
              </Link>
              <Link 
                to="/dashboard"
                className="hidden sm:flex p-3 text-oxford-blue hover:bg-stone-100 rounded-xl transition-colors group"
                title="لوحة التحكم"
              >
                <LayoutDashboard size={24} className="group-hover:rotate-12 transition-transform" />
              </Link>
              <button 
                onClick={() => user ? setUser(null) : setIsLoginModalOpen(true)}
                className="hidden sm:flex p-3 text-oxford-blue hover:bg-stone-100 rounded-xl transition-colors items-center gap-2"
              >
                {user ? (
                  <>
                    <div className="w-8 h-8 bg-oxford-blue text-white rounded-full flex items-center justify-center text-xs font-black">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden xl:block text-sm font-black text-oxford-blue">{user.name}</span>
                    <LogOut size={16} className="text-oxford-red ml-1" />
                  </>
                ) : (
                  <User size={24} />
                )}
              </button>
              <button className="hidden sm:flex p-3 text-oxford-blue hover:bg-stone-100 rounded-xl transition-colors">
                <Heart size={24} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-oxford-blue hover:bg-stone-100 rounded-xl transition-colors group"
              >
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-oxford-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center border-t border-stone-100">
            <ul className="flex items-center gap-0">
              {allCategories.map((cat) => (
                <li 
                  key={cat.name}
                  className="relative group"
                  onMouseEnter={() => setActiveSubMenu(cat.name)}
                  onMouseLeave={() => setActiveSubMenu(null)}
                >
                  <Link
                    to={cat.name === 'الكل' ? '/' : `/category/${cat.name}`}
                    className={cn(
                      "flex flex-col items-center justify-center px-6 py-4 transition-all border-b-2 border-transparent hover:border-oxford-red group-hover:bg-stone-50 min-w-[120px]",
                      "text-oxford-blue font-bold text-xs uppercase tracking-tight"
                    )}
                  >
                    <div className="mb-2 transition-transform group-hover:scale-110 duration-300">
                      {renderIcon(cat.icon, "w-8 h-8")}
                    </div>
                    <span className="text-center whitespace-nowrap">{cat.name}</span>
                  </Link>

                  {cat.subcategories.length > 0 && activeSubMenu === cat.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full right-0 w-[600px] bg-white border border-stone-100 shadow-2xl rounded-b-xl p-8 z-50 grid grid-cols-2 gap-x-8 gap-y-4"
                    >
                      <div className="col-span-2 mb-4 border-b border-stone-100 pb-2">
                        <h4 className="text-oxford-red font-black text-lg">{cat.name}</h4>
                      </div>
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            navigate(`/category/${cat.name}?sub=${sub}`);
                            setActiveSubMenu(null);
                          }}
                          className="text-right py-2 px-3 rounded-xl text-sm font-bold text-stone-600 hover:bg-oxford-red/5 hover:text-oxford-red transition-all flex items-center justify-between group/item"
                        >
                          <span>{sub}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all rotate-180" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-oxford-blue text-white pt-24 pb-12 rounded-t-[2rem]">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-oxford-blue shadow-lg overflow-hidden">
                   <img 
                    src="https://oxfordcity.tn/cdn/shop/files/LOGO_oxford1_32x32.png?v=1746725742" 
                    alt="Logo" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tighter text-white leading-none">أكسفورد</span>
                  <span className="text-sm font-bold text-oxford-red tracking-widest leading-none">سيتي</span>
                </div>
              </div>
              <p className="text-stone-300 font-medium leading-relaxed mb-8">
                أكبر سلسلة مكتبات ولوازم مدرسية في تونس. نقدم لكم أفضل الماركات العالمية بجودة لا تضاهى.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-oxford-red transition-all group">
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 flex items-center gap-2">
                <span className="w-2 h-6 bg-oxford-red rounded-full" />
                روابط سريعة
              </h4>
              <ul className="space-y-4 text-stone-300 font-bold">
                <li><Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-2 text-stone-200 hover:text-oxford-red"><Truck size={16} className="text-oxford-red" /> تتبع مسار طلبيتك</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">من نحن؟</a></li>
                <li><a href="#" className="hover:text-white transition-colors">متاجرنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 flex items-center gap-2">
                <span className="w-2 h-6 bg-oxford-red rounded-full" />
                تواصل معنا
              </h4>
              <ul className="space-y-6 text-stone-300 font-medium">
                <li className="flex items-start gap-4">
                  <MapPin className="text-oxford-red shrink-0" size={24} />
                  <span>نهج سافيا فرحات، سهلول، سوسة، تونس</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="text-oxford-red shrink-0" size={24} />
                  <span dir="ltr">+216 73 368 304</span>
                </li>
                <li className="flex items-center gap-4">
                  <ShoppingBag className="text-oxford-red shrink-0" size={24} />
                  <span>marketing@oxford.tn</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 flex items-center gap-2">
                <span className="w-2 h-6 bg-oxford-red rounded-full" />
                النشرة الإخبارية
              </h4>
              <p className="text-stone-300 font-medium mb-6">اشترك للحصول على آخر العروض والخصومات الحصرية.</p>
              <form className="relative">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pr-4 pl-16 focus:border-oxford-red outline-none transition-all font-bold"
                />
                <button className="absolute left-2 top-2 bottom-2 bg-oxford-red text-white px-6 rounded-xl font-black hover:bg-white hover:text-oxford-red transition-all">
                  إرسال
                </button>
              </form>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-stone-500 text-sm font-bold">
            &copy; {new Date().getFullYear()} متجر أكسفورد سيتي. جميع الحقوق محفوظة.
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
              className="fixed inset-0 bg-oxford-blue/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col rounded-r-xl"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-tr-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-oxford-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">سلة التسوق</h2>
                    <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">{cartCount} منتجات</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 hover:bg-white rounded-xl transition-all shadow-sm group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-stone-50 rounded-xl flex items-center justify-center mb-6 text-stone-200">
                      <ShoppingBag size={64} />
                    </div>
                    <h3 className="text-2xl font-black text-oxford-blue mb-3">سلتك فارغة تماماً</h3>
                    <p className="text-stone-600 font-medium mb-10 max-w-[250px]">ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك الآن!</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-oxford-blue text-white px-12 py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all"
                    >
                      تصفح المنتجات
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-oxford-blue group-hover:text-oxford-red transition-colors">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-300 hover:text-oxford-red transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          <p className="text-oxford-red font-black">{item.price.toFixed(3)} د.ت</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-stone-50 rounded-lg p-1 border border-stone-100">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-oxford-blue"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 text-sm font-black min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-oxford-blue"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-stone-100 bg-stone-50 rounded-br-xl">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-stone-700 font-bold">
                      <span>المجموع الفرعي</span>
                      <span>{cartTotal.toFixed(3)} د.ت</span>
                    </div>
                    <div className="flex justify-between text-stone-700 font-bold">
                      <span>الشحن</span>
                      <span className="text-emerald-600">مجاني</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-oxford-blue pt-4 border-t border-stone-200">
                      <span>الإجمالي</span>
                      <span>{cartTotal.toFixed(3)} د.ت</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-oxford-red hover:bg-oxford-blue text-white py-5 rounded-xl font-black shadow-2xl shadow-oxford-red/20 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    إتمام الشراء والدفع
                    <ArrowRight size={24} className="rotate-180" />
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
              className="fixed inset-0 bg-oxford-blue/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-50 flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <span className="text-xl font-black">القائمة</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-stone-100 rounded-xl">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-right font-black transition-all bg-oxford-blue text-white shadow-lg mb-2"
                  >
                    <LayoutDashboard size={24} />
                    لوحة التحكم
                  </Link>
                  <Link
                    to="/track-order"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-right font-bold transition-all bg-stone-100 text-oxford-blue hover:bg-stone-200 mb-6"
                  >
                    <Truck size={24} className="text-oxford-red" />
                    تتبع طلبيتك
                  </Link>
                  {allCategories.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <Link
                        to={cat.name === 'الكل' ? '/' : `/category/${cat.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl text-right font-bold transition-all",
                          "bg-stone-50 hover:bg-stone-100"
                        )}
                      >
                        {renderIcon(cat.icon)}
                        {cat.name}
                      </Link>
                      
                      {cat.subcategories.length > 0 && (
                        <div className="mr-12 space-y-1 border-r-2 border-stone-100 pr-4">
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => {
                                navigate(`/category/${cat.name}?sub=${sub}`);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-right py-2 text-sm font-bold text-stone-500 hover:text-oxford-red transition-colors"
                            >
                              {sub}
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
    </div>
  );
}
