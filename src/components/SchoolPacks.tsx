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
    <section className="py-16 bg-stone-50 border-y border-stone-200 text-right" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-oxford-red/10 text-oxford-red px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles size={14} />
            <span>عروض العودة المدرسية والجامعية</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-stone-900 mb-3">
            باقات اللوازم المدرسية <span className="text-oxford-red">الشاملة</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            وفر وقتك ونقودك: قوائم مجهزة بعناية لأبنائكم حسب كل مرحلة دراسية وبأسعار تفاضلية بنقرة واحدة.
          </p>
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {SCHOOL_PACKS.map(pack => {
            const isSelected = pack.id === selectedPackId;
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-oxford-blue text-white shadow-lg shadow-oxford-blue/20 scale-102'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{pack.title.replace('حزمة ', '')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-oxford-red/10 text-oxford-red font-bold'}`}>
                  {pack.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pack Showcase Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Col */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden bg-stone-100 aspect-4/3 border border-stone-100">
                <img
                  src={activePack.image}
                  alt={activePack.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-4 right-4 bg-oxford-red text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                {activePack.badge}
              </div>
            </div>

            {/* Content Col */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-oxford-blue bg-oxford-blue/5 px-3 py-1 rounded-full">
                  {activePack.level}
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-stone-900 mt-2 mb-2">
                  {activePack.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activePack.description}
                </p>
              </div>

              {/* Items List */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <h4 className="text-xs font-bold text-stone-800 mb-3">محتويات الباقة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activePack.items.map((it, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl lg:text-3xl font-black text-oxford-red">
                    {activePack.discountPrice.toFixed(3)} د.ت
                  </span>
                  <span className="text-sm text-stone-400 line-through font-bold">
                    {activePack.originalPrice.toFixed(3)} د.ت
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    وفر {(activePack.originalPrice - activePack.discountPrice).toFixed(3)} د.ت
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddPack(activePack)}
                  className="bg-oxford-blue hover:bg-oxford-red text-white px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-oxford-blue/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={18} />
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
