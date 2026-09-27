import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Truck, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

interface QuickOrderModalProps {
  product: Product;
  selectedColor?: string;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (orderId: string) => void;
}

const TUNISIAN_GOVERNORATES = [
  'تونس', 'أريانة', 'بن عروس', 'منوبة', 'نابل', 'زغوان', 'بنزرت',
  'باجة', 'جندوبة', 'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية',
  'صفاقس', 'القيروان', 'القصرين', 'سيدي بوزيد', 'قابس', 'مدنين',
  'تطاوين', 'قفصة', 'توزر', 'قبلي'
];

export default function QuickOrderModal({
  product,
  selectedColor,
  quantity,
  isOpen,
  onClose,
  onSuccess
}: QuickOrderModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('تونس');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  const subtotal = product.price * quantity;
  const shippingCost = subtotal >= 100 ? 0 : 7.000;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = orderService.createOrder({
        customer: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city,
        notes: notes.trim() || undefined,
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            color: selectedColor
          }
        ],
        subtotal,
        shipping: shippingCost,
        discount: 0,
        total,
        shippingMethod: 'توصيل سريع لباب المنزل',
        paymentMethod: 'الدفع عند الاستلام (COD)'
      });

      setIsSubmitting(false);
      setOrderConfirmedId(newOrder.id);
      if (onSuccess) {
        onSuccess(newOrder.id);
      }
    }, 600);
  };

  const handleReset = () => {
    setOrderConfirmedId(null);
    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-8 text-right"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-oxford-blue text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">طلب سريع بنقرة واحدة</h3>
                <p className="text-xs text-stone-200">الدفع نقداً عند استلام طلبيتك</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {orderConfirmedId ? (
            /* Order Success State */
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-stone-900 mb-2">تم تسجيل طلبك بنجاح!</h4>
                <p className="text-sm text-stone-600">
                  شكراً لثقتكم بنا. رقم طلبكم هو{' '}
                  <span className="font-bold text-oxford-blue text-base">{orderConfirmedId}</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  سنتصل بك على الرقم <span className="font-bold">{phone}</span> لتأكيد موعد التوصيل.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-right text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>المنتج:</span>
                  <span className="text-oxford-blue line-clamp-1">{product.name}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>الكمية:</span>
                  <span>{quantity} قطعة</span>
                </div>
                {selectedColor && (
                  <div className="flex justify-between text-stone-600">
                    <span>اللون:</span>
                    <span>{selectedColor}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>العنوان:</span>
                  <span>{city} - {address}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-sm">
                  <span>المبلغ الإجمالي عند الاستلام:</span>
                  <span className="text-oxford-red font-black">{total.toFixed(3)} د.ت</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={`/track-order?q=${orderConfirmedId.replace('#', '')}`}
                  className="flex-1 bg-oxford-blue hover:bg-oxford-blue/90 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>تتبع حالة هذا الطلب</span>
                  <ArrowRight size={14} className="rotate-180" />
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl font-bold text-xs transition-all"
                >
                  مواصلة التسوق
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Brief */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-contain rounded-lg bg-white border border-stone-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span>الكمية: {quantity}</span>
                    {selectedColor && <span>• اللون: {selectedColor}</span>}
                  </div>
                  <div className="mt-1 text-xs font-bold text-oxford-red">
                    {(product.price * quantity).toFixed(3)} د.ت
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الاسم واللقب <span className="text-oxford-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد الطرابلسي"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-oxford-blue focus:ring-1 focus:ring-oxford-blue text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      رقم الهاتف <span className="text-oxford-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 98123456"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-oxford-blue focus:ring-1 focus:ring-oxford-blue text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      الولاية <span className="text-oxford-red">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-oxford-blue focus:ring-1 focus:ring-oxford-blue text-stone-900 bg-white"
                    >
                      {TUNISIAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    العنوان بالتفصيل <span className="text-oxford-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="الشارع، الحي، المعلم القريب..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-oxford-blue focus:ring-1 focus:ring-oxford-blue text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ملاحظات التوصيل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أوقات التوصيل المفضلة أو تعليمات خاصة"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-oxford-blue text-stone-900"
                  />
                </div>
              </div>

              {/* Price summary */}
              <div className="pt-2 border-t border-stone-100 text-xs space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>سعر المنتج ({quantity} قطعة):</span>
                  <span className="font-bold">{subtotal.toFixed(3)} د.ت</span>
                </div>
                <div className="flex justify-between">
                  <span>كلفة التوصيل (كامل تراب الجمهورية):</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-bold" : "font-bold"}>
                    {shippingCost === 0 ? 'مجاني (أكثر من 100 د.ت)' : `${shippingCost.toFixed(3)} د.ت`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>المجموع للدفع عند الاستلام:</span>
                  <span className="text-oxford-red text-base font-black">{total.toFixed(3)} د.ت</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 p-2 rounded-lg">
                  <Truck size={14} className="shrink-0 text-emerald-600" />
                  <span>توصيل سريع لباب منزلك خلال 24/48 ساعة</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 p-2 rounded-lg">
                  <ShieldCheck size={14} className="shrink-0 text-oxford-blue" />
                  <span>معاينة المنتج والدفع عند الاستلام</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-oxford-red hover:bg-oxford-red/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جارٍ تسجيل طلبك...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>تأكيد الطلب الآن ({total.toFixed(3)} د.ت)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
