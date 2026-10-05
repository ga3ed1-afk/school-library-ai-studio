import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, Phone, MapPin, ArrowRight } from 'lucide-react';
import { orderService, CustomerOrder } from '../services/orderService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statusSteps = [
  { id: 'قيد المعالجة', label: 'تم استلام الطلب', desc: 'تم استلام طلبكم وهو قيد المراجعة', icon: Clock },
  { id: 'قيد التجهيز', label: 'قيد التجهيز', desc: 'يتم تجهيز المنتجات وتغليفها بعناية', icon: Package },
  { id: 'تم الشحن', label: 'تم الشحن مع التوصيل', desc: 'الطلبية في طريقها إليك مع الموزع', icon: Truck },
  { id: 'تم التوصيل', label: 'تم التسليم بنجاح', desc: 'تم تسليم الطلبية واستلام المبلغ', icon: CheckCircle2 }
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    } else {
      // Load most recent order if available as helpful default
      const orders = orderService.getOrders();
      if (orders.length > 0) {
        setSearchedOrder(orders[0]);
        setHasSearched(true);
      }
    }
  }, [searchParams]);

  const handleSearch = (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    setHasSearched(true);
    if (!q) {
      setSearchedOrder(null);
      return;
    }

    const orders = orderService.getOrders();
    const cleanQ = q.replace('#', '').toLowerCase();

    const found = orders.find(o => 
      o.id.replace('#', '').toLowerCase().includes(cleanQ) ||
      o.phone.replace(/\s+/g, '').includes(cleanQ.replace(/\s+/g, '')) ||
      o.customer.toLowerCase().includes(cleanQ)
    );

    setSearchedOrder(found || null);
  };

  const getStepIndex = (status: CustomerOrder['status']) => {
    if (status === 'قيد المعالجة') return 1;
    if (status === 'تم الشحن') return 2;
    if (status === 'تم التوصيل') return 3;
    return 0;
  };

  const activeIndex = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 lg:py-12 text-slate-900" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#5794ff] transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-[#5794ff] font-black">تتبع الطلبية</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-md p-6 lg:p-10 border border-slate-200/90 shadow-md mb-8 text-right relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5794ff] via-[#85b1ff] to-[#5794ff]" />

          <div className="max-w-xl mx-auto text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#5794ff] to-[#3b7ef5] text-white rounded-md flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
              <Truck size={28} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">
              تتبع مسار طلبيتك
            </h1>
            <p className="text-xs lg:text-sm text-slate-500 font-medium">
              أدخل رقم الطلب (مثال: #ORD-7281) أو رقم هاتفك لمعرفة حالة الشحن فوراً بدقة تامة
            </p>
          </div>

          {/* Search Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="رقم الطلب #ORD-XXXX أو رقم الهاتف..."
                className="w-full pr-10 pl-4 py-3 bg-slate-50 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-[#5794ff] focus:ring-2 focus:ring-blue-200 text-slate-900 font-bold"
              />
            </div>
            <button
              type="submit"
              className="bg-[#5794ff] hover:bg-[#3b7ef5] text-white px-6 py-3 rounded-md font-black text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>بحث عن الطلب</span>
              <ArrowRight size={14} className="rotate-180" />
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchedOrder ? (
          <div className="space-y-6">
            {/* Order Progress Card */}
            <div className="bg-white rounded-md p-6 lg:p-8 border border-slate-200/90 shadow-xs text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500">رقم الطلبية:</span>
                    <span className="text-lg font-black text-[#5794ff] bg-blue-50 px-2.5 py-0.5 rounded-sm border border-blue-200">{searchedOrder.id}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    تاريخ الطلب: {searchedOrder.date} • {searchedOrder.customer}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">الحالة:</span>
                  <span className={cn(
                    "px-3 py-1 rounded-sm text-xs font-black",
                    searchedOrder.status === 'تم التوصيل' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    searchedOrder.status === 'تم الشحن' ? "bg-[#5794ff] text-white" :
                    searchedOrder.status === 'قيد المعالجة' ? "bg-blue-50 text-[#5794ff] border border-blue-200" :
                    "bg-red-50 text-red-700 border border-red-100"
                  )}>
                    {searchedOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="relative flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                        <div className={cn(
                          "w-12 h-12 rounded-md flex items-center justify-center shrink-0 transition-all duration-300",
                          isCurrent ? "bg-[#5794ff] text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-200 scale-105" :
                          isDone ? "bg-gradient-to-tr from-[#5794ff] to-[#3b7ef5] text-white shadow-sm" :
                          "bg-slate-100 text-slate-400"
                        )}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <h4 className={cn(
                            "text-xs font-bold",
                            isCurrent ? "text-[#5794ff] font-black" :
                            isDone ? "text-slate-900 font-bold" : "text-slate-400"
                          )}>
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details & Items Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items List */}
              <div className="lg:col-span-2 bg-white rounded-md p-6 border border-slate-200/90 shadow-xs text-right">
                <h3 className="font-black text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  محتويات الطلبية ({searchedOrder.items.length} منتج)
                </h3>
                <div className="divide-y divide-slate-100">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-md bg-white border border-slate-200 p-1 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          الكمية: {item.quantity} {item.color && `• اللون: ${item.color}`}
                        </div>
                      </div>
                      <div className="text-xs font-black text-[#5794ff]">
                        {(item.price * item.quantity).toFixed(3)} د.ت
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-bold">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="font-black text-slate-900">{searchedOrder.subtotal.toFixed(3)} د.ت</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مصاريف الشحن:</span>
                    <span className="font-black">{searchedOrder.shipping === 0 ? 'مجاني' : `${searchedOrder.shipping.toFixed(3)} د.ت`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>الإجمالي المستحق:</span>
                    <span className="text-2xl font-black text-[#5794ff]">{searchedOrder.total.toFixed(3)} <span className="text-xs text-slate-500">د.ت</span></span>
                  </div>
                </div>
              </div>

              {/* Delivery info & Contact */}
              <div className="space-y-6">
                <div className="bg-white rounded-md p-6 border border-slate-200/90 shadow-xs text-right">
                  <h3 className="font-black text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    عنوان التوصيل
                  </h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#5794ff] shrink-0" />
                      <span className="font-bold text-slate-900">{searchedOrder.city}</span>
                    </div>
                    <p className="pr-5 text-slate-600">{searchedOrder.address}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <Phone size={14} className="text-[#5794ff] shrink-0" />
                      <span className="font-bold text-slate-900" dir="ltr">{searchedOrder.phone}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500">
                      طريقة الدفع: <span className="font-bold text-[#5794ff]">{searchedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#102a5c] rounded-md p-5 border border-[#5794ff]/30 text-right text-white shadow-md">
                  <h4 className="text-xs font-black text-white mb-1">هل تحتاج لمساعدة في طلبيتك؟</h4>
                  <p className="text-[11px] text-slate-300 mb-3">فريق خدمة العملاء جاهز للرد على استفساراتك طيلة أيام الأسبوع.</p>
                  <a
                    href="tel:+21671000000"
                    className="inline-flex items-center gap-2 bg-[#5794ff] hover:bg-[#3b7ef5] text-white px-4 py-2 rounded-md text-xs font-black shadow-xs transition-all"
                  >
                    <Phone size={13} />
                    <span>اتصل بنا: 71 000 000</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-md p-10 border border-slate-200/90 shadow-xs text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#5794ff] rounded-full flex items-center justify-center mx-auto border border-blue-200">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">لم يتم العثور على طلب بهذا الرقم</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              يرجى التأكد من كتابة رقم الطلب بصيغة صحيحة (مثال: <span className="font-bold text-[#5794ff]">#ORD-7281</span>) أو البحث باستخدام رقم هاتفك المسجل عند الشراء.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSearch('#ORD-7281')}
                className="text-xs text-[#5794ff] font-black hover:underline cursor-pointer"
              >
                جرب استعراض طلب تجريبي (#ORD-7281)
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
