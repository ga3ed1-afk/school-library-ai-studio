import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Plus, Minus, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product, quantity?: number) => void;
  priority?: boolean;
}

const ProductCard = React.memo(({ product, addToCart, priority = false }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <motion.div
      initial={priority ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={priority ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group bg-white rounded-md overflow-hidden border border-stone-200/80 hover:shadow-xl hover:shadow-oxford-blue/10 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.price < 100 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
              سعر لقطة
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <button className="w-9 h-9 bg-white/95 backdrop-blur-md rounded-sm flex items-center justify-center text-oxford-blue hover:bg-oxford-red hover:text-white transition-all shadow-md">
            <Heart size={16} />
          </button>
        </div>
      </div>

      <div className="single-shopping-card-one flex-1 flex flex-col p-3">
        {/* Category without SKU to maximize space */}
        {product.category && (
          <div className="mb-1">
            <span className="text-[10px] text-stone-500 font-normal truncate block">
              {product.category}
            </span>
          </div>
        )}

        <Link to={`/product/${product.id}`} className="block mb-1">
          <h4 className="text-xs sm:text-sm font-normal text-stone-800 group-hover:text-oxford-red transition-colors line-clamp-2 leading-snug min-h-[2.2rem]">
            {product.name}
          </h4>
        </Link>

        {product.weight && (
          <span className="text-stone-400 text-[10px] font-light mb-1 block">
            {product.weight}
          </span>
        )}

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base sm:text-lg font-bold text-oxford-red">
            {product.price.toFixed(3)} <span className="text-[10px] font-normal">د.ت</span>
          </span>
          <div className="text-[10px] text-stone-400 font-light line-through">
            {(product.price * 1.2).toFixed(3)}
          </div>
        </div>

        <div className="mt-auto pt-1">
          <div className="flex items-stretch gap-1.5 h-9">
            <div className="flex items-center bg-white rounded-md border border-stone-200 overflow-hidden flex-1">
              <input 
                type="text" 
                readOnly 
                value={quantity} 
                className="w-full bg-transparent text-center text-sm font-black text-oxford-blue outline-none px-1"
              />
              <div className="flex flex-col border-r border-stone-200 w-7">
                <button 
                  onClick={handleIncrement}
                  className="flex-1 flex items-center justify-center hover:bg-stone-100 text-stone-600 transition-colors"
                >
                  <ChevronUp size={10} />
                </button>
                <button 
                  onClick={handleDecrement}
                  className="flex-1 flex items-center justify-center hover:bg-stone-100 text-stone-600 transition-colors border-t border-stone-200"
                >
                  <ChevronDown size={10} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => addToCart(product, quantity)}
              className="flex items-center justify-center gap-1.5 bg-oxford-blue hover:bg-oxford-red text-white px-3 rounded-md transition-all group/btn shadow-md hover:shadow-lg"
            >
              <span className="text-xs font-black whitespace-nowrap">يضيف</span>
              <ShoppingCart size={12} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
