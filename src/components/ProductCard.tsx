import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStoreTheme } from '../context/ThemeContext';
import QuickOrderModal from './QuickOrderModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product, quantity?: number) => void;
  priority?: boolean;
  hidePrice?: boolean;
}

const ProductCard = React.memo(({ product, addToCart, priority = false, hidePrice = false }: ProductCardProps) => {
  const { config } = useStoreTheme();
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const imageSrc = (product.image && typeof product.image === 'string' && product.image.trim() !== '')
    ? product.image.trim()
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';

  const cardRadius = config.cardRadius || 'rounded-xs';
  const imageRadius = config.imageRadius || 'rounded-t-xs';
  const btnRadius = config.btnRadius || 'rounded-xs';
  const badgeRadius = config.badgeRadius || 'rounded-xs';

  return (
    <>
      <motion.div
        initial={priority ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileInView={priority ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className={cn(
          "group overflow-hidden border transition-all duration-300 flex flex-col h-full shadow-2xs hover:shadow-lg",
          cardRadius,
          config.cardBg,
          config.cardBorder,
          config.cardHoverBorder
        )}
      >
        {/* Image Box - Follows Style Corner Radius */}
        <div className={cn("relative aspect-square overflow-hidden bg-slate-100", imageRadius)}>
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={imageSrc}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </Link>
          
          {/* Badge - Follows style corner radius and colors */}
          {(product.compareAtPrice && product.compareAtPrice > product.price) ? (
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              <span className={cn(
                "bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wider shadow-2xs border border-white/40",
                badgeRadius
              )}>
                خصم {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
              </span>
            </div>
          ) : product.badge ? (
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 uppercase tracking-wider shadow-2xs border border-white/40",
                badgeRadius,
                config.badgeBg
              )}>
                {product.badge}
              </span>
            </div>
          ) : null}

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
            <button 
              type="button"
              className={cn(
                "w-7 h-7 bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs cursor-pointer",
                btnRadius
              )}
              title="إضافة للمفضلة"
            >
              <Heart size={13} />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className={cn("flex-1 flex flex-col p-3 border-t border-slate-200/70", config.cardContentBg)}>
          <Link to={`/product/${product.id}`} className="block mb-1">
            <h4 className={cn("text-xs sm:text-sm font-bold transition-colors line-clamp-2 leading-snug min-h-[2.4rem]", config.titleColor)}>
              {product.name}
            </h4>
          </Link>

          {product.description && product.description !== product.name && (
            <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-1.5 font-normal">
              {product.description}
            </p>
          )}

          {product.weight && (
            <span className="text-slate-400 text-[10px] font-medium mb-1 block">
              {product.weight}
            </span>
          )}

          {/* Price display - left empty on home page or when price is empty */}
          <div className="mt-auto pt-1.5 flex items-baseline justify-between gap-1 mb-2 min-h-[1.5rem]">
            {!hidePrice && product.price && Number(product.price) > 0 ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-base sm:text-lg font-black leading-tight", config.priceColor || "text-red-600")}>
                    {Number(product.price).toFixed(3)} <span className="text-[10px] font-bold opacity-80">د.ت</span>
                  </span>
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <div className="text-[10px] text-slate-400 font-medium line-through">
                    {Number(product.compareAtPrice).toFixed(3)}
                  </div>
                ) : null}
              </>
            ) : (
              <div />
            )}
          </div>

          {/* Action Buttons: Quick Buy & Cart */}
          <div className="pt-2 border-t border-slate-200/50 flex items-center gap-1.5">
            {/* Quick Buy Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickOrderOpen(true);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-black transition-all cursor-pointer active:scale-95",
                btnRadius,
                config.quickBuyBtn
              )}
              title="شراء فوري سريع بنقرة واحدة"
            >
              <Zap size={13} className="fill-current shrink-0" />
              <span className="whitespace-nowrap font-black">شراء سريع</span>
            </button>

            {/* Separate Add To Cart Button */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className={cn(
                "w-8 h-8 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0",
                btnRadius,
                config.cartBtn
              )}
              title="إضافة إلى السلة"
              aria-label="إضافة إلى السلة"
            >
              <ShoppingCart size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Order Modal */}
      <QuickOrderModal
        product={product}
        quantity={1}
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
