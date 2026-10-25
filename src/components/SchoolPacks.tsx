import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';

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

const DEFAULT_SCHOOL_PACKS: SchoolPack[] = [];

interface SchoolPacksProps {
  addToCart: (product: Product, quantity?: number) => void;
}

export default function SchoolPacks({ addToCart }: SchoolPacksProps) {
  const [packs, setPacks] = useState<SchoolPack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const loadPacks = () => {
      const allProducts = productService.getProducts();
      // Find real products that are packs or school supply bundles
      const packProducts = allProducts.filter(p => 
        p.name.includes('باقة') || 
        p.name.includes('حزمة') || 
        p.category === 'باقات' ||
        (p.tags && p.tags.includes('باقة'))
      );

      if (packProducts.length > 0) {
        const mappedPacks: SchoolPack[] = packProducts.map(p => ({
          id: `pack-${p.id}`,
          title: p.name,
          level: p.category || 'عرض خاص',
          badge: p.discount ? `تخفيض ${p.discount}%` : 'باقة متكاملة',
          originalPrice: p.compareAtPrice || p.price,
          discountPrice: p.price,
          image: p.image || '/logo.svg',
          description: p.description || p.name,
          items: [{ name: p.name, qty: '1 باقة' }],
          productsToAdd: [p]
        }));
        setPacks(mappedPacks);
        setSelectedPackId(mappedPacks[0].id);
      } else {
        setPacks([]);
      }
    };

    loadPacks();
    window.addEventListener('products_updated', loadPacks);
    return () => window.removeEventListener('products_updated', loadPacks);
  }, []);

  if (packs.length === 0) {
    return null; // Do not show fake mock packs if merchant has not defined any packs
  }

  const activePack = packs.find(p => p.id === selectedPackId) || packs[0];

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
          {packs.map(pack => {
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
                  src={(activePack.image && activePack.image.trim() !== '') ? activePack.image.trim() : '/logo.svg'}
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
                {/* Price display - left empty as requested */}
                <div className="flex items-baseline gap-3 min-h-[1.5rem]" />

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
