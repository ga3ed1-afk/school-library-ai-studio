import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="py-2.5 bg-transparent overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
        <div 
          className="relative overflow-hidden rounded-md text-white px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-blue-500/15 border border-white/30"
          style={{
            background: `linear-gradient(135deg, #5794ff 0%, #3b7ef5 50%, #2563eb 100%)`
          }}
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
              احصل على خصم <span className="text-[#DFB15B] font-black text-sm sm:text-base">25%</span> على جميع المستلزمات والدفاتر
            </span>
            <span className="hidden md:inline text-xs text-blue-100 font-medium border-r border-white/20 pr-2.5">
              تشكيلة مكتبة الهدى الأفضل والأكثر موثوقية
            </span>
          </div>

          <div className="relative z-10 shrink-0 self-end sm:self-auto">
            <Link 
              to="/category/الكل" 
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#DFB15B] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-slate-950 px-4 py-1.5 rounded-md font-black text-xs transition-all shadow-md group cursor-pointer"
            >
              <span>تسوق الآن</span>
              <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform text-slate-950" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

