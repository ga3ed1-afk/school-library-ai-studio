import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoreStyle = 
  | 'oxfordcity'
  | 'erp_enterprise'
  | 'cyber_dark'
  | 'artisan_bakery'
  | 'medical_clinic'
  | 'cloud_crm'
  | 'pos_supermarket'
  | 'hr_peoplehub'
  | 'industrial_buildtrack'
  | 'original'
  | 'minimalist'
  | 'vibrant'
  | 'oxford';

export interface StyleConfig {
  id: StoreStyle;
  name: string;
  subtitle: string;
  tagline: string;
  cornerLabel: string;
  accentColor: string;
  accentTouch: string;
  headerBgColor: string;
  headerBg: string;
  pageBg: string;
  textColor: string;
  cardBg: string;
  cardContentBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardRadius: string;
  imageRadius: string;
  btnRadius: string;
  badgeRadius: string;
  titleColor: string;
  priceColor: string;
  quickBuyBtn: string;
  cartBtn: string;
  badgeBg: string;
  badgeText: string;
  bannerGradient: string;
  tagText: string;
  previewColors: string[];
  // Desktop subcategories dropdown styling
  dropdownBg: string;
  dropdownBorder: string;
  dropdownText: string;
  dropdownTitleColor: string;
  dropdownHeaderBorder: string;
  dropdownItemHover: string;
  dropdownViewAllBtn: string;
}

