import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoreStyle = 'oxfordcity' | 'original' | 'minimalist' | 'vibrant' | 'oxford';

export interface StyleConfig {
  id: StoreStyle;
  name: string;
  subtitle: string;
  tagline: string;
  accentColor: string;
  headerBg: string;
  cardBg: string;
  cardContentBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  titleColor: string;
  priceColor: string;
  quickBuyBtn: string;
  cartBtn: string;
  badgeBg: string;
  badgeText: string;
  bannerGradient: string;
  tagText: string;
}

export const STORE_STYLES: Record<StoreStyle, StyleConfig> = {
  oxfordcity: {
    id: 'oxfordcity',
    name: 'تنسيق أكسفورد سيتي الرسمي',
    subtitle: 'Official Oxford City (White & Red)',
    tagline: 'التنسيق الرسمي لموقع أكسفورد سيتي: هيدر أبيض نقي، شعار أكسفورد سيتي، لمسات حمراء وزرقاء، وخلفيات ستون أنيقة',
    accentColor: '#E31B23',
    headerBg: 'bg-white',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-stone-200',
    cardHoverBorder: 'hover:border-[#0A192F]',
    titleColor: 'text-stone-900 hover:text-red-600',
    priceColor: 'text-red-600',
    quickBuyBtn: 'bg-red-600 hover:bg-red-700 text-white font-black shadow-xs',
    cartBtn: 'bg-stone-100 hover:bg-stone-200 text-[#0A192F] border border-stone-300 font-black shadow-2xs',
    badgeBg: 'bg-red-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-[#0A192F] via-[#102a5c] to-[#0A192F]',
    tagText: 'أكسفورد سيتي'
  },
  original: {
    id: 'original',
    name: 'الستايل السابق المعتمد',
    subtitle: 'Original Oxford & Emerald',
    tagline: 'الستايل المعتمد الأصلي: أزرق أكسفورد، خلفية فضية للمنتجات، عناوين خضراء زمردية، وأسعار حمراء مميزة',
    accentColor: '#5794ff',
    headerBg: 'bg-[#5794ff]',
    cardBg: 'bg-slate-100',
    cardContentBg: 'bg-slate-100',
    cardBorder: 'border-slate-300',
    cardHoverBorder: 'hover:border-emerald-500',
    titleColor: 'text-emerald-700 hover:text-emerald-800',
    priceColor: 'text-red-600',
    quickBuyBtn: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-black shadow-xs',
    cartBtn: 'bg-[#2CFF05] hover:bg-[#26e604] text-slate-950 font-black shadow-xs',
    badgeBg: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-[#5794ff] to-[#3b7ef5]',
    tagText: 'سعر حصري'
  },
  minimalist: {
    id: 'minimalist',
    name: 'المودرن الفاخر والنقي',
    subtitle: 'Minimalist Premium',
    tagline: 'تصميم نقي، هادئ، يبرز المنتجات بخلفيات بيضاء ناصعة ولمسات زمردية راقية',
    accentColor: '#059669',
    headerBg: 'bg-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-slate-200/90',
    cardHoverBorder: 'hover:border-emerald-500',
    titleColor: 'text-slate-900 hover:text-emerald-700',
    priceColor: 'text-red-600',
    quickBuyBtn: 'bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xs',
    cartBtn: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-black shadow-2xs',
    badgeBg: 'bg-slate-900 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-slate-900 to-slate-800',
    tagText: 'سعر حصري'
  },
  vibrant: {
    id: 'vibrant',
    name: 'المدرسي الحيوي',
    subtitle: 'Vibrant School & Kids',
    tagline: 'ألوان مبهجة وتفاعلية تناسب العودة المدرسية، مع أزرار بارزة وحيوية',
    accentColor: '#2563eb',
    headerBg: 'bg-blue-600',
    cardBg: 'bg-white',
    cardContentBg: 'bg-gradient-to-b from-blue-50/20 to-white',
    cardBorder: 'border-blue-100 hover:border-blue-400',
    cardHoverBorder: 'hover:border-blue-500',
    titleColor: 'text-blue-950 hover:text-blue-600',
    priceColor: 'text-red-600',
    quickBuyBtn: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black shadow-xs',
    cartBtn: 'bg-[#2CFF05] hover:bg-[#26e604] text-slate-950 font-black shadow-xs',
    badgeBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-blue-600 via-indigo-600 to-blue-700',
    tagText: 'عرض خاص'
  },
  oxford: {
    id: 'oxford',
    name: 'كلاسيك أكسفورد التراثي',
    subtitle: 'Heritage Oxford Navy & Gold',
    tagline: 'كحلي داكن عميق ولمسات ذهبية ملكية وفضية تعكس فخامة وجودة متجر أكسفورد',
    accentColor: '#D4AF37',
    headerBg: 'bg-[#0A192F]',
    cardBg: 'bg-slate-100',
    cardContentBg: 'bg-slate-100',
    cardBorder: 'border-slate-300',
    cardHoverBorder: 'hover:border-amber-500',
    titleColor: 'text-emerald-800 hover:text-emerald-700',
    priceColor: 'text-red-600',
    quickBuyBtn: 'bg-[#0A192F] hover:bg-[#152a4a] text-[#D4AF37] font-black border border-[#D4AF37]/50 shadow-xs',
    cartBtn: 'bg-[#D4AF37] hover:bg-[#c29f2f] text-slate-950 font-black shadow-xs',
    badgeBg: 'bg-gradient-to-r from-[#0A192F] to-[#1c3558] text-[#D4AF37] border border-[#D4AF37]/40',
    badgeText: 'text-[#D4AF37]',
    bannerGradient: 'from-[#0A192F] via-[#102a5c] to-[#0A192F]',
    tagText: 'أكسفورد سيتي'
  }
};

interface ThemeContextType {
  currentStyle: StoreStyle;
  setStyle: (style: StoreStyle) => void;
  config: StyleConfig;
  isStyleModalOpen: boolean;
  setIsStyleModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentStyle, setCurrentStyle] = useState<StoreStyle>(() => {
    try {
      const saved = localStorage.getItem('oxford_store_style');
      if (saved && (saved === 'oxfordcity' || saved === 'original' || saved === 'minimalist' || saved === 'vibrant' || saved === 'oxford')) {
        return saved as StoreStyle;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'oxfordcity';
  });

  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  const setStyle = (style: StoreStyle) => {
    setCurrentStyle(style);
    try {
      localStorage.setItem('oxford_store_style', style);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-store-style', currentStyle);
  }, [currentStyle]);

  const config = STORE_STYLES[currentStyle] || STORE_STYLES.oxfordcity;

  return (
    <ThemeContext.Provider
      value={{
        currentStyle,
        setStyle,
        config,
        isStyleModalOpen,
        setIsStyleModalOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useStoreTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useStoreTheme must be used within ThemeProvider');
  }
  return context;
}
