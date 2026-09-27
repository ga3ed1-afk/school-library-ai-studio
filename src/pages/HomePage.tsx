import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Star, Heart, Plus, Minus, Search, ShoppingBag, Menu, X, Trash2, User, Phone, MapPin, Facebook, Instagram, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { brands, categories } from '../constants';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import CTABanner from '../components/CTABanner';
import FeaturedBooks from '../components/FeaturedBooks';
import SchoolPacks from '../components/SchoolPacks';
import { productService } from '../services/productService';
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
  const [activeCategory, setActiveCategory] = React.useState('الكل');
  const [products, setProducts] = React.useState<Product[]>(productService.getProducts());
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
    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (activeCategory === 'الكل') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);
  return (
    <>
      {/* Collection List */}
      <section className="py-8 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-8 bg-oxford-red rounded-sm" />
              <h2 className="text-2xl lg:text-3xl font-bold text-oxford-blue">
                اكتشف التصنيفات
              </h2>
            </div>

            <Link 
              to="/category/الكل" 
              className="text-oxford-red font-black hover:underline flex items-center gap-1.5 text-sm sm:text-base group px-3.5 py-2 bg-stone-50 hover:bg-stone-100 rounded-md border border-stone-200/60 transition-colors"
            >
              <span>عرض الكل</span>
              <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform rotate-180" />
            </Link>
          </div>

          {/* Categories Carousel with arrows on both ends of the banner */}
          <div className="relative group/categories">
            {/* Right Arrow (Previous in RTL) on right end of banner */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-oxford-blue hover:text-white text-oxford-blue shadow-lg border border-stone-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
              title="التصنيفات السابقة"
              aria-label="التصنيفات السابقة"
            >
              <ChevronRight size={22} />
            </button>

            {/* Left Arrow (Next in RTL) on left end of banner */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-oxford-blue hover:text-white text-oxford-blue shadow-lg border border-stone-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
              title="التصنيفات التالية"
              aria-label="التصنيفات التالية"
            >
              <ChevronLeft size={22} />
            </button>

            <div 
              ref={categoriesScrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-3 px-1 no-scrollbar snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="group flex flex-col text-center overflow-hidden rounded-md bg-white hover:shadow-xl hover:shadow-oxford-blue/10 transition-all duration-300 border border-stone-100 hover:-translate-y-1 w-[165px] sm:w-[195px] lg:w-[225px] shrink-0 snap-start"
                >
                  <div className="aspect-square overflow-hidden relative bg-stone-100">
                    <img 
                      src={cat.bannerImage || cat.icon} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center items-center">
                    <h3 className="font-black text-oxford-blue text-sm sm:text-base mb-1.5 group-hover:text-oxford-red transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <div className="bg-stone-50 px-3 py-0.5 rounded-sm border border-stone-100">
                      <p className="text-stone-600 text-xs font-bold">{cat.itemCount || 120} منتج</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 bg-stone-50">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <span className="text-oxford-red font-bold tracking-widest uppercase text-xs mb-2 block">منتجاتنا المختارة</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-oxford-blue leading-tight">
                الأكثر مبيعاً <span className="text-oxford-red">هذا الأسبوع</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart}
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </section>

      {/* School Supplies Packs Section */}
      <SchoolPacks addToCart={addToCart} />

      {/* Featured Books Section */}
      <FeaturedBooks addToCart={addToCart} />

      {/* CTA Banner Section */}
      <CTABanner />

      {/* Brands Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-oxford-blue mb-4">شركاؤنا في <span className="text-oxford-red">النجاح</span></h2>
            <p className="text-stone-700 font-medium text-sm">نوفر لكم أفضل الماركات العالمية والمحلية لضمان جودة تعليمية متميزة.</p>
          </div>
        </div>
        <div className="relative flex items-center">
          <div className="flex gap-12 animate-marquee whitespace-nowrap py-10">
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer grayscale hover:grayscale-0 transition-all duration-500">
                <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[3rem] bg-stone-50 flex items-center justify-center p-10 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-oxford-blue/10 transition-all border border-stone-100">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="font-black text-stone-600 group-hover:text-oxford-blue transition-colors">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
