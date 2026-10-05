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
    name: "رمضان",
    icon: "https://oxfordcity.tn/cdn/shop/files/moon_721105_copie_44811191-582e-4529-97a2-fc04617349a0_x26.png?v=1770214307",
    bannerImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800",
    itemCount: 54,
    subcategories: ["🌙 زينة رمضان"]
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

export const products: Product[] = [
  {
    id: 1,
    sku: "OXF-1001",
    name: "حقيبة مدرسية مريحة - أزرق",
    brand: "أكسفورد سيتي",
    price: 85.000,
    compareAtPrice: 102.000,
    description: "حقيبة مدرسية عالية الجودة بتصميم مريح للظهر ومساحات تخزين متعددة.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    category: "حقائب وأمتعة",
    subcategory: "🎒 حقائب مدرسية وحقائب متنوعة",
    colors: ["Noir", "Bleu", "Rouge"],
    rating: 5,
    reviewsCount: 120,
    tags: ["حقائب", "لوازم مدرسية", "حقائب مدرسية"]
  },
  {
    id: 2,
    sku: "OX-2001",
    name: "طقم أقلام تلوين 24 لون",
    brand: "أكسفورد سيتي",
    price: 12.500,
    compareAtPrice: 15.000,
    description: "أقلام تلوين خشبية ناعمة وسهلة الدمج، مثالية للرسم والتلوين المدرسي.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    category: "اللوازم المدرسية",
    subcategory: "🖍️ تلوين وأدوات رسم",
    colors: ["Noir", "Rouge", "Vert", "Bleu"],
    rating: 5,
    reviewsCount: 65,
    tags: ["أدوات مكتبية", "لوازم مدرسية", "تلوين"]
  },
  {
    id: 3,
    sku: "OXF-1003",
    name: "دفتر ملاحظات فاخر A5",
    price: 18.500,
    description: "دفتر ملاحظات بغلاف جلدي وورق عالي الجودة، مناسب للكتابة اليومية.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800",
    category: "اللوازم المدرسية",
    subcategory: "📘 دفاتر ملاحظات (Notes Book)",
    tags: ["دفاتر", "ملاحظات"]
  },
  {
    id: 4,
    sku: "OXF-1004",
    name: "مقلمة مدرسية بتصميم عصري",
    price: 9.900,
    description: "مقلمة واسعة تتسع لجميع الأدوات المكتبية بتصميم جذاب ومقاوم للماء.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    category: "حقائب وأمتعة",
    subcategory: "👝 مقالم",
    tags: ["مقالم", "حقائب"]
  },
  {
    id: 5,
    sku: "OXF-1005",
    name: "مجموعة هندسية متكاملة",
    price: 15.000,
    description: "طقم أدوات هندسية دقيق يحتوي على فرجار ومسطرة ومنقلة وكوس.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    category: "اللوازم المدرسية",
    subcategory: "📐 مساطر وأدوات هندسية",
    tags: ["هندسة", "مساطر"]
  },
  {
    id: 6,
    sku: "OXF-1006",
    name: "ساعة ذكية للأطفال مع تتبع GPS",
    price: 149.000,
    description: "ساعة ذكية مع تتبع GPS ومكالمات صوتية للأمان والترفيه للأطفال.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    category: "علوم الحاسوب",
    subcategory: "⌚ ساعات ذكية وأدوات",
    tags: ["ساعات", "إلكترونيات"]
  },
  {
    id: 7,
    sku: "OXF-1007",
    name: "ألوان مائية احترافية 18 لون",
    price: 45.000,
    description: "مجموعة ألوان مائية بجودة فنية عالية للرسامين والمبدعين والطلبة.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    category: "الفنون الجميلة",
    subcategory: "🎨 دهانات وألوان",
    tags: ["فنون", "ألوان", "رسم"]
  },
  {
    id: 8,
    sku: "OXF-1008",
    name: "مصباح مكتب LED لحماية العين",
    price: 35.000,
    description: "مصباح مكتب قابل للتعديل مع مستويات إضاءة متعددة ومريح للقراءة.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
    category: "أدوات مكتبية",
    subcategory: "🕰️ إكسسوارات مكتبية",
    tags: ["مكتب", "إكسسوارات"]
  },
  {
    id: 9,
    sku: "OXF-1009",
    name: "حقيبة وجبات عازلة للحرارة",
    price: 28.500,
    description: "حقيبة طعام مدرسية عازلة للحرارة تحفظ الوجبات طازجة وصحية طوال اليوم.",
    image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=800",
    category: "حقائب وأمتعة",
    subcategory: "🥖 حقائب وجبات وصناديق طعام",
    tags: ["وجبات", "حقائب"]
  },
  {
    id: 10,
    sku: "OXF-1010",
    name: "زجاجة مياه رياضية استانلس ستيل",
    price: 19.900,
    description: "زجاجة مياه صحية ومقاومة للتسرب تحفظ البرودة حتى 24 ساعة.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800",
    category: "حقائب وأمتعة",
    subcategory: "💧 زجاجات مياه",
    tags: ["مياه", "قارورة"]
  },
  {
    id: 11,
    sku: "OXF-1011",
    name: "دباسة مكتبية معدنية متينة",
    price: 14.500,
    description: "دباسة مكتبية شديدة التحمل مع علبة دبابيس مجانية مناسبة للمكاتب والمدارس.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    category: "أدوات مكتبية",
    subcategory: "📎 دباسات، مشابك وتثبيت",
    tags: ["دباسة", "مكتب"]
  },
  {
    id: 12,
    sku: "OXF-1012",
    name: "آلة حاسبة علمية متطورة",
    price: 42.000,
    description: "آلة حاسبة علمية دقيقة لطلبة الإعدادي والثانوي والجامعات بـ 240 دالة رياضية.",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800",
    category: "أدوات مكتبية",
    subcategory: "🔎 آلات حاسبة ومكبرات",
    tags: ["حاسبة", "رياضيات"]
  },
  {
    id: 13,
    sku: "OXF-1013",
    name: "لوح مغناطيسي أبيض للكتابة 60x40 سم",
    price: 34.000,
    description: "سبورة بيضاء مغناطيسية مع أقلام وممحاة لتنظيم المهام والملاحظات.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    category: "أدوات مكتبية",
    subcategory: "📋 لوحات وعرض",
    tags: ["لوحات", "عرض", "سبورة"]
  },
  {
    id: 14,
    sku: "OXF-1014",
    name: "طقم أقلام جافة زرقاء 10 أقلام",
    price: 6.500,
    description: "أقلام حبر جاف عالية الجودة وسلسة في الكتابة لا تقطع ومريحة لليد.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    category: "اللوازم المدرسية",
    subcategory: "🖊️ أقلام جافة",
    tags: ["أقلام", "حبر"]
  },
  {
    id: 15,
    sku: "OXF-1015",
    name: "مجموعة كراسات مدرسية 96 صفحة",
    price: 18.000,
    description: "طقم 5 كراسات مدرسية مسطرة ورق ممتاز ناصع البياض 80 غرام.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    category: "اللوازم المدرسية",
    subcategory: "📒 كراسات وأغلفة كراسات",
    tags: ["كراسات", "دفاتر"]
  },
  {
    id: 16,
    sku: "OXF-1016",
    name: "كتاب الأنشطة والتمارين للمرحلة الابتدائية",
    price: 16.500,
    description: "تمارين وأنشطة منهجية لدعم مهارات الحساب واللغات للسنوات الابتدائية.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    category: "الأنشطة اللامنهجية",
    subcategory: "📚 مدرسة ابتدائية حكومية",
    tags: ["ابتدائي", "أنشطة", "كتب"]
  },
  {
    id: 17,
    sku: "OXF-1017",
    name: "سلسلة التحدي والتميز للإعدادي",
    price: 22.000,
    description: "ملخصات شاملة وتمارين نموذجية مع الحلول المفصلة لطلبة التعليم الإعدادي.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    category: "الأنشطة اللامنهجية",
    subcategory: "📚 إعدادي حكومي",
    tags: ["إعدادي", "تمارين", "كتب"]
  },
  {
    id: 18,
    sku: "OXF-1018",
    name: "قاموس أكسفورد المصور فرنسي-عربي",
    price: 35.000,
    description: "قاموس لغوي مصور ثنائي اللغة يدعم أكثر من 3000 كلمة ومصطلح مصور.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800",
    category: "الأنشطة اللامنهجية",
    subcategory: "📖 قواميس",
    tags: ["قواميس", "فرنسي", "عربي"]
  },
  {
    id: 19,
    sku: "OXF-1019",
    name: "رواية الأدب العالمي مترجمة بالعربية",
    price: 24.000,
    description: "طبعة أنيقة لرواية أدبية شهيرة بترجمة دقيقة وغلاف فاخر.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    category: "الكتب",
    subcategory: "📕 كتب عربية",
    tags: ["روايات", "كتب", "أدب"]
  },
  {
    id: 20,
    sku: "OXF-1020",
    name: "موسوعة المعارف والعلوم المصورة",
    price: 38.000,
    description: "موسوعة علمية غنية بالصور والرسومات التوضيحية المشوقة للناشئة.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    category: "الكتب",
    subcategory: "📘 كتب فرنسية",
    tags: ["موسوعة", "علوم", "كتب"]
  },
  {
    id: 21,
    sku: "OXF-1021",
    name: "المصحف الشريف بتجويد ملون وتفسير ميسر",
    price: 29.000,
    description: "مصحف كريم بحجم مناسب مع ترميز لوني لأحكام التجويد وتفسير على الهامش.",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    category: "الكتب",
    subcategory: "📗 كتب دينية",
    tags: ["مصحف", "ديني", "كتب"]
  },
  {
    id: 22,
    sku: "OXF-1022",
    name: "ماوس لاسلكي مريح مع لوحة ماوس طبية",
    price: 26.500,
    description: "ماوس لاسلكي صامت بتصميم مريح لليد مع وسادة دعم للمعصم.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    category: "علوم الحاسوب",
    subcategory: "🖱️ ماوس ولوحات ماوس",
    tags: ["ماوس", "حاسوب"]
  },
  {
    id: 23,
    sku: "OXF-1023",
    name: "سماعات رأس تعليمية مع ميكروفون مدمج",
    price: 49.000,
    description: "سماعات رأس خفيفة ومريحة مع عزل للضوضاء مثالية للدراسة والاجتماعات.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    category: "علوم الحاسوب",
    subcategory: "🎧 سماعات رأس وسماعات أذن",
    tags: ["سماعات", "صوت"]
  },
  {
    id: 24,
    sku: "OXF-1024",
    name: "مجموعة ألعاب ذكاء وتركيب للأطفال",
    price: 39.000,
    description: "لعبة تركيب إبداعية لتطوير المهارات الهندسية والتفكير المنطقي للصغار.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800",
    category: "ألعاب",
    subcategory: "🧸 ألعاب",
    tags: ["ألعاب", "ذكاء", "تركيب"]
  },
  {
    id: 25,
    sku: "OXF-1025",
    name: "لعبة شطرنج خشبية فاخرة قابلة للطي",
    price: 45.000,
    description: "طقم شطرنج مصنوع من الخشب الطبيعي المصقول مع قطع منحوتة بدقة.",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800",
    category: "ألعاب",
    subcategory: "🧸 ألعاب",
    tags: ["شطرنج", "ألعاب"]
  },
  {
    id: 26,
    sku: "OXF-1026",
    name: "كراسة رسم احترافية كانسون 300 غرام",
    price: 28.000,
    description: "ورق رسم مائي عالي الجودة قطني الملمس مناسب لجميع تقنيات الرسم.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    category: "الفنون الجميلة",
    subcategory: "📓 دفاتر رسم (Sketchbook)",
    tags: ["رسم", "كانسون", "فنون"]
  },
  {
    id: 27,
    sku: "OXF-1027",
    name: "طقم فرش رسم فنية متعددة الأحجام 12 فرشاة",
    price: 21.500,
    description: "فرش رسم ناعمة من شعر السنجاب الصناعي للألوان المائية والزيتية والأكريليك.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    category: "الفنون الجميلة",
    subcategory: "🖌️ فرش رسم",
    tags: ["فرش", "رسم", "فنون"]
  },
  {
    id: 28,
    sku: "OXF-1028",
    name: "فانوس رمضان معدني مضيء بتصميم تقليدي",
    price: 32.000,
    description: "فانوس رمضاني بنقوش إسلامية وزجاج ملون مع إضاءة دافئة مبهجة.",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800",
    category: "رمضان",
    subcategory: "🌙 زينة رمضان",
    tags: ["رمضان", "فانوس", "زينة"]
  },
  {
    id: 29,
    sku: "OXF-1029",
    name: "حبل إضاءة وزينة رمضانية نجوم وهلال LED",
    price: 19.500,
    description: "سلسلة أضواء رمضانية أنيقة بأشكال النجوم والهلال لتزيين المنزل.",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=800",
    category: "رمضان",
    subcategory: "🌙 زينة رمضان",
    tags: ["رمضان", "إضاءة", "زينة"]
  }
];

export const brands = [
  { name: "مابيد", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Maped_logo.svg/1200px-Maped_logo.svg.png" },
  { name: "ستيدتلر", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Staedtler_logo.svg/2560px-Staedtler_logo.svg.png" },
  { name: "بايلوت", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pilot_Pen_logo.svg/1280px-Pilot_Pen_logo.svg.png" },
  { name: "كانسون", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Canson_logo.svg/1200px-Canson_logo.svg.png" },
  { name: "فابر كاستل", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Faber-Castell_logo.svg/2560px-Faber-Castell_logo.svg.png" }
];
