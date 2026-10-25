import React, { useRef, useState, useEffect } from 'react';
import { Star, Eye, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';

interface FeaturedBooksProps {
  addToCart?: (product: Product) => void;
}

export default function FeaturedBooks({ addToCart }: FeaturedBooksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [books, setBooks] = useState<Product[]>(() => {
    return productService.getProducts().filter(p => 
      p.category === 'الكتب' || 
      (p.category && p.category.includes('كتب'))
    );
  });

  useEffect(() => {
    const handleUpdate = () => {
      setBooks(
        productService.getProducts().filter(p => 
          p.category === 'الكتب' || 
          (p.category && p.category.includes('كتب'))
        )
      );
    };
    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  // Automatic smooth scrolling with seamless wrap
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || books.length <= 2) return;

    let animId: number;
    const speed = 0.8;

    const step = () => {
      if (!isHovered && el) {
        el.scrollLeft -= speed;
        const halfWidth = el.scrollWidth / 2;
        if (Math.abs(el.scrollLeft) >= halfWidth) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHovered, books.length]);

  if (books.length === 0) {
    return null; // Don't show fake mock books if none exist in store
  }

  const displayBooks = books.length >= 4 ? [...books, ...books] : books;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (book: Product) => {
    if (addToCart) {
      addToCart(book);
      setAddedId(book.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <section className="py-10 bg-transparent border-t border-b border-slate-200/80">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-8 bg-gradient-to-b from-[#5794ff] to-[#2563eb] rounded-full" />
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">الكتب المميزة</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">مختارات من أمهات الكتب والمراجع الدينية والتربوية الفاخرة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1.5 bg-blue-50/60 p-1 rounded-md border border-blue-100">
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-sm bg-white hover:bg-[#5794ff] hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                title="الكتب السابقة"
                aria-label="الكتب السابقة"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-sm bg-white hover:bg-[#5794ff] hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                title="الكتب التالية"
                aria-label="الكتب التالية"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <Link 
              to="/category/الكتب" 
              className="text-[#5794ff] hover:text-blue-700 font-bold hover:underline flex items-center gap-1.5 text-xs sm:text-sm group px-3.5 py-2 bg-blue-50 hover:bg-blue-100/80 rounded-md border border-blue-200/60 transition-colors"
            >
              <span>استكشف المزيد</span>
              <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Books Track - Seamless Continuous Infinite Track, pauses on hover */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-3 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayBooks.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-[#5794ff] hover:shadow-xl transition-all duration-300 w-[240px] sm:w-[260px] lg:w-[280px] shrink-0 flex flex-col justify-between shadow-xs"
            >
              {/* Image Container - Aspect 3/4 with tight clean styling */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 rounded-t-xl">
                  <Link to={`/product/${book.id}`} className="block w-full h-full">
                  <img 
                    src={(book.image && book.image.trim() !== '') ? book.image.trim() : '/logo.svg'} 
                    alt={book.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </Link>
                
                {/* Badges */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                  {book.discount ? (
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                      -{book.discount}%
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-[#5794ff] to-[#3b7ef5] text-white border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                      كتاب مميز
                    </span>
                  )}
                </div>

                {/* Quick preview buttons */}
                <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to={`/product/${book.id}`}
                    className="w-8 h-8 bg-white/95 hover:bg-[#5794ff] hover:text-white text-slate-700 rounded-md flex items-center justify-center transition-colors shadow-xs"
                    title="معاينة الكتاب"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    {book.sku && (
                      <span className="text-[10px] font-mono font-bold text-[#5794ff] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">
                        {book.sku}
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px] font-medium truncate max-w-[120px]">{book.category}</span>
                  </div>

                  <Link to={`/product/${book.id}`}>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-[#5794ff] transition-colors leading-snug min-h-[2.6rem]">
                      {book.name}
                    </h3>
                  </Link>
                  
                  {/* Price */}
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-base font-black text-slate-950">
                      {Number(book.price).toFixed(3)} <span className="text-xs font-normal text-slate-600">د.ت</span>
                    </span>
                    {book.compareAtPrice && book.compareAtPrice > book.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {Number(book.compareAtPrice).toFixed(3)} د.ت
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mb-3 text-xs">
                    <span className="text-slate-600 font-bold truncate max-w-[140px]">{book.brand || 'بن عمار'}</span>
                    <div className="flex gap-0.5 items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          className={i < (book.rating || 5) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-stone-200"} 
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-[0.98]"
                  >
                    {addedId === book.id ? (
                      <>
                        <Check size={16} className="text-white" />
                        <span>تمت الإضافة!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={15} />
                        <span>أضف إلى السلة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
