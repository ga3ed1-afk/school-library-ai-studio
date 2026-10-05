import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Palette } from 'lucide-react';
import { useStoreTheme, STORE_STYLES, StoreStyle } from '../context/ThemeContext';

export default function StyleSwitcherModal() {
  const { currentStyle, setStyle, isStyleModalOpen, setIsStyleModalOpen } = useStoreTheme();

  if (!isStyleModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm" dir="rtl">
        {/* Centering Wrapper with generous vertical padding so it is never truncated */}
        <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white w-full max-w-xl rounded-md shadow-2xl border border-slate-300 flex flex-col max-h-[88vh] my-auto overflow-hidden"
          >
            {/* Header - Fixed & Always Visible */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    اختيار ستايل ومظهر المتجر
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    اختر النمط المناسب لتطبيقه على كافة أرجاء المتجر
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStyleModalOpen(false)}
                className="w-8 h-8 rounded-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Styles Selection List - Scrollable with min-h-0 so footer is never clipped */}
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
                    className={`group relative p-3.5 sm:p-4 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/40'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'border border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-slate-100 text-slate-600 border border-slate-200">
                            {item.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                          {item.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Fixed, Visible & Never Truncated */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Sparkles size={14} className="text-amber-500" />
                <span>حفظ تلقائي وفوري</span>
              </div>

              <button
                type="button"
                onClick={() => setIsStyleModalOpen(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs sm:text-sm font-black shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
              >
                تأكيد وإغلاق
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