export const STORE_STYLES: Record<StoreStyle, StyleConfig> = {
  // Official Default Style
  oxfordcity: {
    id: 'oxfordcity',
    name: 'تنسيق بن عمار الرسمي',
    subtitle: 'Official Ben Ammar Purple OKLCH',
    tagline: 'التنسيق الرسمي المعتمد لموقع بن عمار: هيدر أرجواني ملكي، خلفيات ستون نقية، وزوايا مقتضبة كلاسيكية',
    cornerLabel: 'زوايا كلاسيكية مقتضبة (2px)',
    accentColor: 'oklch(54.1% 0.281 293.009)',
    accentTouch: 'oklch(0.54 0.28 290.94 / 0.85)',
    headerBgColor: 'oklch(54.1% 0.281 293.009)',
    headerBg: 'bg-[oklch(54.1%_0.281_293.009)]',
    pageBg: 'bg-stone-50',
    textColor: 'text-stone-900',
    cardBg: 'bg-stone-50',
    cardContentBg: 'bg-white',
    cardBorder: 'border-stone-200',
    cardHoverBorder: 'hover:border-[oklch(54.1%_0.281_293.009)]',
    cardRadius: 'rounded-xs',
    imageRadius: 'rounded-t-xs',
    btnRadius: 'rounded-xs',
    badgeRadius: 'rounded-xs',
    titleColor: 'text-stone-900 hover:text-[oklch(54.1%_0.281_293.009)]',
    priceColor: 'text-[oklch(54.1%_0.281_293.009)]',
    quickBuyBtn: 'bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white font-black shadow-xs shadow-purple-500/20',
    cartBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 font-black shadow-2xs',
    badgeBg: 'bg-[oklch(54.1%_0.281_293.009)] text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-[oklch(54.1%_0.281_293.009)] via-[oklch(48%_0.26_290)] to-stone-900',
    tagText: 'سعر خاص',
    previewColors: ['#9333ea', '#7e22ce', '#f5f5f4'],
    dropdownBg: 'bg-[#1e142b]',
    dropdownBorder: 'border-[oklch(54.1%_0.281_293.009)]/60 shadow-2xl',
    dropdownText: 'text-white',
    dropdownTitleColor: 'text-purple-300',
    dropdownHeaderBorder: 'border-white/15',
    dropdownItemHover: 'text-purple-100 hover:bg-white/10 hover:text-white hover:border-purple-400/40',
    dropdownViewAllBtn: 'bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white font-black'
  },

  // 1. ERP Enterprise (Image 1 - Intacct ERP)
  erp_enterprise: {
    id: 'erp_enterprise',
    name: '1. ستايل المؤسسات ERP الأزرق',
    subtitle: 'Intacct ERP Modern Blue (صورة 1)',
    tagline: 'مستوحى من أنظمة الـ ERP الحديثة: أزرق ملكي كهربائي (#2563eb)، خلفية جليدية نقية، وبطاقات بظلال خفيفة ناعمة',
    cornerLabel: 'زوايا عصرية متوازنة (12px - rounded-xl)',
    accentColor: '#2563eb',
    accentTouch: '#3b82f6',
    headerBgColor: '#1d4ed8',
    headerBg: 'bg-blue-700',
    pageBg: 'bg-slate-50',
    textColor: 'text-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10',
    cardRadius: 'rounded-xl',
    imageRadius: 'rounded-t-xl',
    btnRadius: 'rounded-lg',
    badgeRadius: 'rounded-md',
    titleColor: 'text-slate-900 hover:text-blue-600',
    priceColor: 'text-blue-600',
    quickBuyBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black shadow-sm shadow-blue-500/25',
    cartBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold',
    badgeBg: 'bg-blue-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-blue-700 via-blue-600 to-slate-900',
    tagText: 'مميز',
    previewColors: ['#2563eb', '#1d4ed8', '#f8fafc', '#10b981'],
    dropdownBg: 'bg-white',
    dropdownBorder: 'border-blue-200 shadow-2xl ring-1 ring-blue-500/10',
    dropdownText: 'text-slate-800',
    dropdownTitleColor: 'text-blue-700',
    dropdownHeaderBorder: 'border-slate-100',
    dropdownItemHover: 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
    dropdownViewAllBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black'
  },

  // 2. Cyber Luxury Dark (Image 2 - Automobile Luxury Dark)
  cyber_dark: {
    id: 'cyber_dark',
    name: '2. ستايل الفخامة والسيارات الداكن',
    subtitle: 'Automobile Dark & Neon (صورة 2)',
    tagline: 'مستوحى من واجهات السيارات الفاخرة المظلمة: خلفية داكنة فحمية عميقة (#0b0f19)، كروت نيون زرقاء متوهجة، وحدود شفافة أنيقة',
    cornerLabel: 'زوايا فخمة انسيابية (12px - rounded-xl)',
    accentColor: '#6366f1',
    accentTouch: '#4f46e5',
    headerBgColor: '#0b0f19',
    headerBg: 'bg-[#0b0f19]',
    pageBg: 'bg-[#0b0f19]',
    textColor: 'text-slate-100',
    cardBg: 'bg-[#131b2e]',
    cardContentBg: 'bg-[#131b2e]',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/15',
    cardRadius: 'rounded-xl',
    imageRadius: 'rounded-t-xl',
    btnRadius: 'rounded-lg',
    badgeRadius: 'rounded-md',
    titleColor: 'text-slate-100 hover:text-indigo-400',
    priceColor: 'text-indigo-400',
    quickBuyBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-md shadow-indigo-600/30',
    cartBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold',
    badgeBg: 'bg-indigo-600/95 text-white border border-indigo-400/40',
    badgeText: 'text-white',
    bannerGradient: 'from-[#0b0f19] via-[#1e1b4b] to-[#0f172a]',
    tagText: 'VIP',
    previewColors: ['#0b0f19', '#4f46e5', '#6366f1', '#1e293b'],
    dropdownBg: 'bg-[#0d1322]',
    dropdownBorder: 'border-indigo-500/50 shadow-2xl shadow-indigo-950/80',
    dropdownText: 'text-slate-100',
    dropdownTitleColor: 'text-indigo-400',
    dropdownHeaderBorder: 'border-slate-800',
    dropdownItemHover: 'text-slate-200 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/40',
    dropdownViewAllBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black'
  },

  // 3. Artisanal Bakery & Nature (Image 3 - Antixor Bakery)
  artisan_bakery: {
    id: 'artisan_bakery',
    name: '3. ستايل الطبيعة والمخبوزات الدافئ',
    subtitle: 'Antixor Green & Warm Amber (صورة 3)',
    tagline: 'مستوحى من متاجر الأغذية العضوية والمخبوزات الفاخرة: أخضر الغابات الزمردي (#1b4332)، عسل دافئ (#d97706)، وخلفية كريمية مريحة',
    cornerLabel: 'زوايا ناعمة ومنحنية جداً (20px - rounded-2xl)',
    accentColor: '#1b4332',
    accentTouch: '#d97706',
    headerBgColor: '#1b4332',
    headerBg: 'bg-[#1b4332]',
    pageBg: 'bg-[#fcfaf5]',
    textColor: 'text-stone-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-[#fbf9f4]',
    cardBorder: 'border-[#e9e3d5]',
    cardHoverBorder: 'hover:border-[#2d6a4f] hover:shadow-md hover:shadow-emerald-900/10',
    cardRadius: 'rounded-2xl',
    imageRadius: 'rounded-t-2xl',
    btnRadius: 'rounded-xl',
    badgeRadius: 'rounded-lg',
    titleColor: 'text-[#1b4332] hover:text-[#2d6a4f]',
    priceColor: 'text-[#d97706]',
    quickBuyBtn: 'bg-[#d97706] hover:bg-[#b45309] text-white font-black shadow-md shadow-amber-600/25',
    cartBtn: 'bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold',
    badgeBg: 'bg-[#1b4332] text-amber-300 border border-amber-300/30',
    badgeText: 'text-amber-300',
    bannerGradient: 'from-[#1b4332] via-[#2d6a4f] to-[#081c15]',
    tagText: 'طبيعي فاخر',
    previewColors: ['#1b4332', '#d97706', '#fefcf3', '#2d6a4f'],
    dropdownBg: 'bg-[#153427]',
    dropdownBorder: 'border-amber-600/40 shadow-2xl shadow-emerald-950/60',
    dropdownText: 'text-[#fefcf6]',
    dropdownTitleColor: 'text-amber-400',
    dropdownHeaderBorder: 'border-emerald-800/60',
    dropdownItemHover: 'text-emerald-100 hover:bg-emerald-900/60 hover:text-amber-300 hover:border-amber-400/40',
    dropdownViewAllBtn: 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-black'
  },

  // 4. Medical Clinic (Image 4 - Antixor Hospital)
  medical_clinic: {
    id: 'medical_clinic',
    name: '4. ستايل المنظومة الطبية والصفاء',
    subtitle: 'Antixor Hospital Sky Cyan (صورة 4)',
    tagline: 'مستوحى من بوابات الرعاية الصحية والعيادات: أزرق سماوي نقي (#0284c7)، خلفية بيضاء ثلجية، ونصوص كحلية طبية بالغة الوضوح',
    cornerLabel: 'زوايا هندسية طبية دقيقة (10px - rounded-lg)',
    accentColor: '#0284c7',
    accentTouch: '#0ea5e9',
    headerBgColor: '#0284c7',
    headerBg: 'bg-sky-600',
    pageBg: 'bg-[#f0f9ff]',
    textColor: 'text-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-sky-100',
    cardHoverBorder: 'hover:border-sky-400 hover:shadow-md hover:shadow-sky-500/10',
    cardRadius: 'rounded-lg',
    imageRadius: 'rounded-t-lg',
    btnRadius: 'rounded-md',
    badgeRadius: 'rounded-sm',
    titleColor: 'text-slate-900 hover:text-sky-600',
    priceColor: 'text-sky-600',
    quickBuyBtn: 'bg-sky-600 hover:bg-sky-700 text-white font-black shadow-sm shadow-sky-500/25',
    cartBtn: 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold',
    badgeBg: 'bg-sky-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-sky-700 via-sky-600 to-slate-900',
    tagText: 'معتمد',
    previewColors: ['#0284c7', '#0ea5e9', '#f0f9ff', '#0f172a'],
    dropdownBg: 'bg-white',
    dropdownBorder: 'border-sky-200 shadow-2xl ring-1 ring-sky-500/15',
    dropdownText: 'text-slate-800',
    dropdownTitleColor: 'text-sky-700',
    dropdownHeaderBorder: 'border-sky-100',
    dropdownItemHover: 'text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200',
    dropdownViewAllBtn: 'bg-sky-600 hover:bg-sky-700 text-white font-black'
  },

  // 5. Cloud CRM ConnectHub (Image 5 - ConnectHub)
  cloud_crm: {
    id: 'cloud_crm',
    name: '5. ستايل مراكز الاتصال السحابي',
    subtitle: 'ConnectHub CRM SaaS (صورة 5)',
    tagline: 'مستوحى من منصات خدمة العملاء والـ CRM السحابية: كحلي سحابي عميق (#1e40af)، خلفية سحابية ناعمة، ومؤشرات ملونة مبهجة',
    cornerLabel: 'زوايا كبسولية عصرية فائقة النعومة (16px - rounded-2xl)',
    accentColor: '#1e40af',
    accentTouch: '#2563eb',
    headerBgColor: '#1e40af',
    headerBg: 'bg-blue-800',
    pageBg: 'bg-[#f4f6fa]',
    textColor: 'text-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-slate-100',
    cardHoverBorder: 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10',
    cardRadius: 'rounded-2xl',
    imageRadius: 'rounded-t-2xl',
    btnRadius: 'rounded-xl',
    badgeRadius: 'rounded-lg',
    titleColor: 'text-slate-900 hover:text-blue-700',
    priceColor: 'text-blue-600',
    quickBuyBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/20',
    cartBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-blue-900 via-blue-800 to-indigo-950',
    tagText: 'الأفضل طلباً',
    previewColors: ['#1e40af', '#2563eb', '#10b981', '#f4f6fa'],
    dropdownBg: 'bg-[#f8fafc]',
    dropdownBorder: 'border-blue-200 shadow-2xl shadow-blue-900/10',
    dropdownText: 'text-slate-800',
    dropdownTitleColor: 'text-blue-800',
    dropdownHeaderBorder: 'border-slate-200',
    dropdownItemHover: 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
    dropdownViewAllBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black'
  },

  // 6. POS Supermarket (Image 6 - ALI POS PRO)
  pos_supermarket: {
    id: 'pos_supermarket',
    name: '6. ستايل الكاشير ونقاط البيع السريعة',
    subtitle: 'Ali POS Pro High-Contrast (صورة 6)',
    tagline: 'مستوحى من شاشات الكاشير ونقاط البيع المزدحمة: أزرق مقتضب (#0284c7)، أخضر تأكيد البيع (#10b981)، ومربعات شبكية محكمة للسرعة',
    cornerLabel: 'مربعات مقتضبة محكمة وزوايا حادة (4px - rounded-sm)',
    accentColor: '#0284c7',
    accentTouch: '#10b981',
    headerBgColor: '#0284c7',
    headerBg: 'bg-sky-700',
    pageBg: 'bg-[#f1f5f9]',
    textColor: 'text-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-slate-50/80',
    cardBorder: 'border-slate-300',
    cardHoverBorder: 'hover:border-emerald-500 hover:shadow-sm',
    cardRadius: 'rounded-sm',
    imageRadius: 'rounded-t-sm',
    btnRadius: 'rounded-xs',
    badgeRadius: 'rounded-xs',
    titleColor: 'text-slate-900 hover:text-emerald-700',
    priceColor: 'text-emerald-600',
    quickBuyBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs',
    cartBtn: 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black border border-amber-500',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-sky-800 via-sky-700 to-slate-900',
    tagText: 'كاشير فوري',
    previewColors: ['#0284c7', '#10b981', '#f59e0b', '#0f172a'],
    dropdownBg: 'bg-slate-900',
    dropdownBorder: 'border-emerald-500/60 shadow-2xl',
    dropdownText: 'text-white',
    dropdownTitleColor: 'text-emerald-400',
    dropdownHeaderBorder: 'border-slate-800',
    dropdownItemHover: 'text-white hover:bg-slate-800 hover:text-emerald-300 hover:border-emerald-500/40',
    dropdownViewAllBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white font-black'
  },

  // 7. HR PeopleHub (Image 7 - PeopleHub)
  hr_peoplehub: {
    id: 'hr_peoplehub',
    name: '7. ستايل إدارة المواهب والتطبيقات',
    subtitle: 'PeopleHub Indigo & Lavender (صورة 7)',
    tagline: 'مستوحى من تطبيقات الموارد البشرية والواجهات الحديثة: أرجواني نيلي تقني فاخر (#6366f1)، خلفية لافندر ناعمة تريح العين، وانسيابية عالية',
    cornerLabel: 'زوايا دائرية انسيابية حديثة (18px - rounded-2xl)',
    accentColor: '#4f46e5',
    accentTouch: '#7c3aed',
    headerBgColor: '#4f46e5',
    headerBg: 'bg-indigo-600',
    pageBg: 'bg-[#f8f7ff]',
    textColor: 'text-slate-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-white',
    cardBorder: 'border-indigo-100',
    cardHoverBorder: 'hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10',
    cardRadius: 'rounded-2xl',
    imageRadius: 'rounded-t-2xl',
    btnRadius: 'rounded-xl',
    badgeRadius: 'rounded-lg',
    titleColor: 'text-slate-900 hover:text-indigo-600',
    priceColor: 'text-indigo-600',
    quickBuyBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md shadow-indigo-600/25',
    cartBtn: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold',
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-indigo-700 via-indigo-600 to-purple-950',
    tagText: 'ذكي ومميز',
    previewColors: ['#4f46e5', '#7c3aed', '#f5f3ff', '#10b981'],
    dropdownBg: 'bg-[#1e1b4b]',
    dropdownBorder: 'border-indigo-400/50 shadow-2xl shadow-purple-950/60',
    dropdownText: 'text-indigo-100',
    dropdownTitleColor: 'text-indigo-300',
    dropdownHeaderBorder: 'border-indigo-800',
    dropdownItemHover: 'text-indigo-200 hover:bg-indigo-900/60 hover:text-white hover:border-indigo-400/40',
    dropdownViewAllBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black'
  },

  // 8. Industrial BuildTrack (Image 8 - BuildTrack)
  industrial_buildtrack: {
    id: 'industrial_buildtrack',
    name: '8. ستايل المقاولات والإنشاءات الصناعي',
    subtitle: 'BuildTrack Safety Orange & Slate (صورة 8)',
    tagline: 'مستوحى من إدارة المشاريع والمقاولات: برتقالي الأمان الصناعي (#ea580c)، رمادي فحمي صلب (#1e293b)، وبطاقات صلبة واضحة المعالم',
    cornerLabel: 'زوايا هندسية قوية متينة (12px - rounded-xl)',
    accentColor: '#ea580c',
    accentTouch: '#f97316',
    headerBgColor: '#1e293b',
    headerBg: 'bg-slate-800',
    pageBg: 'bg-[#fafaf9]',
    textColor: 'text-stone-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-[#fafaf9]',
    cardBorder: 'border-stone-300',
    cardHoverBorder: 'hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/15',
    cardRadius: 'rounded-xl',
    imageRadius: 'rounded-t-xl',
    btnRadius: 'rounded-lg',
    badgeRadius: 'rounded-md',
    titleColor: 'text-stone-900 hover:text-orange-600',
    priceColor: 'text-orange-600',
    quickBuyBtn: 'bg-orange-500 hover:bg-orange-600 text-white font-black shadow-md shadow-orange-500/30',
    cartBtn: 'bg-stone-800 hover:bg-stone-700 text-white font-bold',
    badgeBg: 'bg-orange-500 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-slate-900 via-slate-800 to-orange-950',
    tagText: 'جودة صناعية',
    previewColors: ['#ea580c', '#1e293b', '#fafaf9', '#f97316'],
    dropdownBg: 'bg-[#1e293b]',
    dropdownBorder: 'border-orange-500/50 shadow-2xl',
    dropdownText: 'text-stone-100',
    dropdownTitleColor: 'text-orange-400',
    dropdownHeaderBorder: 'border-slate-700',
    dropdownItemHover: 'text-slate-200 hover:bg-slate-700 hover:text-orange-300 hover:border-orange-500/40',
    dropdownViewAllBtn: 'bg-orange-500 hover:bg-orange-600 text-white font-black'
  },

  // Heritage / Additional
  original: {
    id: 'original',
    name: 'الستايل المعتمد الأصلي',
    subtitle: 'Original Oxford & Emerald',
    tagline: 'الستايل المعتمد الأصلي: هيدر أرجواني، خلفية فضية للمنتجات، وعناوين وأسعار مميزة',
    cornerLabel: 'زوايا كلاسيكية خفيفة (4px - rounded-sm)',
    accentColor: 'oklch(54.1% 0.281 293.009)',
    accentTouch: 'oklch(0.54 0.28 290.94 / 0.85)',
    headerBgColor: 'oklch(54.1% 0.281 293.009)',
    headerBg: 'bg-[oklch(54.1%_0.281_293.009)]',
    pageBg: 'bg-stone-100',
    textColor: 'text-stone-900',
    cardBg: 'bg-stone-100',
    cardContentBg: 'bg-stone-100',
    cardBorder: 'border-stone-300',
    cardHoverBorder: 'hover:border-[oklch(54.1%_0.281_293.009)]',
    cardRadius: 'rounded-sm',
    imageRadius: 'rounded-t-sm',
    btnRadius: 'rounded-xs',
    badgeRadius: 'rounded-xs',
    titleColor: 'text-stone-900 hover:text-[oklch(54.1%_0.281_293.009)]',
    priceColor: 'text-[oklch(54.1%_0.281_293.009)]',
    quickBuyBtn: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 text-stone-950 font-black shadow-xs',
    cartBtn: 'bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white font-black shadow-xs',
    badgeBg: 'bg-[oklch(54.1%_0.281_293.009)] text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-[oklch(54.1%_0.281_293.009)] to-stone-900',
    tagText: 'سعر حصري',
    previewColors: ['#9333ea', '#f59e0b', '#e7e5e4'],
    dropdownBg: 'bg-stone-900',
    dropdownBorder: 'border-purple-500/50',
    dropdownText: 'text-white',
    dropdownTitleColor: 'text-amber-300',
    dropdownHeaderBorder: 'border-white/15',
    dropdownItemHover: 'text-white hover:bg-white/15 hover:text-amber-200 hover:border-amber-300/40',
    dropdownViewAllBtn: 'bg-amber-300 hover:bg-amber-200 text-stone-950 font-black'
  },

  minimalist: {
    id: 'minimalist',
    name: 'المودرن الفاخر والنقي',
    subtitle: 'Minimalist Premium Stone',
    tagline: 'تصميم نقي، هادئ، يبرز المنتجات بخلفيات ستون ناصعة ولمسات بنفسجية راقية',
    cornerLabel: 'زوايا مستقيمة فاخرة (2px - rounded-xs)',
    accentColor: 'oklch(54.1% 0.281 293.009)',
    accentTouch: 'oklch(0.54 0.28 290.94 / 0.85)',
    headerBgColor: '#1c1917',
    headerBg: 'bg-stone-900',
    pageBg: 'bg-stone-50',
    textColor: 'text-stone-900',
    cardBg: 'bg-stone-50',
    cardContentBg: 'bg-white',
    cardBorder: 'border-stone-200',
    cardHoverBorder: 'hover:border-[oklch(54.1%_0.281_293.009)]',
    cardRadius: 'rounded-xs',
    imageRadius: 'rounded-t-xs',
    btnRadius: 'rounded-xs',
    badgeRadius: 'rounded-xs',
    titleColor: 'text-stone-900 hover:text-[oklch(54.1%_0.281_293.009)]',
    priceColor: 'text-[oklch(54.1%_0.281_293.009)]',
    quickBuyBtn: 'bg-stone-900 hover:bg-stone-800 text-white font-black shadow-xs',
    cartBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 font-black shadow-2xs',
    badgeBg: 'bg-stone-900 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-stone-900 to-stone-800',
    tagText: 'سعر حصري',
    previewColors: ['#1c1917', '#78716c', '#f5f5f4'],
    dropdownBg: 'bg-stone-900',
    dropdownBorder: 'border-stone-700',
    dropdownText: 'text-stone-200',
    dropdownTitleColor: 'text-white',
    dropdownHeaderBorder: 'border-stone-800',
    dropdownItemHover: 'text-stone-300 hover:bg-stone-800 hover:text-white hover:border-stone-600',
    dropdownViewAllBtn: 'bg-stone-100 hover:bg-white text-stone-900 font-black'
  },

  vibrant: {
    id: 'vibrant',
    name: 'المدرسي الحيوي',
    subtitle: 'Vibrant School & Kids',
    tagline: 'ألوان مبهجة وتفاعلية تناسب العودة المدرسية، مع أزرار بارزة وحيوية',
    cornerLabel: 'زوايا دائرية مرحة (16px - rounded-2xl)',
    accentColor: 'oklch(54.1% 0.281 293.009)',
    accentTouch: 'oklch(0.54 0.28 290.94 / 0.85)',
    headerBgColor: 'oklch(54.1% 0.281 293.009)',
    headerBg: 'bg-[oklch(54.1%_0.281_293.009)]',
    pageBg: 'bg-white',
    textColor: 'text-stone-900',
    cardBg: 'bg-white',
    cardContentBg: 'bg-gradient-to-b from-stone-50 to-white',
    cardBorder: 'border-stone-200 hover:border-purple-300',
    cardHoverBorder: 'hover:border-[oklch(54.1%_0.281_293.009)]',
    cardRadius: 'rounded-2xl',
    imageRadius: 'rounded-t-2xl',
    btnRadius: 'rounded-xl',
    badgeRadius: 'rounded-lg',
    titleColor: 'text-stone-900 hover:text-[oklch(54.1%_0.281_293.009)]',
    priceColor: 'text-[oklch(54.1%_0.281_293.009)]',
    quickBuyBtn: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black shadow-xs',
    cartBtn: 'bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white font-black shadow-xs',
    badgeBg: 'bg-gradient-to-r from-[oklch(54.1%_0.281_293.009)] to-purple-800 text-white',
    badgeText: 'text-white',
    bannerGradient: 'from-[oklch(54.1%_0.281_293.009)] via-purple-700 to-stone-900',
    tagText: 'عرض خاص',
    previewColors: ['#a855f7', '#f59e0b', '#06b6d4'],
    dropdownBg: 'bg-white',
    dropdownBorder: 'border-purple-200 shadow-2xl',
    dropdownText: 'text-slate-900',
    dropdownTitleColor: 'text-purple-700',
    dropdownHeaderBorder: 'border-purple-100',
    dropdownItemHover: 'text-slate-800 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200',
    dropdownViewAllBtn: 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black'
  },

  oxford: {
    id: 'oxford',
    name: 'كلاسيك بن عمار التراثي',
    subtitle: 'Heritage Ben Ammar Stone & Gold',
    tagline: 'ستون داكن أنيق ولمسات بنفسجية وذهبية تعكس فخامة وجودة متجر بن عمار',
    cornerLabel: 'زوايا كلاسيكية مقتضبة (2px - rounded-xs)',
    accentColor: '#D4AF37',
    accentTouch: 'oklch(0.54 0.28 290.94 / 0.85)',
    headerBgColor: '#1c1917',
    headerBg: 'bg-stone-900',
    pageBg: 'bg-stone-100',
    textColor: 'text-stone-900',
    cardBg: 'bg-stone-100',
    cardContentBg: 'bg-stone-100',
    cardBorder: 'border-stone-300',
    cardHoverBorder: 'hover:border-amber-500',
    cardRadius: 'rounded-xs',
    imageRadius: 'rounded-t-xs',
    btnRadius: 'rounded-xs',
    badgeRadius: 'rounded-xs',
    titleColor: 'text-stone-900 hover:text-[oklch(54.1%_0.281_293.009)]',
    priceColor: 'text-[oklch(54.1%_0.281_293.009)]',
    quickBuyBtn: 'bg-stone-900 hover:bg-stone-800 text-[#D4AF37] font-black border border-[#D4AF37]/50 shadow-xs',
    cartBtn: 'bg-[#D4AF37] hover:bg-[#c29f2f] text-stone-950 font-black shadow-xs',
    badgeBg: 'bg-gradient-to-r from-stone-900 to-stone-800 text-[#D4AF37] border border-[#D4AF37]/40',
    badgeText: 'text-[#D4AF37]',
    bannerGradient: 'from-stone-900 via-stone-800 to-stone-900',
    tagText: 'بن عمار',
    previewColors: ['#1c1917', '#D4AF37', '#e7e5e4'],
    dropdownBg: 'bg-stone-900',
    dropdownBorder: 'border-amber-500/50',
    dropdownText: 'text-amber-50',
    dropdownTitleColor: 'text-amber-400',
    dropdownHeaderBorder: 'border-stone-700',
    dropdownItemHover: 'text-amber-100 hover:bg-stone-800 hover:text-amber-300 hover:border-amber-500/40',
    dropdownViewAllBtn: 'bg-[#D4AF37] hover:bg-[#c29f2f] text-stone-950 font-black'
  }
};

interface ThemeContextType {
  currentStyle: StoreStyle;
  setStyle: (style: StoreStyle) => void;
  config: StyleConfig;
  isStyleModalOpen: boolean;
  setIsStyleModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentStyle, setCurrentStyle] = useState<StoreStyle>(() => {
    try {
      const saved = localStorage.getItem('ben_ammar_store_style') || localStorage.getItem('oxford_store_style');
      if (saved && (saved in STORE_STYLES)) {
        return saved as StoreStyle;
      }
    } catch {
      // Ignore
    }
    return 'oxfordcity';
  });

  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  const setStyle = (style: StoreStyle) => {
    setCurrentStyle(style);
    try {
      localStorage.setItem('ben_ammar_store_style', style);
      localStorage.setItem('oxford_store_style', style);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-store-style', currentStyle);
  }, [currentStyle]);

  const config = STORE_STYLES[currentStyle] || STORE_STYLES.oxfordcity;

  return (
    <ThemeContext.Provider
      value={{
        currentStyle,
        setStyle,
        config,
        isStyleModalOpen,
        setIsStyleModalOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useStoreTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useStoreTheme must be used within ThemeProvider');
  }
  return context;
}
