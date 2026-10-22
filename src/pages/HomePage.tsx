import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { brands, categories } from '../constants';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import CTABanner from '../components/CTABanner';
import FeaturedBooks from '../components/FeaturedBooks';
import SchoolPacks from '../components/SchoolPacks';
import { productService } from '../services/productService';
import { partnerService, Partner } from '../services/partnerService';
import { useStoreTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HomePageProps {
  addToCart: (product: Product) => void;
  setSelectedCategory: (category: string) => void;
}

export default function HomePage({ addToCart, setSelectedCategory }: HomePageProps) {
  const { config } = useStoreTheme();
  const [activeCategory, setActiveCategory] = React.useState('الكل');
  const [products, setProducts] = React.useState<Product[]>(productService.getProducts());
  const [partners, setPartners] = React.useState<Partner[]>(() => partnerService.getPartners(true));
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      // In RTL Arabic layout, positive scroll moves right/back, negative moves left/forward
      const scrollAmount = direction === 'left' ? -340 : 340;
      categoriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const handleUpdate = () => {
      setProducts(productService.getProducts());
    };
    const handlePartnersUpdate = () => {
      setPartners(partnerService.getPartners(true));
    };
    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('partners_updated', handlePartnersUpdate);
    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('partners_updated', handlePartnersUpdate);
    };
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (activeCategory === 'الكل') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="bg-stone-50 text-stone-900">
      {/* Collection List */}
      <section className="py-8 bg-transparent overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span 
                className="w-2.5 h-8 rounded-full" 
                style={{ backgroundColor: config.accentColor || 'oklch(54.1% 0.281 293.009)' }}
              />
              <h2 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
                اكتشف التصنيفات
              </h2>
            </div>

            <Link 
              to="/category/الكل" 
              className="text-stone-800 hover:text-[oklch(54.1%_0.281_293.009)] font-bold hover:underline flex items-center gap-1.5 text-xs sm:text-sm group px-3.5 py-2 bg-stone-100 hover:bg-purple-50 rounded-md border border-stone-200 transition-colors"
            >
              <span>عرض الكل</span>
              <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
            </Link>
          </div>

          {/* Categories Carousel with arrows on both ends of the banner */}
          <div className="relative group/categories">
            {/* Right Arrow (Previous in RTL) on right end of banner */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-md bg-white hover:bg-[oklch(54.1%_0.281_293.009)] hover:text-white text-stone-700 shadow-md border border-stone-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="التصنيفات السابقة"
              aria-label="التصنيفات السابقة"
            >
              <ChevronRight size={18} />
            </button>

            {/* Left Arrow (Next in RTL) on left end of banner */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-md bg-white hover:bg-[oklch(54.1%_0.281_293.009)] hover:text-white text-stone-700 shadow-md border border-stone-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="التصنيفات التالية"
              aria-label="التصنيفات التالية"
            >
              <ChevronLeft size={18} />
            </button>

            <div 
              ref={categoriesScrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-3 px-1 no-scrollbar snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => {
                const normCat = (cat.name || '').toLowerCase().trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
                const matchingCount = products.filter(p => {
                  if (!p.category) return false;
                  const pNorm = (p.category || '').toLowerCase().trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
                  return p.category === cat.name || pNorm === normCat;
                }).length;
                const displayCount = matchingCount > 0 ? matchingCount : (cat.itemCount || 0);

                return (
                  <Link
                    key={cat.name}
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "group relative flex flex-col text-center overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border border-stone-200 hover:-translate-y-1 w-[165px] sm:w-[195px] lg:w-[225px] shrink-0 snap-start",
                      config.cardRadius || "rounded-xs",
                      config.cardHoverBorder || "hover:border-[oklch(54.1%_0.281_293.009)]"
                    )}
                  >
                    <div className={cn("aspect-square overflow-hidden relative bg-stone-100", config.imageRadius || "rounded-t-xs")}>
                      {(() => {
                        const imageSrc = (cat.bannerImage && cat.bannerImage.startsWith('http'))
                          ? cat.bannerImage
                          : (cat.icon && cat.icon.startsWith('http'))
                            ? cat.icon
                            : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';
                        return (
                          <img 
                            src={imageSrc} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })()}
                      <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-300" />

                      {/* Hover Subcategories Overlay - displays subcategories upon mouse hover */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-center z-20 pointer-events-none group-hover:pointer-events-auto">
                          <span className="text-[11px] font-black uppercase text-amber-300 mb-2 border-b border-amber-300/30 pb-0.5">
                            الأقسام الفرعية:
                          </span>
                          <div className="flex flex-col gap-1 items-center max-h-[80%] overflow-y-auto no-scrollbar">
                            {cat.subcategories.map((sub) => (
                              <span 
                                key={sub}
                                className="text-[11px] font-bold text-white hover:text-amber-300 transition-colors"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-center items-center bg-white">
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base mb-1 group-hover:text-[oklch(54.1%_0.281_293.009)] transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-stone-500 text-xs font-bold">
                        {displayCount} {displayCount === 1 ? 'منتج' : displayCount === 2 ? 'منتجان' : displayCount > 2 && displayCount <= 10 ? 'منتجات' : 'منتج'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid - Best Sellers */}
      <section className="py-8 bg-transparent">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <span 
                className="font-bold tracking-wider uppercase text-xs mb-1 block"
                style={{ color: config.accentColor || 'oklch(54.1% 0.281 293.009)' }}
              >
                منتجاتنا المختارة
              </span>
              <h2 className="text-2xl lg:text-3xl font-black text-stone-900 leading-tight tracking-tight">
                الأكثر مبيعاً <span style={{ color: config.accentColor || 'oklch(54.1% 0.281 293.009)' }}>هذا الأسبوع</span>
              </h2>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  addToCart={addToCart}
                  priority={index < 4}
                  hidePrice={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center max-w-lg mx-auto shadow-2xs space-y-4">
              <div className="w-14 h-14 bg-purple-50 text-[oklch(54.1%_0.281_293.009)] rounded-full flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">المتجر جاهز لإضافة السلع</h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  تم إفراغ السلع الافتراضية بنجاح. يمكنك استيراد سلعك الحقيقية من فيسبوك الآن.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white px-5 py-2.5 rounded-lg text-xs font-black shadow-md transition-all"
              >
                <span>استيراد سلع من فيسبوك ⚡</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* School Supplies Packs Section */}
      <SchoolPacks addToCart={addToCart} />

      {/* Featured Books Section */}
      <FeaturedBooks addToCart={addToCart} />

      {/* CTA Banner Section */}
      <CTABanner />

      {/* Brands & Partners Section */}
      <section className="py-16 bg-transparent overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 mb-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-black text-stone-900 mb-3">
              شركاؤنا في <span style={{ color: 'oklch(54.1% 0.281 293.009)' }}>النجاح</span>
            </h2>
            <p className="text-stone-600 font-medium text-xs sm:text-sm">نوفر لكم أفضل الماركات العالمية والمحلية في الأدوات المكتبية والإعلامية والمدرسية لضمان جودة استثنائية.</p>
          </div>
        </div>
        <div className="relative flex items-center">
          <div className="flex gap-10 animate-marquee whitespace-nowrap py-6">
            {(partners.length > 0 ? [...partners, ...partners] : [...brands, ...brands]).map((partner: any, i) => (
              <a 
                key={`${partner.id || i}-${i}`} 
                href={partner.website || '#'}
                target={partner.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group cursor-pointer grayscale hover:grayscale-0 transition-all duration-500 shrink-0"
              >
                <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-sm bg-white shadow-2xs flex items-center justify-center p-6 group-hover:shadow-lg transition-all border border-stone-200 group-hover:border-[oklch(54.1%_0.281_293.009)]">
                  <img 
                    src={(partner.logo && partner.logo.trim() !== '') ? partner.logo.trim() : '/logo.svg'} 
                    alt={partner.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <span className="font-bold text-xs text-stone-700 group-hover:text-[oklch(54.1%_0.281_293.009)] transition-colors">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
