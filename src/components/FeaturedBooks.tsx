import React, { useRef, useState, useEffect } from 'react';
import { Star, Eye, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface FeaturedBooksProps {
  addToCart?: (product: Product) => void;
}

const featuredBooksData = [
  {
    id: 101,
    sku: "BK-101",
    title: "مصحف التجويد والترتيل برواية ورش",
    subtitle: "طبعة فاخرة ومذهبة 24/17",
    price: 32.000,
    oldPrice: 40.000,
    author: "دار المعرفة",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    badge: "الأكثر طلباً",
    discount: "-20%"
  },
  {
    id: 102,
    sku: "BK-102",
    title: "صحيح البخاري - الطبعة المحققة الكاملة",
    subtitle: "مجلد فاخر تجليد أصلي",
    price: 45.000,
    oldPrice: 55.000,
    author: "الإمام البخاري",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    badge: "مميز",
    discount: "-18%"
  },
  {
    id: 103,
    sku: "BK-103",
    title: "رياض الصالحين من كلام سيد المرسلين",
    subtitle: "شرح وضبط وتحقيق معاصر",
    price: 26.500,
    oldPrice: 32.000,
    author: "الإمام النووي",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    badge: "إصدار منقح"
  },
  {
    id: 104,
    sku: "BK-104",
    title: "الرحيق المختوم في سيرة النبي المأمون",
    subtitle: "طبعة منقحة ملونة بالخرائط",
    price: 22.000,
    oldPrice: 28.000,
    author: "صفي الرحمن المباركفوري",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    discount: "-21%"
  },
  {
    id: 105,
    sku: "BK-105",
    title: "قصص الأنبياء - الحافظ ابن كثير",
    subtitle: "طبعة محققة ومعتمدة",
    price: 24.000,
    oldPrice: 30.000,
    author: "ابن كثير الدمشقي",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    discount: "-20%"
  },
  {
    id: 106,
    sku: "BK-106",
    title: "جامع الدروس العربية - موسوعة القواعد",
    subtitle: "مرجع شامل للنحو والصرف",
    price: 35.000,
    oldPrice: 42.000,
    author: "الشيخ مصطفى الغلاييني",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
    rating: 4,
    badge: "مرجع علمي"
  },
  {
    id: 107,
    sku: "BK-107",
    title: "معجم الطلاب الجامع الحديث",
    subtitle: "عربي - عربي مع شرح وافٍ",
    price: 28.000,
    oldPrice: 34.000,
    author: "نخبة من اللغويين",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    rating: 4,
    discount: "-17%"
  },
  {
    id: 108,
    sku: "BK-108",
    title: "أطلس العالم الجغرافي المصور للناشئة",
    subtitle: "خرائط ملونة ومعلومات حديثة",
    price: 29.500,
    oldPrice: 36.000,
    author: "قسم المطبوعات التعليمية",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    badge: "تربوي"
  }
];

// Duplicate for infinite seamless auto-scrolling
const displayBooks = [...featuredBooksData, ...featuredBooksData];

export default function FeaturedBooks({ addToCart }: FeaturedBooksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Automatic smooth scrolling with seamless wrap
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.8;

    const step = () => {
      if (!isHovered && el) {
        // In RTL layout, scrollLeft moves negative or positive depending on browser implementation
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
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (book: typeof featuredBooksData[0]) => {
    if (addToCart) {
      const productObj: Product = {
        id: book.id,
        sku: book.sku,
        name: book.title,
        price: book.price,
        description: book.subtitle,
        image: book.image,
        category: "الكتب"
      };
      addToCart(productObj);
      setAddedId(book.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <section className="py-10 bg-white border-t border-b border-stone-100">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-8 bg-oxford-red rounded-sm" />
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-oxford-blue">الكتب المميزة</h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">مختارات من أمهات الكتب والمراجع الدينية والتربوية (تتحرك تلقائياً)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-md border border-stone-200/60">
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-sm bg-white hover:bg-oxford-blue hover:text-white text-oxford-blue shadow-xs flex items-center justify-center transition-all cursor-pointer"
                title="الكتب السابقة"
                aria-label="الكتب السابقة"
              >
                <ChevronRight size={20} />
              </button>
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-sm bg-white hover:bg-oxford-blue hover:text-white text-oxford-blue shadow-xs flex items-center justify-center transition-all cursor-pointer"
                title="الكتب التالية"
                aria-label="الكتب التالية"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <Link 
              to="/category/الكتب" 
              className="text-oxford-red font-black hover:underline flex items-center gap-1.5 text-sm sm:text-base group px-3.5 py-2 bg-stone-50 hover:bg-stone-100 rounded-md border border-stone-200/60 transition-colors"
            >
              <span>استكشف المزيد</span>
              <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
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
              className="group bg-white rounded-md border border-stone-200/80 overflow-hidden hover:shadow-xl hover:shadow-oxford-blue/10 transition-all duration-300 w-[240px] sm:w-[260px] lg:w-[280px] shrink-0 flex flex-col justify-between"
            >
              {/* Image Container - Aspect 3/4 with tight clean styling */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <Link to={`/product/${book.id}`} className="block w-full h-full">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </Link>
                
                {/* Badges */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                  {book.badge && (
                    <span className="bg-oxford-red text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                      {book.badge}
                    </span>
                  )}
                  {book.discount && (
                    <span className="bg-oxford-blue text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                      {book.discount}
                    </span>
                  )}
                </div>

                {/* Quick preview buttons */}
                <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to={`/product/${book.id}`}
                    className="w-8 h-8 bg-white/95 hover:bg-oxford-blue hover:text-white text-oxford-blue rounded-sm flex items-center justify-center transition-colors shadow-xs"
                    title="معاينة الكتاب"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
              </div>

              {/* Content: Title in black, prices in red, SKU displayed */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-sm">
                      رمز: {book.sku}
                    </span>
                    <span className="text-stone-400 text-[11px] font-bold truncate max-w-[120px]">{book.subtitle}</span>
                  </div>

                  <Link to={`/product/${book.id}`}>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-oxford-red transition-colors leading-snug min-h-[2.6rem]">
                      {book.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base sm:text-lg font-black text-oxford-red">{book.price.toFixed(3)} د.ت</span>
                    {book.oldPrice && (
                      <span className="text-stone-400 text-xs line-through font-bold">{book.oldPrice.toFixed(3)} د.ت</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mb-3 text-xs">
                    <span className="text-stone-600 font-bold truncate max-w-[140px]">{book.author}</span>
                    <div className="flex gap-0.5 items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          className={i < book.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"} 
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-oxford-blue hover:bg-oxford-red text-white py-2.5 rounded-md font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {addedId === book.id ? (
                      <>
                        <Check size={16} className="text-emerald-300" />
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
