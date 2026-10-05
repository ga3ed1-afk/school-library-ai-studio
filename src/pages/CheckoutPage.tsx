import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Trash2, 
  Plus, 
  Minus,
  Sparkles,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { orderService } from '../services/orderService';

interface CheckoutPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CheckoutPage({ cart, setCart }: CheckoutPageProps) {
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('أحمد بن علي');
  const [phone, setPhone] = useState('+216 22 333 444');
  const [address, setAddress] = useState('نهج الحبيب بورقيبة، تونس العاصمة');
  const [city, setCity] = useState('تونس');
  const [postalCode, setPostalCode] = useState('1000');
  const [notes, setNotes] = useState('');
  
  // Shipping & Payment selection
  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  
  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 7.000 : 0.000;
  const total = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'OXFORD10' || promoCode.trim().toUpperCase() === 'PROMO') {
      const discount = subtotal * 0.10;
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'FREE') {
      const discount = 5.000;
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      setPromoError('الرمز الترويجي غير صالح');
      setPromoApplied(false);
      setDiscountAmount(0);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => 
      prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('يرجى ملء جميع الحقول الإلزامية (الاسم، الهاتف، العنوان)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = orderService.createOrder({
        customer: fullName,
        phone,
        address,
        city,
        postalCode,
        notes,
        subtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total,
        shippingMethod: shippingMethod === 'express' ? 'توصيل سريع (Aramex)' : 'توصيل عادي',
        paymentMethod: paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.colors?.[0]
        }))
      });

      // Clear cart
      setCart([]);
      setIsSubmitting(false);
      setOrderSuccess(newOrder);
    }, 1000);
  };

  // If order was successfully completed:
  if (orderSuccess) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#F8FAFC] py-12 text-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-md p-8 sm:p-12 shadow-2xl border border-slate-200/80 text-center relative overflow-hidden"
        >
          {/* Subtle gold top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

          <div className="w-20 h-20 bg-amber-50 text-[#B8860B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-200/60">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>

          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-sm inline-block mb-3 border border-amber-200">
            تم استلام طلبك بنجاح
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            شكراً لطلبك من مكتبة الهدى!
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            رقم الطلب الخاص بك هو <span className="font-black text-[#5794ff] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200 text-lg dir-ltr">{orderSuccess.id}</span>. سنقوم بالتواصل معك لتأكيد موعد التوصيل.
          </p>

          {/* Order Details card */}
          <div className="bg-[#5794ff]/[0.03] rounded-md p-6 mb-8 text-right space-y-4 border border-slate-200/90 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-500">العميل المستلم:</span>
              <span className="font-black text-slate-900">{orderSuccess.customer}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-500">رقم الهاتف:</span>
              <span className="font-bold text-slate-900 dir-ltr">{orderSuccess.phone}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-500">عنوان التوصيل:</span>
              <span className="font-bold text-slate-700">{orderSuccess.address} - {orderSuccess.city}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-500">طريقة الدفع:</span>
              <span className="font-black text-[#5794ff]">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-black text-slate-900">المبلغ الإجمالي المستحق:</span>
              <span className="text-2xl font-black text-[#5794ff]">{orderSuccess.total.toFixed(3)} <span className="text-sm font-bold text-slate-600">د.ت</span></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-[#5794ff] text-white px-8 py-3.5 rounded-md font-black shadow-md hover:bg-[#3b7ef5] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={20} />
              مواصلة التسوق
            </Link>
            <Link 
              to="/dashboard?tab=orders" 
              className="bg-slate-900 text-white px-8 py-3.5 rounded-md font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <PackageCheck size={20} />
              عرض في لوحة التحكم (الطلبات)
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-[#F8FAFC]">
        <div className="w-24 h-24 bg-blue-50 text-[#5794ff] rounded-md flex items-center justify-center mb-6 border border-blue-200/60 shadow-xs">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">سلة المشتريات فارغة</h1>
        <p className="text-slate-500 font-medium mb-8 max-w-md">
          لم تقم بإضافة أي منتجات إلى السلة بعد. تصفح تشكيلات مكتبة الهدى المميزة واختر ما يناسبك!
        </p>
        <Link 
          to="/" 
          className="bg-[#5794ff] text-white px-8 py-3.5 rounded-md font-black shadow-md hover:bg-[#3b7ef5] transition-all flex items-center gap-2"
        >
          <ArrowRight size={20} className="rotate-180" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 text-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#5794ff] transition-colors">الرئيسية</Link>
          <ChevronRight size={14} className="rotate-180 text-slate-300" />
          <span className="text-[#5794ff] font-black">إتمام الطلب والدفع</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <span>إتمام الطلب والدفع</span>
          <span className="text-xs font-black bg-[#5794ff] text-white px-3 py-1 rounded-full shadow-xs">
            {cart.reduce((s, i) => s + i.quantity, 0)} عناصر
          </span>
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Customer Info & Options (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address Section */}
              <div className="bg-white rounded-md p-6 sm:p-8 shadow-xs border border-slate-200/90">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-md bg-[#5794ff] text-white flex items-center justify-center font-black shadow-xs">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">معلومات التوصيل والشحن</h2>
                    <p className="text-xs text-slate-400 font-medium">أدخل بيانات العنوان بدقة لتسريع وصول طلبك</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User size={14} className="text-[#D4AF37]" />
                      الاسم الكامل *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أحمد بن علي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-amber-200/40 outline-none transition-all font-bold text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone size={14} className="text-[#D4AF37]" />
                      رقم الهاتف (للتواصل عند التسليم) *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 22 333 444"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-amber-200/40 outline-none transition-all font-bold text-sm text-slate-800 dir-ltr text-right"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">العنوان الكامل والنهج *</label>
                    <input 
                      type="text" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="نهج، عمارة، شقة، الحي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-amber-200/40 outline-none transition-all font-bold text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">المدينة / الولاية *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-sm text-slate-800 cursor-pointer"
                    >
                      <option value="تونس">تونس</option>
                      <option value="أريانة">أريانة</option>
                      <option value="بن عروس">بن عروس</option>
                      <option value="منوبة">منوبة</option>
                      <option value="سوسة">سوسة</option>
                      <option value="صفاقس">صفاقس</option>
                      <option value="نابل">نابل</option>
                      <option value="المنستير">المنستير</option>
                      <option value="بنزرت">بنزرت</option>
                      <option value="القيروان">القيروان</option>
                      <option value="قابس">قابس</option>
                      <option value="مدنين">مدنين</option>
                      <option value="أخرى">ولاية أخرى</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">الترقيم البريدي</label>
                    <input 
                      type="text" 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-amber-200/40 outline-none transition-all font-bold text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">ملاحظات إضافية للتوصيل (اختياري)</label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي تعليمات إضافية لمندوب الشحن..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2.5 px-3.5 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-medium text-sm text-slate-800 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method Section */}
              <div className="bg-white rounded-md p-6 sm:p-8 shadow-xs border border-slate-200/90">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-[#5794ff] text-white flex items-center justify-center font-black shadow-xs">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">خيار الشحن</h2>
                    <p className="text-xs text-slate-400 font-medium">حدد سرعة وطريقة التوصيل المناسبة</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label 
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-md cursor-pointer border-2 transition-all ${
                      shippingMethod === 'express' 
                        ? 'border-[#5794ff] bg-blue-50/50 shadow-xs ring-1 ring-[#5794ff]' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shippingOption" 
                        checked={shippingMethod === 'express'} 
                        onChange={() => setShippingMethod('express')}
                        className="w-4 h-4 accent-[#5794ff]" 
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">توصيل سريع خاص (Aramex VIP)</p>
                        <p className="text-[11px] text-slate-500 font-medium">التوصيل خلال ٢٤-٤٨ ساعة مباشرة لباب المنزل</p>
                      </div>
                    </div>
                    <span className="font-black text-[#5794ff] text-sm">7.000 د.ت</span>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-md cursor-pointer border-2 transition-all ${
                      shippingMethod === 'standard' 
                        ? 'border-[#5794ff] bg-blue-50/50 shadow-xs ring-1 ring-[#5794ff]' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shippingOption" 
                        checked={shippingMethod === 'standard'} 
                        onChange={() => setShippingMethod('standard')}
                        className="w-4 h-4 accent-[#5794ff]" 
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">توصيل قياسي مجاني</p>
                        <p className="text-[11px] text-slate-500 font-medium">التوصيل خلال ٣-٥ أيام عمل</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-sm">مجاني</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-md p-6 sm:p-8 shadow-xs border border-slate-200/90">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-[#5794ff] text-white flex items-center justify-center font-black shadow-xs">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">طريقة الدفع</h2>
                    <p className="text-xs text-slate-400 font-medium">اختر وسيلة الدفع الأكثر أماناً وملاءمة لك</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label 
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-4 rounded-md cursor-pointer border-2 transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-[#5794ff] bg-blue-50/50 shadow-xs ring-1 ring-[#5794ff]' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentOption" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-[#5794ff]" 
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">الدفع نقداً عند الاستلام (COD)</p>
                        <p className="text-[11px] text-slate-500 font-medium">ادفع نقداً لمندوب التوصيل بعد استلام ومعاينة الطرد</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-[#5794ff] px-2.5 py-1 rounded-md border border-blue-200">موصى به</span>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-4 rounded-md cursor-pointer border-2 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-[#5794ff] bg-blue-50/50 shadow-xs ring-1 ring-[#5794ff]' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentOption" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 accent-[#5794ff]" 
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">البطاقة البنكية / البريدية (GDA / Visa / Mastercard)</p>
                        <p className="text-[11px] text-slate-500 font-medium">دفع إلكتروني آمن 100% ومشفر بنظام 3D-Secure</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <span>CIB / Flouci</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-md p-6 sm:p-8 shadow-xs border border-slate-200/90 sticky top-28 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">ملخص الطلب</h3>
                  <span className="text-xs font-bold text-slate-400">{cart.length} أنواع منتجات</span>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-md bg-white border border-slate-200 overflow-hidden shrink-0 p-1">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                          <span className="text-[11px] text-[#5794ff] font-extrabold block">
                            {item.price.toFixed(3)} د.ت
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-black text-slate-900">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="حذف من السلة"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode} 
                      onChange={(e) => setPromoCode(e.target.value)} 
                      placeholder="رمز ترويجي (جرب: OXFORD10)"
                      className="bg-white border border-slate-200 rounded-md outline-none flex-1 font-bold text-xs px-2.5 py-1.5 text-slate-700 uppercase focus:border-[#5794ff]"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyPromo}
                      className="bg-[#5794ff] text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-[#3b7ef5] transition-all cursor-pointer shadow-xs"
                    >
                      تطبيق
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-1.5 px-2 flex items-center gap-1">
                      <Sparkles size={12} />
                      تم تطبيق الخصم بنجاح!
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-red-500 font-bold mt-1.5 px-2">
                      {promoError}
                    </p>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-3 text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span>المجموع الفرعي:</span>
                    <span className="text-slate-900 font-black">{subtotal.toFixed(3)} د.ت</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>الخصم المطبق:</span>
                      <span className="font-black">-{discountAmount.toFixed(3)} د.ت</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>رسوم الشحن والتوصيل:</span>
                    <span className={shippingCost === 0 ? "text-emerald-600 font-black" : "text-slate-900 font-black"}>
                      {shippingCost === 0 ? 'مجاني' : `${shippingCost.toFixed(3)} د.ت`}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span className="text-base font-black text-slate-900">الإجمالي للدفع:</span>
                    <span className="text-2xl font-black text-[#5794ff]">{total.toFixed(3)} <span className="text-sm font-bold text-slate-600">د.ت</span></span>
                  </div>
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5794ff] hover:bg-[#3b7ef5] text-white py-4 rounded-md font-black shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                      جارٍ تسجيل وتأكيد الطلب...
                    </span>
                  ) : (
                    <>
                      <span>تأكيد الطلب والإنهاء</span>
                      <ArrowRight size={18} className="rotate-180" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-medium">
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  <span>ضمان الجودة والأصالة من مكتبة الهدى</span>
                </div>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
