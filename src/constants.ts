import { Product, Category } from './types';

export const categories: Category[] = [
  {
    name: "حقائب وأمتعة",
    icon: "https://oxfordcity.tn/cdn/shop/files/school-bag_17738834_x26.png?v=1748442626",
    bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    itemCount: 310,
    subcategories: ["🎒 حقائب مدرسية وحقائب متنوعة", "💼 حقائب سفر وحقائب عمل", "👝 مقالم", "🥖 حقائب وجبات وصناديق طعام", "💧 زجاجات مياه", "🛒 عربات للمحافظ"]
  },
  {
    name: "أدوات مكتبية",
    icon: "https://oxfordcity.tn/cdn/shop/files/desk_17738731_x26.png?v=1748442565",
    bannerImage: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    itemCount: 245,
    subcategories: ["🕰️ إكسسوارات مكتبية", "📎 دباسات، مشابك وتثبيت", "🔎 آلات حاسبة ومكبرات", "📋 لوحات وعرض", "📄 قرطاسية"]
  },
  {
    name: "اللوازم المدرسية",
    icon: "https://oxfordcity.tn/cdn/shop/files/pencil_17738807_x26.png?v=1748442883",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/fourniture_e8a19cfb-6b3a-450d-bca0-8957801d18c7.jpg?v=1748686317&width=800",
    itemCount: 821,
    subcategories: ["🖍️ تلوين وأدوات رسم", "🖊️ أقلام جافة", "✏️ برايات ومماحي", "📐 مساطر وأدوات هندسية", "🖍️ أقلام تحديد (Highlighters)", "📒 كراسات وأغلفة كراسات", "🖌️ أقلام لباد (Marqueurs)", "🧴 صمغ ولاصق", "✂️ مشرط ومقصات", "✏️ أقلام رصاص", "🪧 ألواح وإكسسوارات", "📘 دفاتر ملاحظات (Notes Book)", "🏳️ أدوات تصحيح وغيرها"]
  },
  {
    name: "الأنشطة اللامنهجية",
    icon: "https://oxfordcity.tn/cdn/shop/files/book_17738693_1_x26.png?v=1748442897",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/para_0783570a-51cb-428f-a44e-e5dba7946590.jpg?v=1748692048&width=800",
    itemCount: 793,
    subcategories: ["📚 مدرسة ابتدائية حكومية", "📚 إعدادي حكومي", "👶 تحضيري (3-6 سنوات)", "📚 ثانوي حكومي", "🇫🇷 مدرسة فرنسية", "🇬🇧 كتب إنجليزية", "🟠 مدرسة خاصة", "🌍 لغات حية", "📖 قواميس"]
  },
  {
    name: "الكتب",
    icon: "https://oxfordcity.tn/cdn/shop/files/books_17738698_x26.png?v=1748442913",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/livre_4dd51637-2c26-47bb-88df-93d07ad2c0fd.jpg?v=1748686883&width=800",
    itemCount: 133,
    subcategories: ["📕 كتب عربية", "📘 كتب فرنسية", "📗 كتب دينية"]
  },
  {
    name: "علوم الحاسوب",
    icon: "https://oxfordcity.tn/cdn/shop/files/computer_17738717_x26.png?v=1748442924",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/informatik.jpg?v=1748691769&width=800",
    itemCount: 171,
    subcategories: ["⌚ ساعات ذكية وأدوات", "🔌 كابلات وشواحن وبنوك طاقة", "🖨️ حبر وطباعة", "🎧 سماعات رأس وسماعات أذن", "💾 تخزين", "🖱️ ماوس ولوحات ماوس", "🔈 مكبرات صوت", "⌨️ لوحات مفاتيح"]
  },
  {
    name: "ألعاب",
    icon: "https://oxfordcity.tn/cdn/shop/files/geometry_12094244_x26.png?v=1748442939",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/jouet_d89ed867-06e2-415d-92fa-c6567af43eba.jpg?v=1748684822&width=800",
    itemCount: 83,
    subcategories: ["🧸 ألعاب"]
  },
  {
    name: "الفنون الجميلة",
    icon: "https://oxfordcity.tn/cdn/shop/files/color-palette_17738712_x26.png?v=1748442986",
    bannerImage: "https://oxfordcity.tn/cdn/shop/files/beaux_art.jpg?v=1748687752&width=800",
    itemCount: 423,
    subcategories: ["🎨 دهانات وألوان", "🏺 نمذجة وأدوات", "✏️ أقلام رصاص وأقلام", "🖌️ فرش رسم", "🖼️ إكسسوارات رسم", "🕯️ شموع وريزين", "📓 دفاتر رسم (Sketchbook)", "✍🏻 أحبار وخط عربي"]
  },
  {
    name: "مستندات",
    icon: "https://oxfordcity.tn/cdn/shop/files/desk_17738731_x26.png?v=1748442565",
    bannerImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    itemCount: 0,
    subcategories: ["📄 ملفات ومستندات", "📁 حافظات وأوراق", "🖨️ خدمات طباعة ونسخ", "📑 مصنفات وأظرف"]
  }
];

export const COLOR_HEX_MAP: Record<string, string> = {
  noir: '#1f2937',
  أسود: '#1f2937',
  black: '#1f2937',
  rouge: '#ef4444',
  أحمر: '#ef4444',
  red: '#ef4444',
  vert: '#10b981',
  أخضر: '#10b981',
  green: '#10b981',
  bleu: '#3b82f6',
  أزرق: '#3b82f6',
  blue: '#3b82f6',
  jaune: '#f59e0b',
  أصفر: '#f59e0b',
  yellow: '#f59e0b',
  blanc: '#f8fafc',
  أبيض: '#f8fafc',
  white: '#f8fafc',
  gris: '#9ca3af',
  رمادي: '#9ca3af',
  gray: '#9ca3af',
  rose: '#ec4899',
  وردي: '#ec4899',
  pink: '#ec4899',
  orange: '#f97316',
  برتقالي: '#f97316',
  violet: '#8b5cf6',
  بنفسجي: '#8b5cf6',
  purple: '#8b5cf6',
  marron: '#78350f',
  بني: '#78350f',
  brown: '#78350f',
};

export const products: Product[] = [];

export const brands = [
  { name: "مابيد", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Maped_logo.svg/1200px-Maped_logo.svg.png" },
  { name: "ستيدتلر", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Staedtler_logo.svg/2560px-Staedtler_logo.svg.png" },
  { name: "بايلوت", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pilot_Pen_logo.svg/1280px-Pilot_Pen_logo.svg.png" },
  { name: "كانسون", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Canson_logo.svg/1200px-Canson_logo.svg.png" },
  { name: "فابر كاستل", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Faber-Castell_logo.svg/2560px-Faber-Castell_logo.svg.png" }
];
