import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SchoolPack {
  id: string;
  title: string;
  level: string;
  badge: string;
  originalPrice: number;
  discountPrice: number;
  image: string;
  description: string;
  items: { name: string; qty: string }[];
  productsToAdd: Omit<Product, 'reviews'>[];
}

const SCHOOL_PACKS: SchoolPack[] = [
  {
    id: 'pack-primaire',
    title: 'حزمة العودة المدرسية - المرحلة الابتدائية',
    level: 'السنوات من 1 إلى 6 ابتدائي',
    badge: 'الأكثر طلباً',
    originalPrice: 85.000,
    discountPrice: 69.500,
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=600',
    description: 'تتضمن كامل اللوازم الأساسية للتعليم الابتدائي بجودة أكسفورد لحماية كراسات التلميذ طيلة العام الدراسي.',
    items: [
      { name: '4 كراسات أكسفورد 96 صفحة مسطرة فرنسية', qty: '4 قطع' },
      { name: '2 كراس أكسفورد رسم وتلوين', qty: '2 قطع' },
      { name: 'طقم أقلام حبر جاف أزرق وأحمر وأخضر', qty: '1 طقم' },
      { name: 'علبة أقلام تلوين خشبية (12 لوناً)', qty: '1 علبة' },
      { name: 'مجموعة هندسة وأدوات قياس مدرسية', qty: '1 طقم' },
      { name: 'مقلمة قماشية متينة ومقاومة للماء', qty: '1 قطعة' }
    ],
    productsToAdd: [
      {
        id: 901,
        name: 'باقة الابتدائي الشاملة أكسفورد (دفاتر + أدوات + مقلمة)',
        price: 69.500,
        category: 'اللوازم المدرسية',
        image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=600',
        description: 'حزمة الأدوات المدرسية الابتدائية كاملة موفرة بنسبة 18%'
      }
    ]
  },
  {
    id: 'pack-college',
    title: 'حزمة المرحلة الإعدادية المتكاملة',
    level: 'السنوات 7 و 8 و 9 أساسي',
    badge: 'توفير 20%',
    originalPrice: 110.000,
    discountPrice: 88.000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: 'مجموعة شاملة لكراسات الحجم الكبير A4 ومستلزمات الرياضيات والعلوم الموجهة لتلاميذ الإعدادي.',
    items: [
      { name: '6 دفاتر أكسفورد A4 كلاسيك 144 صفحة', qty: '6 قطع' },
      { name: 'طقم هندسة دقيق مقاوم للكسر', qty: '1 طقم' },
      { name: 'آلة حاسبة علمية قياسية', qty: '1 قطعة' },
      { name: 'طقم أقلام تمييز نيون (4 ألوان)', qty: '1 طقم' },
      { name: 'حافظة مستندات ومصنف بلاستيكي أكسفورد', qty: '2 قطع' }
    ],
    productsToAdd: [
      {
        id: 902,
        name: 'باقة الإعدادي المتكاملة أكسفورد (دفاتر A4 + أدوات رياضيات)',
        price: 88.000,
        category: 'اللوازم المدرسية',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        description: 'حزمة المرحلة الإعدادية الشاملة مع دفاتر A4 وأدوات الرياضيات'
      }
    ]
  },
  {
    id: 'pack-lycee',
    title: 'حزمة الثانوي والبكالوريا الفاخرة',
    level: 'السنوات الثانوية وجميع شعب البكالوريا',
    badge: 'باقة الامتياز',
    originalPrice: 135.000,
    discountPrice: 109.000,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
    description: 'مجهزة خصيصاً للمراجعة المكثفة، كراسات سميكة بجودة الورق 90 غرام، ومصنفات لتنظيم الملخصات.',
    items: [
      { name: '8 دفاتر أكسفورد لولبية A4 فاخرة 200 صفحة', qty: '8 قطع' },
      { name: 'مجموعة مصنفات وفواصل تنظيم الدروس أكسفورد', qty: '3 قطع' },
      { name: 'طقم أقلام جل سريعة الجفاف للملخصات', qty: '1 طقم' },
      { name: 'أوراق ملحوظات لاصقة ومؤشرات صفحات ملونة', qty: '1 مجموعة' },
      { name: 'محفظة أدوات جلدية فاخرة', qty: '1 قطعة' }
    ],
    productsToAdd: [
      {
        id: 903,
        name: 'باقة البكالوريا والثانوي أكسفورد (دفاتر لولبية A4 + مصنفات)',
        price: 109.000,
        category: 'اللوازم المدرسية',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
        description: 'حزمة البكالوريا الشاملة مع دفاتر لولبية A4 ومصنفات تنظيم الدروس'
      }
    ]
  }
];

