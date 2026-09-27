import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Heart, Scale, Share2, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingCart, ChevronLeft, ArrowRight, CreditCard, CheckCircle, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { categories, brands, COLOR_HEX_MAP } from '../constants';
import { Product } from '../types';
import { productService } from '../services/productService';
import QuickOrderModal from '../components/QuickOrderModal';
import ProductReviews from '../components/ProductReviews';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductPageProps {
  addToCart: (product: Product, quantity: number) => void;
}

export default function ProductPage({ addToCart }: ProductPageProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>(productService.getProducts());
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('Noir');
  const [selectedStyle, setSelectedStyle] = useState<string>('طقم إضافي');
  const [selectedSize, setSelectedSize] = useState<string>('حجم مدمج');
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'reviews'>('specs');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lensPos, setLensPos] = useState({ top: 0, left: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });

    const lensWidth = 110;
    const lensHeight = 110;
    let lensX = e.clientX - rect.left - lensWidth / 2;
    let lensY = e.clientY - rect.top - lensHeight / 2;
    lensX = Math.max(0, Math.min(rect.width - lensWidth, lensX));
    lensY = Math.max(0, Math.min(rect.height - lensHeight, lensY));
    setLensPos({ top: lensY, left: lensX });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('تم نسخ الرابط!');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleAddToCart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!product) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setToastMessage('تمت إضافة المنتج إلى السلة بنجاح! 🛒');
    window.dispatchEvent(new CustomEvent('open_cart'));
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setToastMessage(null), 2500);
    }, 800);
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!product) return;
    setIsQuickOrderOpen(true);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  React.useEffect(() => {
    const handleUpdate = () => {
      setProducts(productService.getProducts());
    };
    window.addEventListener('products_updated', handleUpdate);
    return () => window.removeEventListener('products_updated', handleUpdate);
  }, []);

  const product = useMemo(() => {
    const p = products.find(p => p.id === Number(productId));
    return p;
  }, [productId, products]);

  // Wishlist persistence
  React.useEffect(() => {
    if (product) {
      try {
        const saved = JSON.parse(localStorage.getItem('oxford_wishlist') || '[]');
        setIsWishlisted(saved.includes(product.id));
      } catch (e) {
        setIsWishlisted(false);
      }
    }
  }, [product]);

  const toggleWishlist = () => {
    if (!product) return;
    try {
      const saved = JSON.parse(localStorage.getItem('oxford_wishlist') || '[]');
      let updated: number[];
      if (saved.includes(product.id)) {
        updated = saved.filter((id: number) => id !== product.id);
        setIsWishlisted(false);
        setToastMessage('تمت إزالة المنتج من المفضلة');
      } else {
        updated = [...saved, product.id];
        setIsWishlisted(true);
        setToastMessage('تمت إضافة المنتج إلى المفضلة ❤️');
      }
      localStorage.setItem('oxford_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist_updated'));
      setTimeout(() => setToastMessage(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('Noir');
      }

      if (product.styles && product.styles.length > 0) {
        setSelectedStyle(product.styles[0]);
      } else if (product.productType) {
        setSelectedStyle(product.productType);
      } else {
        setSelectedStyle('طقم إضافي');
      }

      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else if (product.size) {
        setSelectedSize(product.size);
      } else {
        setSelectedSize('حجم مدمج');
      }
    }
  }, [product]);

  const bulletPoints = useMemo(() => {
    if (product?.bulletPoints && product.bulletPoints.length > 0) {
      return product.bulletPoints;
    }
    if (product?.features) {
      const parts = product.features.split(/[\n;]/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
      if (parts.length > 0) return parts;
    }
    return [
      'جودة كتابة ورسم فائقة السلاسة',
      'ألوان زاهية ومقاومة للبهتان',
      'خامات آمنة وغير سامة مطابقة للمواصفات',
      'أدوات متينة ومقاومة للكسر العرضي',
      'تصميم مريح للأيدي والأصابع',
      'مثالي للطلبة في مختلف المراحل الدراسية'
    ];
  }, [product]);

  const bulletCol1 = useMemo(() => bulletPoints.slice(0, Math.ceil(bulletPoints.length / 2)), [bulletPoints]);
  const bulletCol2 = useMemo(() => bulletPoints.slice(Math.ceil(bulletPoints.length / 2)), [bulletPoints]);

  const colorsList = useMemo(() => {
    if (product?.colors && product.colors.length > 0) {
      return product.colors;
    }
    return ['Noir', 'Rouge', 'Vert', 'Bleu'];
  }, [product]);

  const stylesList = useMemo(() => {
    if (product?.styles && product.styles.length > 0) {
      return product.styles;
    }
    return ['طراز قياسي', 'طراز بريميوم', 'طقم إضافي'];
  }, [product]);

  const sizesList = useMemo(() => {
    if (product?.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    if (product?.size) {
      return [product.size, 'حجم كبير (XL)', 'حجم مدمج'].filter((v, i, a) => a.indexOf(v) === i);
    }
    return ['حجم قياسي', 'حجم كبير (XL)', 'حجم مدمج'];
  }, [product]);

  const getColorHex = (colorName: string): string => {
    const trimmed = colorName.trim();
    if (trimmed.startsWith('#')) return trimmed;
    const lower = trimmed.toLowerCase();
    return COLOR_HEX_MAP[lower] || '#1f2937';
  };

  const oldPrice = useMemo(() => {
    if (!product) return 0;
    const currentPrice = Number(product.price) || 0;
    const compareAt = Number(product.compareAtPrice);
    if (!isNaN(compareAt) && compareAt > currentPrice) {
      return compareAt;
    }
    const discountVal = Number(product.discount);
    if (!isNaN(discountVal) && discountVal > 0 && discountVal < 100) {
      return currentPrice / (1 - discountVal / 100);
    }
    return currentPrice * 1.2;
  }, [product]);

  const handleCompare = () => {
    setIsCompared(prev => !prev);
    setToastMessage(!isCompared ? 'تمت إضافة المنتج إلى المقارنة ⚖️' : 'تمت إزالة المنتج من المقارنة');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(product?.name || '');
  const shareUrl = encodeURIComponent(currentUrl);
  const shareImage = encodeURIComponent(product?.image || '');

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setToastMessage('تم نسخ الرابط بنجاح! 📋');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const productBrand = useMemo(() => {
    return brands.find(b => b.name === product?.brand);
  }, [product?.brand]);

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const images = useMemo(() => {
    if (!product) return [];
    return product.images && product.images.length > 0 ? product.images : [product.image];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-black text-oxford-blue mb-4">المنتج غير موجود</h1>
        <Link to="/" className="text-oxford-red font-bold hover:underline flex items-center gap-2">
          <ChevronLeft size={20} />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-stone-50 border-b border-stone-100 py-2">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-stone-500 text-sm font-bold">
            <Link to="/" className="hover:text-oxford-blue transition-colors">الرئيسية</Link>
            <ChevronLeft size={16} />
            <Link to={`/category/${product.category}`} className="hover:text-oxford-blue transition-colors">{product.category}</Link>
            <ChevronLeft size={16} />
            <span className="text-oxford-blue truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 items-start">
          {/* Product Image Section */}
          <div className="flex gap-3 max-w-[400px] mx-auto md:mx-0 w-full relative">
            {/* Thumbnail Gallery (Vertical on the right) */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-14 sm:w-16 flex-shrink-0">
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-stone-50",
                      (activeImage === img || (!activeImage && i === 0)) ? "border-oxford-red shadow-xs" : "border-transparent hover:border-stone-200"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 min-w-0 relative">
              <motion.div 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-square max-h-[380px] rounded-2xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-xs relative group cursor-crosshair select-none"
              >
                <img 
                  src={activeImage || product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Interactive Zoom Lens */}
                {isZooming && (
                  <div 
                    className="zoomLens absolute pointer-events-none border-2 border-oxford-blue/50 bg-oxford-blue/15 backdrop-blur-[0.5px] rounded-lg shadow-md z-20 transition-opacity duration-150"
                    style={{
                      width: 110,
                      height: 110,
                      top: `${lensPos.top}px`,
                      left: `${lensPos.left}px`,
                    }}
                  />
                )}

                {/* Click to expand button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-2.5 start-2.5 z-20 h-7 px-2 rounded-md bg-white/95 backdrop-blur-md border border-stone-200/80 text-stone-700 hover:text-oxford-red hover:bg-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title="تكبير الصورة كاملة"
                >
                  <Maximize2 size={13} />
                  <span>تكبير</span>
                </button>

                {/* Hover zoom hint */}
                <div className="absolute top-2.5 end-2.5 z-20 px-2 py-0.5 rounded-md bg-stone-900/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn size={11} className="text-amber-400" />
                  <span>حرّك الماوس للتكبير</span>
                </div>
              </motion.div>

              {/* zoomWindowContainer: Magnified view container placed beside image */}
              {isZooming && (
                <div 
                  className="zoomWindowContainer hidden md:block absolute top-0 start-full ms-6 z-50 rounded-2xl overflow-hidden border-2 border-stone-200/90 bg-white shadow-2xl pointer-events-none"
                  style={{
                    width: '420px',
                    height: '380px',
                  }}
                >
                  <div 
                    className="zoomWindow w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${activeImage || product.image})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '270%',
                    }}
                  />
                  <div className="absolute bottom-2.5 start-2.5 px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5">
                    <ZoomIn size={12} className="text-oxford-red" />
                    <span>تكبير فائق 2.7x</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col h-full col-lg-7">
            <h1 className="text-2xl lg:text-3xl font-black text-black mb-3 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                  <span>من</span>
                  <Link className="text-black font-extrabold hover:text-oxford-blue transition-colors" to="/">
                    {product.brand || 'أكسفورد سيتي'}
                  </Link>
                </div>
                <div className="h-3 w-px bg-stone-300"></div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-500">({product.reviewsCount || 65} تقييمًا)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={toggleWishlist}
                  className="flex items-center gap-1.5 transition-colors cursor-pointer text-stone-700 hover:text-oxford-red"
                >
                  <Heart size={15} className={isWishlisted ? "fill-current text-oxford-red" : "text-stone-500"} />
                  <span>{isWishlisted ? 'في قائمة الأمنيات' : 'أضف إلى قائمة الأمنيات'}</span>
                </button>
                <div className="h-3 w-px bg-stone-300"></div>
                <button 
                  type="button" 
                  onClick={handleCompare}
                  className="flex items-center gap-1.5 transition-colors cursor-pointer text-stone-700 hover:text-oxford-blue"
                >
                  <Scale size={15} className={isCompared ? "text-oxford-blue" : "text-stone-500"} />
                  <span>{isCompared ? 'تمت إضافة المقارنة' : 'أضف إلى المقارنة'}</span>
                </button>
              </div>
            </div>

            <div className="border-b border-stone-200 mb-4"></div>

            {/* Price Box */}
            <div className="box-product-price flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-oxford-red price-main">
                {(Number(product.price) || 0).toFixed(3)} <span className="text-base font-bold">د.ت</span>
              </span>
              {Number(oldPrice) > (Number(product.price) || 0) && (
                <span className="text-lg text-stone-400 line-through font-bold price-line">
                  {Number(oldPrice).toFixed(3)} د.ت
                </span>
              )}
              {product.minPrice !== undefined && product.maxPrice !== undefined && (
                <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 ms-auto">
                  النطاق: {(Number(product.minPrice) || 0).toFixed(3)} د.ت إلى {(Number(product.maxPrice) || 0).toFixed(3)} د.ت
                </span>
              )}
            </div>

            {/* Description & Bullet points */}
            <div className="product-description mb-5 text-black">
              {product.description && (
                <p className="text-sm sm:text-base font-medium leading-relaxed mb-4 text-black">
                  {product.description}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <ul className="list-dot">
                  {bulletCol1.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <ul className="list-dot">
                  {bulletCol2.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Colors */}
            <div className="box-product-color mb-5">
              <p className="text-sm font-bold text-black mb-2">
                اللون: <span className="text-oxford-blue font-extrabold nameColor">{selectedColor}</span>
              </p>
              <ul className="list-colors">
                {colorsList.map((colorName, idx) => {
                  const isActive = selectedColor === colorName;
                  const hex = getColorHex(colorName);
                  return (
                    <li 
                      key={idx} 
                      className={isActive ? "active" : ""} 
                      title={colorName}
                      onClick={() => setSelectedColor(colorName)}
                    >
                      <span 
                        className="w-7 h-7 rounded-full block border-2 border-white shadow-xs ring-1 ring-stone-300 transition-transform" 
                        style={{ backgroundColor: hex }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Style and Size */}
            <div className="box-product-style-size mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-black mb-2">
                    النمط: <span className="text-oxford-blue font-extrabold nameStyle">{selectedStyle}</span>
                  </p>
                  <ul className="list-styles">
                    {stylesList.map((st, idx) => (
                      <li 
                        key={idx} 
                        className={selectedStyle === st ? "active" : ""} 
                        title={st}
                        onClick={() => setSelectedStyle(st)}
                      >
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-bold text-black mb-2">
                    الحجم: <span className="text-oxford-blue font-extrabold nameSize">{selectedSize}</span>
                  </p>
                  <ul className="list-sizes">
                    {sizesList.map((sz, idx) => (
                      <li 
                        key={idx} 
                        className={selectedSize === sz ? "active" : ""} 
                        title={sz}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Buy and Quantity section */}
            <div className="buy-product mt-3 pt-4 border-t border-stone-200">
              <p className="text-xs font-bold text-stone-600 mb-2">كمية</p>
              <div className="box-quantity flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <div className="input-quantity flex items-center h-11 border border-stone-300 rounded-lg bg-white overflow-hidden w-32 flex-shrink-0 shadow-2xs">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="minus-cart w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    min="1" 
                    className="w-full h-full text-center font-black text-black border-none focus:outline-none text-base" 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => q + 1)}
                    className="plus-cart w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="button-buy flex-1 grid grid-cols-2 gap-2.5">
                  <button 
                    type="button" 
                    onClick={handleAddToCart}
                    className="btn btn-cart w-full"
                  >
                    <ShoppingCart size={17} />
                    <span>{isAdding ? 'جارٍ الإضافة...' : 'أضف إلى السلة'}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleBuyNow}
                    className="btn btn-buy w-full"
                  >
                    <CreditCard size={17} />
                    <span>اشتري الآن</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback toast */}
            {toastMessage && (
              <div className="mt-4 bg-oxford-blue text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-between shadow-xs">
                <span>{toastMessage}</span>
                <CheckCircle size={15} className="text-emerald-400" />
              </div>
            )}

            {/* Info product meta */}
            <div className="info-product mt-7 pt-5 border-t border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
                <div className="space-y-1.5 font-medium">
                  <div>
                    <span className="font-bold text-black">رمز المنتج: </span>
                    <span className="text-stone-500 font-mono">{product.sku || `OX-${product.id}`}</span>
                  </div>
                  <div>
                    <span className="font-bold text-black">التصنيف: </span>
                    <Link className="text-stone-500 hover:text-oxford-blue transition-colors" to={`/category/${product.category}`}>
                      {product.category}
                    </Link>
                  </div>
                  <div>
                    <span className="font-bold text-black">الكلمات المفتاحية: </span>
                    <span className="text-stone-500">
                      {(product.tags && product.tags.length > 0) ? product.tags.join('، ') : 'أدوات مكتبية، لوازم مدرسية'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 font-medium border-t md:border-t-0 md:border-r md:border-stone-200 md:pr-6 pt-4 md:pt-0">
                  <div className="font-bold text-black flex items-center gap-1.5">
                    <Truck size={15} className="text-emerald-600" />
                    <span>خدمة التوصيل مجانية</span>
                  </div>
                  <div className="text-stone-500">لجميع المناطق والولايات عند الطلب بأكثر من 100 د.ت.</div>
                  <div 
                    onClick={() => setToastMessage('توصيل سريع خلال 24-48 ساعة لكافة مناطق الجمهورية التونسية 🚚')}
                    className="text-oxford-blue hover:underline cursor-pointer font-bold"
                  >
                    خيارات ومعلومات التوصيل.
                  </div>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-r md:border-stone-200 md:pr-6 pt-4 md:pt-0">
                  <div className="share-link flex flex-col gap-2">
                    <span className="font-bold text-black block">يشارك:</span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#1877F2] text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5" 
                        title="فيسبوك"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                      </a>
                      <a 
                        href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareImage}&description=${shareText}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#E60023] text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5" 
                        title="بينتيريست"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.499-.696-2.435-2.885-2.435-4.646 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"></path></svg>
                      </a>
                      <a 
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-black text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5" 
                        title="تويتر"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      </a>
                      <a 
                        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#25D366] text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5" 
                        title="واتساب"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>
                      </a>
                      <button 
                        type="button" 
                        onClick={copyLink}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-oxford-blue text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5 cursor-pointer" 
                        title="نسخ الرابط"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs: المواصفات التقنية, ميزات المنتج, تقييمات وآراء العملاء */}
        <div className="mt-12">
          <div className="border-b border-stone-200">
            <ul className="nav nav-tabs flex flex-wrap -mb-px text-sm sm:text-base font-bold text-center gap-1 sm:gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={cn(
                    "nav-link inline-flex items-center gap-2 py-3 px-4 sm:px-6 rounded-t-lg border-b-2 transition-all cursor-pointer",
                    activeTab === 'specs'
                      ? "border-oxford-red text-oxford-red bg-stone-50/70 font-black shadow-2xs"
                      : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"
                  )}
                >
                  <span>المواصفات التقنية</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={cn(
                    "nav-link inline-flex items-center gap-2 py-3 px-4 sm:px-6 rounded-t-lg border-b-2 transition-all cursor-pointer",
                    activeTab === 'features'
                      ? "border-oxford-red text-oxford-red bg-stone-50/70 font-black shadow-2xs"
                      : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"
                  )}
                >
                  <span>ميزات المنتج</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    "nav-link inline-flex items-center gap-2 py-3 px-4 sm:px-6 rounded-t-lg border-b-2 transition-all cursor-pointer",
                    activeTab === 'reviews'
                      ? "border-oxford-red text-oxford-red bg-stone-50/70 font-black shadow-2xs"
                      : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"
                  )}
                >
                  <span>تقييمات وآراء العملاء</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Panes */}
          <div className="py-6">
            {activeTab === 'specs' && (
              <div className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-2xs max-w-4xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <tbody className="divide-y divide-stone-100">
                      <tr className="hover:bg-stone-50/40 transition-colors">
                        <td className="px-6 py-2.5 text-stone-600 font-bold w-1/3">الفئة</td>
                        <td className="px-6 py-2.5 text-oxford-blue font-black">{product.category}</td>
                      </tr>
                      {product.brand && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">العلامة التجارية</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{product.brand}</td>
                        </tr>
                      )}
                      {product.productType && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">نوع المنتج</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{product.productType}</td>
                        </tr>
                      )}
                      {product.size && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">النوع / الحجم</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{product.size}</td>
                        </tr>
                      )}
                      {product.minPrice !== undefined && Number(product.minPrice) > 0 && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">السعر الأدنى</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{(Number(product.minPrice) || 0).toFixed(3)} د.ت</td>
                        </tr>
                      )}
                      {product.maxPrice !== undefined && Number(product.maxPrice) > 0 && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">السعر الأقصى</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{(Number(product.maxPrice) || 0).toFixed(3)} د.ت</td>
                        </tr>
                      )}
                      {product.notes && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">ملاحظات</td>
                          <td className="px-6 py-2.5 text-stone-800 font-medium">{product.notes}</td>
                        </tr>
                      )}
                      {product.weight && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">الوزن</td>
                          <td className="px-6 py-2.5 text-oxford-blue font-black">{product.weight}</td>
                        </tr>
                      )}
                      {product.sku && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">رمز المنتج (SKU)</td>
                          <td className="px-6 py-2.5 font-mono text-oxford-blue font-bold">{product.sku}</td>
                        </tr>
                      )}
                      {product.availability && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">حالة التوفر</td>
                          <td className="px-6 py-2.5 text-emerald-700 font-bold">{product.availability}</td>
                        </tr>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <tr className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-stone-600 font-bold">الوسوم</td>
                          <td className="px-6 py-2.5">
                            <div className="flex flex-wrap gap-2">
                              {product.tags.map((tag, i) => (
                                <span key={i} className="text-xs font-black text-oxford-red bg-oxford-red/10 px-2 py-0.5 rounded border border-oxford-red/20">#{tag}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="bg-white rounded-xl border border-stone-200/80 shadow-2xs p-6 sm:p-8 max-w-4xl space-y-4">
                {product.features ? (
                  <div className="prose prose-stone max-w-none text-stone-800 font-medium leading-relaxed whitespace-pre-line text-base">
                    {product.features}
                  </div>
                ) : product.description ? (
                  <div className="text-stone-800 font-medium leading-relaxed whitespace-pre-line text-base">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-stone-500 text-sm">لا توجد ميزات إضافية مسجلة لهذا المنتج حالياً.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl">
                <ProductReviews productId={product.id} productName={product.name} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-oxford-blue flex items-center gap-3">
                <span className="w-2 h-8 bg-oxford-red rounded-full" />
                منتجات قد تعجبك
              </h2>
              <Link to={`/category/${product.category}`} className="text-oxford-red font-bold hover:underline flex items-center gap-2 group text-sm">
                عرض المزيد
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-stone-500 text-[11px] font-bold uppercase tracking-wider mb-1.5 block">{p.category}</span>
                    <h3 className="text-base font-bold text-stone-900 mb-3 group-hover:text-oxford-red transition-colors line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                      <span className="text-lg font-black text-oxford-blue">{p.price.toFixed(3)} <span className="text-xs font-normal">د.ت</span></span>
                      <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-600 group-hover:bg-oxford-red/10 group-hover:text-oxford-red transition-all">
                        <Plus size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-3.5 py-2.5 flex items-center justify-between gap-2.5" dir="rtl">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-10 h-10 object-contain rounded-lg bg-stone-50 border border-stone-100 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">{product.name}</h4>
            <div className="text-xs font-black text-oxford-red leading-tight">
              {(Number(product.price) || 0).toFixed(3)} د.ت
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleAddToCart()}
            className="h-9 px-3 rounded-lg border border-oxford-blue text-oxford-blue font-bold text-xs flex items-center gap-1 hover:bg-oxford-blue hover:text-white transition-colors cursor-pointer"
          >
            <ShoppingCart size={14} />
            <span>السلة</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="h-9 px-3.5 rounded-lg bg-oxford-red text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-oxford-red/90 transition-colors cursor-pointer"
          >
            <span>شراء الآن</span>
          </button>
        </div>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal
        product={product}
        quantity={quantity}
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
      />

      {/* Fullscreen Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setIsLightboxOpen(false);
            setLightboxZoom(1);
          }}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls */}
            <div className="w-full flex items-center justify-between pb-3 text-white border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm truncate max-w-xs sm:max-w-md">{product.name}</span>
                <span className="text-xs text-stone-400 font-mono">({Math.round(lightboxZoom * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.min(3, prev + 0.3))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.max(1, prev - 0.3))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                  title="إعادة ضبط"
                >
                  إعادة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(false);
                    setLightboxZoom(1);
                  }}
                  className="p-1.5 rounded-lg bg-oxford-red text-white hover:bg-oxford-red/90 transition-colors cursor-pointer ms-2"
                  title="إغلاق"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image View */}
            <div className="overflow-auto max-h-[75vh] w-full flex items-center justify-center p-3 rounded-2xl bg-stone-900/50">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="max-h-[68vh] object-contain transition-transform duration-200 select-none rounded-xl"
                style={{ transform: `scale(${lightboxZoom})` }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails below image */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-stone-900",
                      (activeImage === img || (!activeImage && i === 0)) ? "border-oxford-red scale-105" : "border-white/20 hover:border-white/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
