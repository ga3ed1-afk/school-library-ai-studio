import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CTABanner() {
  const { config } = useStoreTheme();

  return (
    <section className="py-2.5 bg-transparent overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
        <div 
          className={cn(
            "relative overflow-hidden text-white px-4 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-white/20 transition-all duration-300",
            config.cardRadius || "rounded-md",
            `bg-gradient-to-r ${config.bannerGradient || 'from-purple-800 to-stone-900'}`
          )}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-wrap items-center gap-2.5 text-right">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-[11px] font-bold text-white border border-white/30">
              <Sparkles size={12} className="text-amber-300" />
              <span>عرض حصري وفاخر</span>
            </span>
            <span className="text-xs sm:text-sm lg:text-base font-black text-white">
              احصل على خصم <span className="text-amber-300 font-black text-sm sm:text-base">25%</span> على جميع اللوازم المكتبية والمدرسية وتجهيزات الإعلامية
            </span>
            <span className="hidden md:inline text-xs text-purple-100 font-medium border-r border-white/20 pr-2.5">
              تشكيلة بن عمار للمكتبية و الإعلامية الأفضل والأكثر موثوقية
            </span>
          </div>

          <div className="relative z-10 shrink-0 self-end sm:self-auto">
            <Link 
              to="/category/الكل" 
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 px-4 py-1.5 rounded-md font-black text-xs transition-all shadow-md group cursor-pointer"
            >
              <span>تسوق الآن</span>
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform text-stone-950" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
