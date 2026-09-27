import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquare, Send } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

const defaultReviewsMap: Record<number, Review[]> = {
  1: [
    {
      id: 'rev-1',
      author: 'سامي الماجري',
      rating: 5,
      date: 'منذ يومين',
      comment: 'جودة الورق ممتازة جداً وأصلية. الحبر لا ينفذ للجهة المقابلة، التغليف كان متقناً والتوصيل سريع إلى نابل.',
      verified: true,
      likes: 8
    },
    {
      id: 'rev-2',
      author: 'مريم بن فرج',
      rating: 5,
      date: 'منذ أسبوع',
      comment: 'دفاتر أكسفورد لا يعلى عليها دائماً، اشتريت كمية كاملة للعام الدراسي ومسرورة بالتعامل مع مكتبتكم.',
      verified: true,
      likes: 4
    }
  ]
};

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  useEffect(() => {
    const storageKey = `oxford_reviews_${productId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Error loading reviews', e);
      }
    }
    const defaults = defaultReviewsMap[productId] || [
      {
        id: `rev-${productId}-1`,
        author: 'كريم المنصوري',
        rating: 5,
        date: 'منذ 3 أيام',
        comment: 'منتج ممتاز ومطابق تماماً للصور والمواصفات. أنصح به بشدة لكل من يبحث عن الجودة.',
        verified: true,
        likes: 5
      },
      {
        id: `rev-${productId}-2`,
        author: 'إيمان الرياحي',
        rating: 5,
        date: 'منذ أسبوع',
        comment: 'سعر مناسب وجودة أصلية، خدمة العملاء أيضاً متعاونة جداً وسرعة التوصيل ممتازة.',
        verified: true,
        likes: 3
      }
    ];
    setReviews(defaults);
  }, [productId]);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem(`oxford_reviews_${productId}`, JSON.stringify(updated));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'اليوم',
      comment: newComment.trim(),
      verified: true,
      likes: 0
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    setShowAddForm(false);
    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 4000);
  };

  const handleLike = (reviewId: string) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r);
    saveReviews(updated);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="bg-white rounded-2xl border border-stone-100 shadow-md p-6 lg:p-8 mt-12 text-right" dir="rtl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-oxford-red rounded-full" />
          <h2 className="text-xl font-bold text-stone-900">تقييمات وآراء العملاء</h2>
          <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-bold">
            {reviews.length} تقييم
          </span>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-oxford-blue hover:bg-oxford-blue/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare size={14} />
          <span>{showAddForm ? 'إلغاء التقييم' : 'أضف تقييمك'}</span>
        </button>
      </div>

      {isSuccessMessage && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>شكراً لك! تم نشر تقييمك بنجاح.</span>
        </div>
      )}

      {/* Ratings Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-stone-100 items-center">
        {/* Big Average */}
        <div className="text-center md:border-l md:border-stone-100 md:pl-6">
          <div className="text-4xl lg:text-5xl font-black text-oxford-blue mb-1">
            {averageRating}
          </div>
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={star <= Math.round(Number(averageRating)) ? "fill-current" : "text-stone-300"}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 font-bold">بناءً على {reviews.length} تقييماً معتمداً</p>
        </div>

        {/* Breakdown Bars */}
        <div className="col-span-2 space-y-1.5 max-w-md">
          {[5, 4, 3, 2, 1].map((ratingVal) => {
            const count = reviews.filter(r => r.rating === ratingVal).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={ratingVal} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-stone-600 font-bold flex items-center gap-1">
                  {ratingVal} <Star size={11} className="fill-current text-amber-500" />
                </span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-stone-600 text-[11px] text-left">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleAddReview} className="p-4 bg-stone-50 rounded-xl border border-stone-200 mt-6 space-y-3">
          <h4 className="text-sm font-bold text-stone-900">شاركنا رأيك في {productName}</h4>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">اختر التقييم:</label>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer focus:outline-none"
                >
                  <Star
                    size={22}
                    className={
                      star <= (hoverRating || newRating)
                        ? "fill-current text-amber-500"
                        : "text-stone-300"
                    }
                  />
                </button>
              ))}
              <span className="text-xs text-stone-600 mr-2 font-bold">
                {newRating === 5 ? 'ممتاز جداً' : newRating === 4 ? 'جيد جداً' : newRating === 3 ? 'متوسط' : 'أقل من المتوقع'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">الاسم الكامل:</label>
            <input
              type="text"
              required
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="مثال: أنيس التونسي"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-oxford-blue bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">رأيك بالتفصيل:</label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتب تجربتك مع المنتج، جودة الصنع، أو سرعة التوصيل..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-oxford-blue bg-white"
            />
          </div>

          <button
            type="submit"
            className="bg-oxford-red hover:bg-oxford-red/90 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Send size={14} />
            <span>نشر التقييم</span>
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-stone-100 mt-6">
        {reviews.map((review) => (
          <div key={review.id} className="py-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-oxford-blue/10 text-oxford-blue font-bold text-xs flex items-center justify-center">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">{review.author}</span>
                    {review.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        <CheckCircle size={10} className="text-emerald-600" />
                        <span>مشتري موثّق</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-600">{review.date}</span>
                </div>
              </div>

              <div className="flex items-center text-amber-500 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    className={star <= review.rating ? "fill-current" : "text-stone-300"}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-medium pr-10">
              {review.comment}
            </p>

            <div className="pr-10 flex items-center gap-4 text-[11px] text-stone-600 pt-1">
              <button
                type="button"
                onClick={() => handleLike(review.id)}
                className="flex items-center gap-1 hover:text-oxford-blue transition-colors cursor-pointer"
              >
                <ThumbsUp size={12} />
                <span>مفيد ({review.likes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
