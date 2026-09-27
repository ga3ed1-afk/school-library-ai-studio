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
    <div className="min-h-screen bg-stone-50 py-8 lg:py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-6">
          <Link to="/" className="hover:text-oxford-blue">الرئيسية</Link>
          <span>/</span>
          <span className="text-oxford-blue">تتبع الطلبية</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-sm mb-8 text-right">
          <div className="max-w-xl mx-auto text-center mb-8">
            <div className="w-14 h-14 bg-oxford-blue/10 text-oxford-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck size={28} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 mb-2">
              تتبع مسار طلبيتك
            </h1>
            <p className="text-xs lg:text-sm text-stone-600">
              أدخل رقم الطلب (مثال: #ORD-7281) أو رقم هاتفك لمعرفة حالة الشحن فوراً
            </p>
          </div>

          {/* Search Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="رقم الطلب #ORD-XXXX أو رقم الهاتف..."
                className="w-full pr-10 pl-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-oxford-blue focus:ring-2 focus:ring-oxford-blue/10 text-stone-900"
              />
            </div>
            <button
              type="submit"
              className="bg-oxford-blue hover:bg-oxford-blue/90 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-500">رقم الطلبية:</span>
                    <span className="text-lg font-black text-oxford-blue">{searchedOrder.id}</span>
                  </div>
                  <div className="text-xs text-stone-500">
                    تاريخ الطلب: {searchedOrder.date} • {searchedOrder.customer}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">الحالة:</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-black",
                    searchedOrder.status === 'تم التوصيل' ? "bg-emerald-100 text-emerald-800" :
                    searchedOrder.status === 'تم الشحن' ? "bg-blue-100 text-oxford-blue" :
                    searchedOrder.status === 'قيد المعالجة' ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
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
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
                          isCurrent ? "bg-oxford-red text-white shadow-lg shadow-oxford-red/25 ring-4 ring-oxford-red/10 scale-105" :
                          isDone ? "bg-emerald-600 text-white" :
                          "bg-stone-100 text-stone-400"
                        )}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <h4 className={cn(
                            "text-xs font-bold",
                            isCurrent ? "text-oxford-red font-black" :
                            isDone ? "text-stone-900 font-bold" : "text-stone-400"
                          )}>
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
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
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-right">
                <h3 className="font-bold text-sm text-stone-900 mb-4 pb-2 border-b border-stone-100">
                  محتويات الطلبية ({searchedOrder.items.length} منتج)
                </h3>
                <div className="divide-y divide-stone-100">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-xl bg-stone-50 border border-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          الكمية: {item.quantity} {item.color && `• اللون: ${item.color}`}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-oxford-blue">
                        {(item.price * item.quantity).toFixed(3)} د.ت
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="font-bold">{searchedOrder.subtotal.toFixed(3)} د.ت</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مصاريف الشحن:</span>
                    <span className="font-bold">{searchedOrder.shipping === 0 ? 'مجاني' : `${searchedOrder.shipping.toFixed(3)} د.ت`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>الإجمالي المستحق:</span>
                    <span className="text-oxford-red text-base font-black">{searchedOrder.total.toFixed(3)} د.ت</span>
                  </div>
                </div>
              </div>

              {/* Delivery info & Contact */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-right">
                  <h3 className="font-bold text-sm text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    عنوان التوصيل
                  </h3>
                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-oxford-red shrink-0" />
                      <span className="font-bold text-stone-900">{searchedOrder.city}</span>
                    </div>
                    <p className="pr-5 text-stone-600">{searchedOrder.address}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <Phone size={14} className="text-oxford-blue shrink-0" />
                      <span className="font-bold text-stone-900" dir="ltr">{searchedOrder.phone}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-stone-500">
                      طريقة الدفع: <span className="font-bold text-stone-800">{searchedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-oxford-blue/5 rounded-3xl p-5 border border-oxford-blue/10 text-right">
                  <h4 className="text-xs font-bold text-oxford-blue mb-1">هل تحتاج لمساعدة في طلبيتك؟</h4>
                  <p className="text-[11px] text-stone-600 mb-3">فريق خدمة العملاء جاهز للرد على استفساراتك طيلة أيام الأسبوع.</p>
                  <a
                    href="tel:+21671000000"
                    className="inline-flex items-center gap-2 bg-oxford-blue text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-oxford-blue/90 transition-all"
                  >
                    <Phone size={13} />
                    <span>اتصل بنا: 71 000 000</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">لم يتم العثور على طلب بهذا الرقم</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              يرجى التأكد من كتابة رقم الطلب بصيغة صحيحة (مثال: <span className="font-bold text-oxford-blue">#ORD-7281</span>) أو البحث باستخدام رقم هاتفك المسجل عند الشراء.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSearch('#ORD-7281')}
                className="text-xs text-oxford-red font-bold hover:underline"
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
