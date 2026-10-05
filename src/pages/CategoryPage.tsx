import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Heart, Search, Plus, ShoppingBag, ChevronLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { categories } from '../constants';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategoryPageProps {
  addToCart: (product: Product) => void;
}

const normalizeArabic = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ');
};

export default function CategoryPage({ addToCart }: CategoryPageProps) {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategory = searchParams.get('sub');
  const [products, setProducts] = React.useState<Product[]>(productService.getProducts());
  const [maxPrice, setMaxPrice] = React.useState<number>(500);
  const [sortBy, setSortBy] = React.useState<string>('default');

  React.useEffect(() => {
    const handleUpdate = () => {
      setProducts(productService.getProducts());
    };
    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  const decodedCategoryName = useMemo(() => {
    try {
      return categoryName ? decodeURIComponent(categoryName) : '';
    } catch {
      return categoryName || '';
    }
  }, [categoryName]);

  const decodedSubCategory = useMemo(() => {
    if (!subCategory) return null;
    try {
      return decodeURIComponent(subCategory);
    } catch {
      return subCategory;
    }
  }, [subCategory]);

  const isAll = decodedCategoryName === 'الكل' || decodedCategoryName === 'all' || decodedCategoryName === '';

  const category = useMemo(() => {
    if (isAll) {
      return {
        name: 'جميع التصنيفات والمنتجات',
        description: 'تصفح كافة المنتجات والمعروضات المتوفرة في مكتبة الهدى بجودة عالية وأسعار ممتازة.',
        bannerImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1600',
        icon: 'https://oxfordcity.tn/cdn/shop/files/school-bag_17738834_x26.png?v=1748442626',
        subcategories: categories.map(c => c.name)
      };
    }

    // 1. Exact match in registered categories
    const exact = categories.find(c => c.name === decodedCategoryName || c.name === categoryName);
    if (exact) return exact;

    // 2. Normalized match (handles hamza and alef differences like ادوات vs أدوات)
    const normTarget = normalizeArabic(decodedCategoryName);
    const normalized = categories.find(c => normalizeArabic(c.name) === normTarget);
    if (normalized) return normalized;

    // 3. Dynamic Category Fallback: If products exist with this category name
    const matchingProducts = products.filter(p => 
      p.category === decodedCategoryName || 
      normalizeArabic(p.category) === normTarget
    );

    if (matchingProducts.length > 0) {
      const distinctSubs = Array.from(
        new Set(matchingProducts.map(p => p.subcategory).filter(Boolean))
      ) as string[];

      return {
        name: decodedCategoryName,
        description: `تصفح المنتجات المتوفرة تحت تصنيف "${decodedCategoryName}".`,
        bannerImage: matchingProducts[0]?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1600',
        icon: 'https://oxfordcity.tn/cdn/shop/files/school-bag_17738834_x26.png?v=1748442626',
        subcategories: distinctSubs
      };
    }

    return undefined;
  }, [decodedCategoryName, categoryName, isAll, products]);

  const matchesSubCategory = (product: Product, targetSub: string): boolean => {
    if (!targetSub) return true;
    if (product.subcategory && (product.subcategory === targetSub || decodeURIComponent(product.subcategory) === targetSub)) {
      return true;
    }
    const cleanTarget = targetSub.replace(/^[\p{Extended_Pictographic}\s\-_•*]+/u, '').trim().toLowerCase();
    if (!cleanTarget) return true;

    if (product.subcategory && product.subcategory.toLowerCase().includes(cleanTarget)) return true;
    if (product.productType && product.productType.toLowerCase().includes(cleanTarget)) return true;
    if (product.tags && product.tags.some(t => t.toLowerCase().includes(cleanTarget) || cleanTarget.includes(t.toLowerCase()))) return true;
    if (product.name && product.name.toLowerCase().includes(cleanTarget)) return true;
    if (product.description && product.description.toLowerCase().includes(cleanTarget)) return true;

    const words = cleanTarget.split(/[\s,،/\\()]+/).filter(w => w.length > 2);
    if (words.length > 0) {
      return words.some(w => 
        product.name.toLowerCase().includes(w) ||
        (product.tags && product.tags.some(t => t.toLowerCase().includes(w))) ||
        (product.description && product.description.toLowerCase().includes(w))
      );
    }
    return false;
  };

  const filteredProducts = useMemo(() => {
    let result: Product[] = [];
    if (isAll) {
      if (subCategory) {
        const target = decodedSubCategory || subCategory;
        const isCat = categories.some(c => c.name === target);
        if (isCat) {
          result = products.filter(p => p.category === target);
        } else {
          result = products.filter(p => matchesSubCategory(p, target));
        }
      } else {
        result = [...products];
      }
    } else {
      const normTarget = normalizeArabic(decodedCategoryName);
      result = products.filter(product => {
        const matchesCategory = 
          product.category === decodedCategoryName || 
          product.category === categoryName ||
          (category && product.category === category.name) ||
          normalizeArabic(product.category) === normTarget;
        if (!matchesCategory) return false;
        if (subCategory) {
          return matchesSubCategory(product, decodedSubCategory || subCategory);
        }
        return true;
      });
    }

    // Apply Active Price Filter
    result = result.filter(product => (Number(product.price) || 0) <= maxPrice);

    // Apply Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return result;
  }, [decodedCategoryName, categoryName, subCategory, decodedSubCategory, products, isAll, category, maxPrice, sortBy]);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-black text-oxford-blue mb-4">التصنيف غير موجود</h1>
        <Link to="/" className="text-oxford-red font-bold hover:underline flex items-center gap-2">
          <ChevronLeft size={20} />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 text-stone-900">
      {/* Category Header - Vibrant #5794ff */}
      <div className="relative py-4 sm:py-6 overflow-hidden bg-gradient-to-r from-[#5794ff] via-[#4686f5] to-[#2563eb] text-white shadow-md border-b border-white/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <nav className="flex items-center gap-1.5 text-blue-100 text-xs font-medium mb-1">
              <Link to="/" className="hover:text-amber-200 transition-colors">الرئيسية</Link>
              <ChevronLeft size={12} className="text-amber-300" />
              <span className="text-white font-semibold">{category.name}</span>
              {subCategory && (
                <>
                  <ChevronLeft size={12} className="text-amber-300" />
                  <span className="text-amber-200 font-semibold">{subCategory}</span>
                </>
              )}
            </nav>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{category.name}</span>
            </h1>
          </div>
          <p className="text-xs text-white font-bold hidden sm:block bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
            {filteredProducts.length} منتجات متوفرة بأفضل الأسعار
          </p>
        </div>
        
        {category.bannerImage && typeof category.bannerImage === 'string' && category.bannerImage.trim() !== '' && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={category.bannerImage.trim()}
              alt={category.name}
              className="w-full h-full object-cover opacity-20 blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#5794ff]/90 via-[#4686f5]/85 to-[#2563eb]/90" />
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-md p-5 shadow-xs border border-slate-200/90 sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-extrabold flex items-center gap-2 text-stone-900">
                  <Filter size={17} className="text-[#5794ff]" />
                  الفلاتر
                </h2>
                <SlidersHorizontal size={16} className="text-[#5794ff]" />
              </div>

              <div className="space-y-6">
                {/* Subcategories */}
                <div>
                  <h3 className="font-bold text-stone-900 mb-3 pb-2 border-b border-slate-100 text-xs uppercase tracking-wider text-[#5794ff]">الأقسام الفرعية</h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSearchParams({})}
                      className={cn(
                        "w-full text-right px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-between",
                        !subCategory 
                          ? "bg-[#5794ff] text-white border border-[#5794ff] shadow-sm font-extrabold" 
                          : "text-stone-600 hover:bg-slate-50 hover:text-[#5794ff]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base shrink-0 leading-none">
                          🏷️
                        </span>
                        <span>عرض الكل</span>
                      </div>
                    </button>
                    {category.subcategories.map((sub) => {
                      const match = sub.match(/^(\p{Extended_Pictographic}+|\S+)\s+(.+)$/u);
                      const icon = match ? match[1] : '▪️';
                      const label = match ? match[2] : sub;
                      const isActive = subCategory === sub || decodedSubCategory === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => {
                            if (isActive) {
                              setSearchParams({});
                            } else {
                              setSearchParams({ sub });
                            }
                          }}
                          className={cn(
                            "w-full text-right px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-between group",
                            isActive 
                              ? "bg-[#5794ff] text-white border border-[#5794ff] shadow-sm font-extrabold" 
                              : "text-stone-700 hover:bg-slate-50 hover:text-[#5794ff] border border-transparent hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg shrink-0 leading-none group-hover:scale-110 transition-transform">
                              {icon}
                            </span>
                            <span className="truncate">{label}</span>
                          </div>
                          {isActive && (
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-sm">✕</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range (Activated) */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-[#5794ff]">السعر</h3>
                    <span className="text-xs font-black text-[#5794ff] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                      حتى {maxPrice} د.ت
                    </span>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="range" 
                      min="0"
                      max="500"
                      step="1"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#5794ff] cursor-pointer" 
                    />
                    <div className="flex justify-between text-xs font-bold text-stone-500">
                      <span>0 د.ت</span>
                      <span>500 د.ت</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-md p-4 sm:p-5 mb-6 shadow-xs border border-slate-200/90 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-stone-600 text-xs sm:text-sm font-bold">عرض <span className="text-[#5794ff] font-black">{filteredProducts.length}</span> منتج</p>
              <div className="flex items-center gap-3">
                <span className="text-stone-400 text-xs font-bold">ترتيب حسب:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-300 focus:border-[#5794ff] cursor-pointer"
                >
                  <option value="default">الأحدث</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="popular">الأكثر تقييماً وشعبية</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    addToCart={addToCart}
                    priority={index < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-md p-16 text-center border border-slate-200/90 shadow-xs">
                <div className="w-24 h-24 bg-blue-50 rounded-md flex items-center justify-center mx-auto mb-6 text-[#5794ff]">
                  <Search size={48} />
                </div>
                <h3 className="text-xl font-black text-stone-900 mb-2">
                  {subCategory ? 'لا توجد منتجات مطابقة لهذا القسم الفرعي حالياً' : 'لا توجد منتجات حالياً'}
                </h3>
                <p className="text-stone-500 text-sm font-medium mb-8">
                  {subCategory 
                    ? `يمكنك عرض كافة المنتجات المتوفرة في قسم "${category.name}" أو اختيار قسم فرعي آخر.`
                    : 'نحن نعمل على إضافة المزيد من المنتجات الرائعة لهذا القسم قريباً.'}
                </p>
                {subCategory ? (
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="inline-flex items-center gap-2 bg-[#5794ff] hover:bg-[#437de6] text-white px-8 py-3 rounded-md font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    عرض جميع منتجات {category.name}
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#5794ff] hover:bg-[#437de6] text-white px-8 py-3 rounded-md font-bold shadow-md shadow-blue-500/20 transition-all"
                  >
                    تصفح باقي الأقسام
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
