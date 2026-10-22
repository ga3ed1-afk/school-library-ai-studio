import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Palette, CornerDownLeft, ShieldCheck } from 'lucide-react';
import { useStoreTheme, STORE_STYLES, StoreStyle } from '../context/ThemeContext';

export default function StyleSwitcherModal() {
  const { currentStyle, setStyle, isStyleModalOpen, setIsStyleModalOpen } = useStoreTheme();

  if (!isStyleModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm" dir="rtl">
        {/* Centering Wrapper */}
        <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[88vh] my-auto overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-2xs">
                  <Palette size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    تغيير ستايل ومظهر المتجر (8 ستايلات مستوحاة)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    اختر النمط المناسب — يتم تطبيق ألوان وزوايا المربعات فوراً على كامل المتجر
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStyleModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Styles Selection List */}
            <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {(Object.keys(STORE_STYLES) as StoreStyle[]).map((styleKey) => {
                const item = STORE_STYLES[styleKey];
                const isSelected = currentStyle === styleKey;

                return (
                  <div
                    key={styleKey}
                    onClick={() => {
                      setStyle(styleKey);
                    }}
                    className={`group relative p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/40 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Check radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 mt-1 ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'border border-slate-300 bg-white group-hover:border-purple-400'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>

                      {/* Content & Details */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {item.subtitle}
                            </span>
                          </div>

                          {/* Corner radius badge */}
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shrink-0">
                            <span>📐 {item.cornerLabel}</span>
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {item.tagline}
                        </p>

                        {/* Colors Palette Preview Dots */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-bold text-slate-400">لوحة الألوان:</span>
                          <div className="flex items-center gap-1.5">
                            {item.previewColors?.map((color, cIdx) => (
                              <span 
                                key={cIdx} 
                                className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs inline-block"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Sparkles size={14} className="text-amber-500" />
                <span>تطبيق فوري مباشر لكافة الألوان وزوايا الكروت</span>
              </div>

              <button
                type="button"
                onClick={() => setIsStyleModalOpen(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
              >
                تأكيد واعتماد الستايل
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
