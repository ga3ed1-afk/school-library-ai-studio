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

export default function CategoryPage({ addToCart }: CategoryPageProps) {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategory = searchParams.get('sub');
  const [products, setProducts] = React.useState<Product[]>(productService.getProducts());

  React.useEffect(() => {
    const handleUpdate = () => {
      setProducts(productService.getProducts());
    };
    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : '';
  const isAll = decodedCategoryName === 'الكل' || decodedCategoryName === 'all' || decodedCategoryName === '';

  const category = useMemo(() => {
    if (isAll) {
      return {
        name: 'جميع التصنيفات والمنتجات',
        description: 'تصفح كافة المنتجات والمعروضات المتوفرة في مكتبة أكسفورد سيتي بجودة عالية وأسعار ممتازة.',
        bannerImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1600',
        icon: 'https://oxfordcity.tn/cdn/shop/files/school-bag_17738834_x26.png?v=1748442626',
        subcategories: categories.map(c => c.name)
      };
    }
    return categories.find(c => c.name === decodedCategoryName);
  }, [decodedCategoryName, isAll]);

  const filteredProducts = useMemo(() => {
    if (isAll) {
      if (subCategory) {
        return products.filter(product => product.category === subCategory);
      }
      return products;
    }
    return products.filter(product => {
      const matchesCategory = product.category === decodedCategoryName;
      return matchesCategory;
    });
  }, [decodedCategoryName, subCategory, products, isAll]);

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
    <div className="bg-stone-50 min-h-screen pb-24">
      {/* Category Header - Minimized as much as possible */}
      <div className="relative py-3 sm:py-4 overflow-hidden bg-oxford-blue text-white shadow-xs">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <nav className="flex items-center gap-1.5 text-stone-300 text-[11px] font-light mb-0.5">
              <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronLeft size={12} />
              <span className="text-white font-normal">{category.name}</span>
              {subCategory && (
                <>
                  <ChevronLeft size={12} />
                  <span className="text-red-300">{subCategory}</span>
                </>
              )}
            </nav>
            <h1 className="text-lg sm:text-xl font-normal tracking-tight text-white">
              {category.name}
            </h1>
          </div>
          <p className="text-[11px] text-stone-300 font-light hidden sm:block">
            {filteredProducts.length} منتجات متوفرة بأفضل الأسعار
          </p>
        </div>
        
        {category.bannerImage && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={category.bannerImage}
              alt={category.name}
              className="w-full h-full object-cover opacity-20 blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-oxford-blue via-oxford-blue/80 to-oxford-blue/90" />
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 mt-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-md p-6 shadow-md border border-stone-200/80 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Filter size={18} className="text-oxford-red" />
                  الفلاتر
                </h2>
                <SlidersHorizontal size={18} className="text-stone-300" />
              </div>

              <div className="space-y-8">
                {/* Subcategories */}
                <div>
                  <h3 className="font-black text-oxford-blue mb-4 pb-2 border-b border-stone-100 text-sm">الأقسام الفرعية</h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSearchParams({})}
                      className={cn(
                        "w-full text-right px-3.5 py-2.5 rounded-md text-sm font-bold transition-all",
                        !subCategory ? "bg-oxford-blue text-white shadow-xs" : "text-stone-600 hover:bg-stone-50"
                      )}
                    >
                      الكل
                    </button>
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSearchParams({ sub })}
                        className={cn(
                          "w-full text-right px-3.5 py-2.5 rounded-md text-sm font-bold transition-all",
                          subCategory === sub ? "bg-oxford-blue text-white shadow-xs" : "text-stone-600 hover:bg-stone-50"
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range (Mock) */}
                <div>
                  <h3 className="font-black text-oxford-blue mb-6 pb-2 border-b border-stone-100">السعر</h3>
                  <div className="space-y-4">
                    <input type="range" className="w-full accent-oxford-red" />
                    <div className="flex justify-between text-sm font-bold text-stone-500">
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
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-stone-500 font-bold">عرض <span className="text-oxford-blue">{filteredProducts.length}</span> منتج</p>
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-sm font-bold">ترتيب حسب:</span>
                <select className="bg-stone-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-oxford-blue outline-none focus:ring-2 focus:ring-oxford-blue/20">
                  <option>الأحدث</option>
                  <option>السعر: من الأقل للأعلى</option>
                  <option>السعر: من الأعلى للأقل</option>
                  <option>الأكثر مبيعاً</option>
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
              <div className="bg-white rounded-xl p-20 text-center border border-stone-100">
                <div className="w-32 h-32 bg-stone-50 rounded-xl flex items-center justify-center mx-auto mb-8 text-stone-200">
                  <Search size={64} />
                </div>
                <h3 className="text-2xl font-black text-oxford-blue mb-4">لا توجد منتجات حالياً</h3>
                <p className="text-stone-400 font-medium mb-10">نحن نعمل على إضافة المزيد من المنتجات الرائعة لهذا القسم قريباً.</p>
                <Link
                  to="/"
                  className="inline-block bg-oxford-blue text-white px-12 py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all"
                >
                  تصفح باقي الأقسام
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