interface SchoolPacksProps {
  addToCart: (product: Product, quantity?: number) => void;
}

export default function SchoolPacks({ addToCart }: SchoolPacksProps) {
  const [selectedPackId, setSelectedPackId] = useState<string>('pack-primaire');
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const activePack = SCHOOL_PACKS.find(p => p.id === selectedPackId) || SCHOOL_PACKS[0];

  const handleAddPack = (pack: SchoolPack) => {
    pack.productsToAdd.forEach(item => {
      addToCart(item as Product, 1);
    });
    setAddedSuccessId(pack.id);
    window.dispatchEvent(new Event('open_cart'));
    setTimeout(() => setAddedSuccessId(null), 3000);
  };

  return (
    <section className="py-8 lg:py-10 bg-transparent border-y border-slate-200/80 text-right" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-[#B8860B] px-3.5 py-0.5 rounded-sm text-xs font-bold mb-2 border border-amber-200/60">
            <Sparkles size={13} className="text-[#D4AF37]" />
            <span>عروض العودة المدرسية والجامعية الفاخرة</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-1.5 tracking-tight">
            باقات اللوازم المدرسية <span className="text-[#5794ff]">الشاملة</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            وفر وقتك ونقودك: قوائم مجهزة بعناية لأبنائكم حسب كل مرحلة دراسية وبأسعار تفاضلية بنقرة واحدة.
          </p>
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {SCHOOL_PACKS.map(pack => {
            const isSelected = pack.id === selectedPackId;
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#5794ff] text-white border border-[#5794ff] shadow-md scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-[#5794ff]'
                }`}
              >
                <span>{pack.title.replace('حزمة ', '')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-xs ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#5794ff] font-bold border border-blue-200/60'}`}>
                  {pack.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pack Showcase Card */}
        <div className="bg-white rounded-xl p-5 lg:p-7 border border-slate-200/90 hover:border-[#5794ff] shadow-md max-w-5xl mx-auto transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Col */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden bg-slate-50 aspect-4/3 border border-slate-200">
                <img
                  src={(activePack.image && activePack.image.trim() !== '') ? activePack.image.trim() : '/logo.jpg'}
                  alt={activePack.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-r from-[#5794ff] to-[#3b7ef5] text-white border border-white/30 text-xs font-black px-2.5 py-0.5 rounded-md shadow-sm">
                {activePack.badge}
              </div>
            </div>

            {/* Content Col */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#5794ff] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                  {activePack.level}
                </span>
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 mt-2.5 mb-2">
                  {activePack.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activePack.description}
                </p>
              </div>

              {/* Items List */}
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/70">
                <h4 className="text-xs font-bold text-slate-900 mb-3">محتويات الباقة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {activePack.items.map((it, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-[#5794ff] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl lg:text-3xl font-black text-red-600">
                    {activePack.discountPrice.toFixed(3)} <span className="text-sm font-bold text-red-500">د.ت</span>
                  </span>
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {activePack.originalPrice.toFixed(3)} د.ت
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    وفر {(activePack.originalPrice - activePack.discountPrice).toFixed(3)} د.ت
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddPack(activePack)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag size={17} />
                  <span>
                    {addedSuccessId === activePack.id ? 'تمت الإضافة للسلة!' : 'إضافة الحزمة كاملة للسلة'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
