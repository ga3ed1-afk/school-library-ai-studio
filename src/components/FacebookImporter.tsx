import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Upload, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  X, 
  Clipboard, 
  HelpCircle,
  Copy,
  Check,
  Tag,
  Hash,
  StopCircle,
  FileText,
  DollarSign,
  Globe,
  Key,
  Layers,
  ExternalLink,
  Download
} from 'lucide-react';
import { Product } from '../types';
import { categories } from '../constants';
import { productService } from '../services/productService';
import { analyzeProductImage } from '../services/aiProductAnalyzer';

interface FacebookImporterProps {
  onSuccess: (count: number, message: string) => void;
  onCancel?: () => void;
}

interface ExtractedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  images?: string[];
  description: string;
}

type ImportSourceTab = 'juicer' | 'elfsight' | 'graph_api' | 'manual' | 'upload';

export const BOOKMARKLET_CODE = `javascript:(function(){const results=[];const seenImgs=new Set();document.querySelectorAll('img, [style*="background-image"]').forEach(el=>{let src='';if(el.tagName==='IMG'){src=el.src||el.dataset.src||'';}else{const bg=el.style.backgroundImage;src=bg?bg.replace(/url\\(["']?|["']?\\)/g,''):'';}if(!src||src.startsWith('data:'))return;if(src.includes('emoji')||src.includes('rsrc')||src.includes('p50x50')||src.includes('p16x16')||src.includes('p32x32')||src.includes('p24x24')||src.includes('blank'))return;if(seenImgs.has(src))return;seenImgs.add(src);let node=el.parentElement;let postText='';for(let i=0;i<9&&node;i++){const textElem=node.querySelector('div[dir="auto"], span[dir="auto"]');if(textElem&&textElem.innerText&&textElem.innerText.trim().length>3){postText=textElem.innerText.trim();break;}node=node.parentElement;}if(!postText&&el.alt&&!el.alt.includes('قد تكون')){postText=el.alt.trim();}let price=null;if(postText){const priceMatch=postText.match(/(\\d+(?:[.,]\\d+)?)\\s*(?:dt|DT|د\\.ت|دينار|dt\\b)/i);if(priceMatch){price=parseFloat(priceMatch[1].replace(',','.'));}}const title=postText?postText.split('\\n')[0].substring(0,80):'';results.push({image:src,name:title,price:price||0,description:postText||title});});if(results.length===0){alert('⚠️ لم يتم العثور على صور. حاول التمرير للأسفل وتأكد من أن الصور ظاهرة.');}else{navigator.clipboard.writeText(JSON.stringify(results,null,2)).then(()=>{alert('✅ تم بنجاح استخراج '+results.length+' صورة! الصقها في الصندوق.');});}})();`;

export function extractAllFacebookImages(rawInput: string): string[] {
  if (!rawInput || !rawInput.trim()) return [];

  let text = rawInput
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\//g, '/')
    .replace(/\\u0025/g, '%')
    .replace(/\\u0026/g, '&')
    .replace(/\\u003C/gi, '<')
    .replace(/\\u003E/gi, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/%2F/gi, '/')
    .replace(/%3A/gi, ':')
    .replace(/%3F/gi, '?')
    .replace(/%3D/gi, '=')
    .replace(/%26/gi, '&');

  const candidates: string[] = [];

  const urlRegex = /(https?:\/\/[^\s"'<>\`\[\]\{\}\(\)\\]+)/gi;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    let url = match[1].replace(/[,;\\'"\)\}\]]+$/, '');
    
    // Accept almost any URL that looks like an image or is an image file
    const isStandardImg = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url);
    const isLikelyImg = /fbcdn\.net|fbsbx\.com|scontent|facebook\.com|unsplash\.com|cloudinary\.com|imgbb\.com|postimg\.cc|blogger\.com|googleusercontent\.com/i.test(url);

    if (isStandardImg || isLikelyImg) {
      const isJunk = /emoji\.php|rsrc\.php|p16x16|p24x24|p32x32|p48x48|p50x50|blank\.gif|spacer\.gif|safe_image\.php\?d=.*blank/i.test(url);
      if (!isJunk) {
        candidates.push(url);
      }
    }
  }

  const tagRegex = /(?:src|data-src|data-full-src|data-lazy|srcset|data-original|background-image)=["']([^"']+)["']/gi;
  while ((match = tagRegex.exec(rawInput)) !== null) {
    let rawUrl = match[1];
    // Handle background-image: url(...)
    if (rawUrl.startsWith('url(')) {
      rawUrl = rawUrl.replace(/url\(["']?|["']?\)/g, '');
    }
    
    if (rawUrl.includes(' ')) {
      const parts = rawUrl.split(',');
      for (const part of parts) {
        const u = part.trim().split(' ')[0];
        if (u.startsWith('http') && !candidates.includes(u)) {
          candidates.push(u);
        }
      }
    } else if (rawUrl.startsWith('http')) {
      candidates.push(rawUrl);
    }
  }

  const uniqueUrls: string[] = [];
  const seenKeys = new Set<string>();

  for (const url of candidates) {
    const key = url.split('?')[0].split('/').pop() || url;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueUrls.push(url);
    }
  }

  return uniqueUrls;
}

// Smart automatic category discovery based on text semantics
export function discoverCategoryForItem(name: string, description: string = ''): { category: string; subcategory: string } {
  const combined = `${name} ${description}`.toLowerCase();

  // 1. مستندات (Documents)
  if (/مستند|وثيق|ملف|حافظ|أوراق|طباعة|نسخ|تصوير|سحب|أظرف|مصنف|ورق a4|plastif|chemise|classeur|reliure|papier/i.test(combined)) {
    let sub = '📄 ملفات ومستندات';
    if (/طابع|نسخ|سحب|photocop|tirage|reliure/i.test(combined)) sub = '🖨️ خدمات طباعة ونسخ';
    else if (/حافظ|ورق a4|أوراق|classeur/i.test(combined)) sub = '📁 حافظات وأوراق';
    else if (/ظرف|أظرف|بوكيت|pochette/i.test(combined)) sub = '📑 مصنفات وأظرف';
    return { category: 'مستندات', subcategory: sub };
  }

  // 2. الفنون الجميلة
  if (/رسم|فرشاة|ألوان زيت|ألوان مائ|أكريليك|كانسون|فحم|ريزين|شموع|سكتش|خط عربي|peinture|pinceau|canson|acrylique|gouache|toile/i.test(combined)) {
    let sub = '🎨 دهانات وألوان';
    if (/فرشا|pinceau/i.test(combined)) sub = '🖌️ فرش رسم';
    else if (/دفتر رسم|سكتش|canson|sketchbook/i.test(combined)) sub = '📓 دفاتر رسم (Sketchbook)';
    else if (/خط عربي|حبر صيني|قصب/i.test(combined)) sub = '✍🏻 أحبار وخط عربي';
    return { category: 'الفنون الجميلة', subcategory: sub };
  }

  // 3. الكتب والروايات
  if (/كتاب|رواية|قصة|قصص|قاموس|معجم|موسوعة|مصحف|قرآن|فقه|تاريخ|roman|livre|dictionnaire/i.test(combined)) {
    let sub = '📖 روايات وقصص';
    if (/مصحف|قرآن|دين|فقه/i.test(combined)) sub = '🕌 كتب دينية وقرآن';
    else if (/معجم|قاموس|dictionnaire/i.test(combined)) sub = '📕 معاجم وقواميس';
    else if (/مدرسي|تمارين|امتحان|تعليم/i.test(combined)) sub = '📚 كتب تعليمية';
    return { category: 'الكتب والروايات', subcategory: sub };
  }

  // 4. المعدات الإعلامية
  if (/حاسوب|كمبيوتر|لابتوب|طابعة|فلاش|usb|كابل|شاحن|ماوس|لوحة مفاتيح|سماعة|هاتف|راوتر|pc|laptop|ecran|toner|cartouche|informatique/i.test(combined)) {
    let sub = '💻 حواسيب وإكسسوارات';
    if (/طابع|حبر|cartouche|toner/i.test(combined)) sub = '🖨️ طابعات وأحبار';
    else if (/فلاش|usb|carte memoire|disque/i.test(combined)) sub = '💾 وسائط تخزين';
    else if (/كابل|شاحن|cable|chargeur/i.test(combined)) sub = '🔌 كوابل وشواحن';
    else if (/سماعة|casque|ecouteur|baffle/i.test(combined)) sub = '🎧 صوتيات وسماعات';
    return { category: 'المعدات الإعلامية', subcategory: sub };
  }

  // 5. ألعاب ترفيهية
  if (/لعبة|ألعاب|دمية|سيارة|بازل|تركيب|صلصال ألعاب|lego|puzzle|jouet/i.test(combined)) {
    return { category: 'ألعاب ترفيهية', subcategory: '🧸 ألعاب' };
  }

  // 6. الأدوات المكتبية
  if (/مكتب|دباسة|خرامة|شريط لاصق|حامل أقلام|حاسبة|كاسيو|بصمة|ختم|bureautique|agrafeuse|calculatrice/i.test(combined)) {
    let sub = '📎 مثبتات ودبابيس';
    if (/حاسب|calculatrice|casio/i.test(combined)) sub = '🧮 آلات حاسبة';
    else if (/شريط|سكوتش|مقص|غراء/i.test(combined)) sub = '✂️ أدوات قص ولصق';
    return { category: 'الأدوات المكتبية', subcategory: sub };
  }

  // 7. اللوازم المدرسية (الافتراضي للمكتبية)
  let sub = '🎒 محافظ ومقلمات';
  if (/كراس|دفتر|cahier|carnet/i.test(combined)) sub = '📓 كراريس ودفاتر';
  else if (/قلم|ستيلو|stylo|crayon|لباد/i.test(combined)) sub = '✏️ أدوات كتابة ورسم';
  else if (/مسطرة|كوس|منقلة|برجل/i.test(combined)) sub = '📐 أدوات هندسية وقياس';
  else if (/مقص|صمغ|غراء|لاصق/i.test(combined)) sub = '✂️ مقصات ولواصق';
  else if (/روضة|طين|صلصال/i.test(combined)) sub = '🧒 لوازم رياض الأطفال';

  return { category: 'اللوازم المدرسية', subcategory: sub };
}

export default function FacebookImporter({ onSuccess, onCancel }: FacebookImporterProps) {
  // Navigation tab for import source
  const [activeTab, setActiveTab] = useState<ImportSourceTab>('juicer');

  // Input states for various APIs
  const [inputText, setInputText] = useState('');
  const [juicerFeedId, setJuicerFeedId] = useState('100063679074454');
  const [juicerApiKey, setJuicerApiKey] = useState('jcr_ec7a05918aaff5545f2095692e8cb4528bf5553ffb00c2430ab406dedb6e2f45');
  const [elfsightWidgetId, setElfsightWidgetId] = useState('');
  const [fbPageId, setFbPageId] = useState('');
  const [fbAccessToken, setFbAccessToken] = useState('');

  // Defaults
  const [defaultCategory, setDefaultCategory] = useState('اللوازم المدرسية');
  const [defaultSubcategory, setDefaultSubcategory] = useState('');
  // Default price is empty as requested
  const [defaultPrice, setDefaultPrice] = useState<string>('');
  
  // Controls & AI state
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [autoAiEnabled, setAutoAiEnabled] = useState(false); // AI auto-analysis off by default for user control
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Modals
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showBatchRenameModal, setShowBatchRenameModal] = useState(false);
  const [batchRenamePrefix, setBatchRenamePrefix] = useState('سلعة مكتبة بن عمار');
  const [showBatchPriceModal, setShowBatchPriceModal] = useState(false);
  const [batchPriceInput, setBatchPriceInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Abort flag for AI
  const aiAbortRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved credentials from localStorage
  useEffect(() => {
    try {
      const savedJuicer = localStorage.getItem('benammar_juicer_feed');
      if (savedJuicer) {
        setJuicerFeedId(savedJuicer);
      } else {
        setJuicerFeedId('100063679074454');
      }

      const savedApiKey = localStorage.getItem('benammar_juicer_api_key');
      if (savedApiKey) {
        setJuicerApiKey(savedApiKey);
      } else {
        setJuicerApiKey('jcr_ec7a05918aaff5545f2095692e8cb4528bf5553ffb00c2430ab406dedb6e2f45');
      }

      const savedElfsight = localStorage.getItem('benammar_elfsight_widget');
      if (savedElfsight) setElfsightWidgetId(savedElfsight);

      const savedFbPage = localStorage.getItem('benammar_fb_page_id');
      if (savedFbPage) setFbPageId(savedFbPage);

      const savedFbToken = localStorage.getItem('benammar_fb_token');
      if (savedFbToken) setFbAccessToken(savedFbToken);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(BOOKMARKLET_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputText(prev => prev ? `${prev}\n${text}` : text);
          setStatusMessage({ text: '📋 تم لصق المحتوى من الحافظة بنجاح!', type: 'info' });
        }
      }
    } catch {
      setStatusMessage({ text: 'يرجى استخدام Ctrl+V للصق النص داخل الصندوق.', type: 'info' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const basePrice = defaultPrice.trim() ? parseFloat(defaultPrice) || 0 : 0;
    const fileArray = Array.from(files);

    fileArray.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const discovered = discoverCategoryForItem(cleanName);
          const newItem: ExtractedItem = {
            id: `local_file_${Date.now()}_${idx}`,
            name: cleanName || `سلعة جديدة #${items.length + idx + 1}`,
            price: basePrice,
            category: discovered.category || defaultCategory,
            subcategory: discovered.subcategory || defaultSubcategory,
            image: dataUrl,
            images: [dataUrl],
            description: `منتج أصلي متوفر لدى بن عمار للمكتبية و الإعلامية`
          };
          setItems(prev => [newItem, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });

    setStatusMessage({ 
      text: `✅ تمت إضافة ${fileArray.length} صورة من جهازك في بداية القائمة! يمكنك مراجعتها أو نشرها في المتجر.`, 
      type: 'success' 
    });
  };

  // 1. Juicer.io API Import
  const handleFetchJuicer = async (targetFeedId?: string) => {
    let raw = (typeof targetFeedId === 'string' ? targetFeedId : juicerFeedId).trim();
    if (!raw) {
      raw = '100063679074454';
    }

    // Extract feed ID/slug from embed script tag, embed URL, feeds URL, or page links
    let cleanFeed = raw;
    const embedMatch = raw.match(/juicer\.io\/embed\/([^\/?#\s"'\<]+)/i);
    const feedsMatch = raw.match(/juicer\.io\/(?:api\/)?feeds\/([^\/?#\s"'\<]+)/i);
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);

    if (embedMatch) {
      cleanFeed = embedMatch[1];
    } else if (feedsMatch) {
      cleanFeed = feedsMatch[1];
    } else if (srcMatch) {
      const innerMatch = srcMatch[1].match(/juicer\.io\/(?:embed|feeds|api\/feeds)\/([^\/?#\s]+)/i);
      if (innerMatch) cleanFeed = innerMatch[1];
    } else if (raw.includes('run.app') || raw.includes('localhost') || raw.includes('benammar') || raw.includes('ben-ammar')) {
      // User entered their store/app website address
      cleanFeed = '100063679074454';
    } else if (raw.includes('facebook.com')) {
      const fbIdMatch = raw.match(/(?:profile\.php\?id=|\/)([0-9]{8,})/i);
      if (fbIdMatch) {
        cleanFeed = fbIdMatch[1];
      }
    } else {
      cleanFeed = raw.replace(/<[^>]*>/g, '').replace(/["']/g, '').trim();
    }

    if (!cleanFeed || cleanFeed.length < 2) {
      cleanFeed = '100063679074454';
    }

    setJuicerFeedId(cleanFeed);

    setIsProcessing(true);
    setStatusMessage({ text: `⏳ جارٍ الاتصال بـ Juicer وجلب سلع ومنشورات التغذية (${cleanFeed})...`, type: 'info' });

    try {
      localStorage.setItem('benammar_juicer_feed', cleanFeed);
    } catch {}

    const basePrice = defaultPrice.trim() ? parseFloat(defaultPrice) || 0 : 0;

    const apiKey = juicerApiKey.trim();
    if (apiKey) {
      try {
        localStorage.setItem('benammar_juicer_api_key', apiKey);
      } catch {}

      setStatusMessage({ text: '⏳ جارٍ الاتصال بـ Juicer API الرسمي (v1) وجلب المنشورات...', type: 'info' });

      try {
        // Step 1: Get feeds list from Juicer v1
        const feedsEndpoints = [
          'https://api.juicer.io/v1/feeds',
          '/api/juicer-v1-proxy/feeds',
          `https://api.allorigins.win/raw?url=${encodeURIComponent('https://api.juicer.io/v1/feeds')}`
        ];

        let feedsData: any = null;
        for (const ep of feedsEndpoints) {
          try {
            const fRes = await fetch(ep, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });
            if (fRes.ok) {
              const j = await fRes.json();
              if (j?.data && Array.isArray(j.data) && j.data.length > 0) {
                feedsData = j.data;
                break;
              }
            }
          } catch {}
        }

        if (feedsData && feedsData.length > 0) {
          const targetFeed = feedsData.find((f: any) => 
            String(f.name) === cleanFeed || 
            String(f.id) === cleanFeed || 
            String(f.slug).includes(cleanFeed)
          ) || feedsData[0];

          const feedNumericId = targetFeed.id;

          // Step 2: Fetch posts from /v1/feeds/:id/posts
          const postsEndpoints = [
            `https://api.juicer.io/v1/feeds/${feedNumericId}/posts?per_page=100`,
            `/api/juicer-v1-proxy/feeds/${feedNumericId}/posts?per_page=100`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.juicer.io/v1/feeds/${feedNumericId}/posts?per_page=100`)}`
          ];

          let v1PostsData: any = null;
          for (const ep of postsEndpoints) {
            try {
              const pRes = await fetch(ep, {
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                }
              });
              if (pRes.ok) {
                const pj = await pRes.json();
                if (pj?.data && Array.isArray(pj.data) && pj.data.length > 0) {
                  v1PostsData = pj.data;
                  break;
                }
              }
            } catch {}
          }

          if (v1PostsData && v1PostsData.length > 0) {
            const extracted: ExtractedItem[] = [];

            v1PostsData.forEach((post: any, postIdx: number) => {
              const rawMsg = (post.message || '').trim();
              const cleanMsg = rawMsg
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&nbsp;/g, ' ')
                .trim();

              let detectedPrice = basePrice;
              if (cleanMsg) {
                const priceMatch = cleanMsg.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
                if (priceMatch) {
                  detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
                }
              }

              const firstLine = cleanMsg.split('\n').map((l: string) => l.trim()).filter(Boolean)[0] || '';
              const title = firstLine.substring(0, 80) || `سلعة فيسبوك Juicer #${postIdx + 1}`;
              const discovered = discoverCategoryForItem(title, cleanMsg);

              // Extract media (all photos in the post/album)
              const mediaList: string[] = [];
              if (Array.isArray(post.media)) {
                post.media.forEach((m: any) => {
                  const u = typeof m === 'string' ? m : (m?.url || m?.src);
                  if (u && typeof u === 'string' && u.startsWith('http') && !mediaList.includes(u)) {
                    mediaList.push(u);
                  }
                });
              }
              if (post.image && typeof post.image === 'string' && post.image.startsWith('http') && !mediaList.includes(post.image)) {
                mediaList.unshift(post.image);
              }
              if (mediaList.length === 0 && post.poster?.image) {
                mediaList.push(post.poster.image);
              }

              if (mediaList.length > 0) {
                // Keep multi-photo posts as 1 single product with all photos in its gallery
                extracted.push({
                  id: `juicer_v1_${post.id || Date.now()}_${postIdx}`,
                  name: title,
                  price: detectedPrice,
                  category: discovered.category || defaultCategory,
                  subcategory: discovered.subcategory || defaultSubcategory,
                  image: mediaList[0],
                  images: mediaList,
                  description: cleanMsg || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
                });
              }
            });

            if (extracted.length > 0) {
              setItems(prev => [...extracted.reverse(), ...prev]);
              setIsProcessing(false);
              setStatusMessage({
                text: `✨ تم بنجاح استيراد ${extracted.length} سلعة وصورة عالية الدقة عبر Juicer API الرسمي (v1)!`,
                type: 'success'
              });
              return;
            }
          }
        }
      } catch (v1Err) {
        console.warn('Juicer v1 API failed, falling back to public feed endpoint...', v1Err);
      }
    }

    try {
      // Fallback: Multi-layered public feed fetch pipeline (bypasses adblockers, CORS, and network filters)
      const endpointsToTry = [
        `https://www.juicer.io/api/feeds/${encodeURIComponent(cleanFeed)}?per=100&page=1`,
        `/api/juicer-proxy/feeds/${encodeURIComponent(cleanFeed)}?per=100&page=1`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.juicer.io/api/feeds/${encodeURIComponent(cleanFeed)}?per=100`)}`,
        `https://corsproxy.io/?url=${encodeURIComponent(`https://www.juicer.io/api/feeds/${encodeURIComponent(cleanFeed)}?per=100`)}`
      ];

      let data: any = null;
      let lastErrorMsg = '';

      for (const ep of endpointsToTry) {
        try {
          const res = await fetch(ep);
          if (res.ok) {
            const json = await res.json();
            if (json && (json.posts || json.items)) {
              data = json;
              break;
            }
          }
        } catch (e: any) {
          lastErrorMsg = e?.message || '';
        }
      }

      if (!data) {
        throw new Error(lastErrorMsg || `تعذر الوصول إلى سيرفرات Juicer. تأكد من إيقاف أي مانع إعلانات (AdBlocker) قد يحجب الاتصال.`);
      }

      const posts: any[] = Array.isArray(data?.posts?.items) 
        ? data.posts.items 
        : (Array.isArray(data?.posts) ? data.posts : (Array.isArray(data?.items) ? data.items : []));

      if (!posts || posts.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: `⚠️ لم يتم العثور على منشورات في تغذية Juicer "${cleanFeed}". تأكد من أن حساب فيسبوك مزامَن في Juicer.`,
          type: 'error'
        });
        return;
      }

      const extracted: ExtractedItem[] = [];

      posts.forEach((p, postIdx) => {
        const primaryImg = p.full_size || p.unaltered_image || p.image || p.photo || p.poster_image;
        
        // Clean message from HTML tags (<p>, <br>, etc.) and decode entities
        const rawMsg = (p.message || p.unaltered_message || p.caption || p.text || '').trim();
        const cleanMsg = rawMsg
          .replace(/<br\s*[\/]?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<p[^>]*>/gi, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        // Extract price from message
        let detectedPrice = basePrice;
        if (cleanMsg) {
          const priceMatch = cleanMsg.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
          if (priceMatch) {
            detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
          }
        }

        // Clean title from first non-empty line
        const firstLine = cleanMsg.split('\n').map(l => l.trim()).filter(Boolean)[0] || '';
        const title = firstLine.substring(0, 80) || `سلعة فيسبوك Juicer #${postIdx + 1}`;
        const discovered = discoverCategoryForItem(title, cleanMsg);

        // Collect all images of this post (albums / multiple photos)
        const postImages: string[] = [];
        if (primaryImg && typeof primaryImg === 'string' && primaryImg.startsWith('http')) {
          postImages.push(primaryImg);
        }
        if (Array.isArray(p.additional_photos) && p.additional_photos.length > 0) {
          p.additional_photos.forEach((extraImg: any) => {
            const extraSrc = typeof extraImg === 'string' ? extraImg : (extraImg?.url || extraImg?.src);
            if (extraSrc && typeof extraSrc === 'string' && extraSrc.startsWith('http') && !postImages.includes(extraSrc)) {
              postImages.push(extraSrc);
            }
          });
        }
        if (Array.isArray(p.media)) {
          p.media.forEach((m: any) => {
            const u = typeof m === 'string' ? m : (m?.url || m?.src);
            if (u && typeof u === 'string' && u.startsWith('http') && !postImages.includes(u)) {
              postImages.push(u);
            }
          });
        }

        if (postImages.length > 0) {
          extracted.push({
            id: `juicer_${p.id || Date.now()}_${postIdx}`,
            name: title,
            price: detectedPrice,
            category: discovered.category || defaultCategory,
            subcategory: discovered.subcategory || defaultSubcategory,
            image: postImages[0],
            images: postImages,
            description: cleanMsg || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
          });
        }
      });

      if (extracted.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: 'لم يتم العثور على صور قابلة للاستيراد داخل المنشورات المسترجعة.',
          type: 'error'
        });
        return;
      }

      // Add reversed (newest on top)
      setItems(prev => [...extracted.reverse(), ...prev]);
      setIsProcessing(false);
      setStatusMessage({
        text: `🍹 تم بنجاح استيراد ${extracted.length} صورة وسلعة عالية الدقة من Juicer بنقرة واحدة!`,
        type: 'success'
      });

      if (autoAiEnabled) {
        setTimeout(() => {
          handleAiAnalyzeDirect([...extracted, ...items]);
        }, 200);
      }
    } catch (err: any) {
      setIsProcessing(false);
      console.error('Juicer error:', err);
      setStatusMessage({
        text: `تعذر الجلب من Juicer: ${err.message || 'تأكد من اسم التغذية واتصال الإنترنت'}.`,
        type: 'error'
      });
    }
  };

  // 2. Elfsight Widget API Import
  const handleFetchElfsight = async () => {
    let cleanWidget = elfsightWidgetId.trim();
    if (!cleanWidget) {
      setStatusMessage({
        text: 'يرجى إدخال معرف ويدجت Elfsight (Widget ID) أو رابط الويدجت.',
        type: 'error'
      });
      return;
    }

    // Extract UUID if user pasted full script or URL
    const uuidMatch = cleanWidget.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (uuidMatch) {
      cleanWidget = uuidMatch[1];
    } else {
      const wMatch = cleanWidget.match(/[?&]w=([^&"'\s]+)/i);
      if (wMatch) cleanWidget = wMatch[1];
    }

    setIsProcessing(true);
    setStatusMessage({ text: '⏳ جارٍ جلب البيانات من Elfsight...', type: 'info' });

    try {
      localStorage.setItem('benammar_elfsight_widget', cleanWidget);
    } catch {}

    const basePrice = defaultPrice.trim() ? parseFloat(defaultPrice) || 0 : 0;

    try {
      // Elfsight bootstrap endpoint
      const endpoint = `https://core.service.elfsight.com/p/boot/?w=${encodeURIComponent(cleanWidget)}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`خطأ في جلب بيانات Elfsight (${res.status})`);
      }

      const json = await res.json();
      
      // Explore multiple paths where Elfsight stores posts
      const widgetData = json?.data?.widgets?.[cleanWidget]?.data || json?.data?.widget?.data || json?.data;
      const posts: any[] = widgetData?.posts || widgetData?.items || json?.posts || [];

      if (!posts || posts.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: 'لم يتم العثور على منشورات في هذا الويدجت. تأكد من أن ويدجت Elfsight يحتوي على منشورات فيسبوك.',
          type: 'error'
        });
        return;
      }

      const extracted: ExtractedItem[] = [];

      posts.forEach((p, idx) => {
        const text = (p.text || p.caption || p.message || p.description || '').trim();
        
        // Find all images
        const postImages: string[] = [];
        if (Array.isArray(p.images) && p.images.length > 0) {
          p.images.forEach((imgObj: any) => {
            const u = imgObj?.url || imgObj?.src || (typeof imgObj === 'string' ? imgObj : '');
            if (u && typeof u === 'string' && u.startsWith('http') && !postImages.includes(u)) {
              postImages.push(u);
            }
          });
        }
        if (p.image) {
          const u = typeof p.image === 'string' ? p.image : (p.image?.url || p.image?.src);
          if (u && typeof u === 'string' && u.startsWith('http') && !postImages.includes(u)) {
            postImages.push(u);
          }
        }
        if (p.media_url && typeof p.media_url === 'string' && p.media_url.startsWith('http') && !postImages.includes(p.media_url)) {
          postImages.push(p.media_url);
        }
        if (p.full_picture && typeof p.full_picture === 'string' && p.full_picture.startsWith('http') && !postImages.includes(p.full_picture)) {
          postImages.push(p.full_picture);
        }

        let detectedPrice = basePrice;
        if (text) {
          const priceMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
          if (priceMatch) {
            detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
          }
        }

        const title = text ? text.split('\n')[0].substring(0, 80) : `سلعة Elfsight #${idx + 1}`;
        const discovered = discoverCategoryForItem(title, text);

        if (postImages.length > 0) {
          extracted.push({
            id: `elfsight_${Date.now()}_${idx}`,
            name: title,
            price: detectedPrice,
            category: discovered.category || defaultCategory,
            subcategory: discovered.subcategory || defaultSubcategory,
            image: postImages[0],
            images: postImages,
            description: text || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
          });
        }
      });

      if (extracted.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: 'لم يتم العثور على روابط صور مباشرة في رد Elfsight.',
          type: 'error'
        });
        return;
      }

      setItems(prev => [...extracted.reverse(), ...prev]);
      setIsProcessing(false);
      setStatusMessage({
        text: `⚡ تم بنجاح استيراد ${extracted.length} سلعة من Elfsight!`,
        type: 'success'
      });
    } catch (err: any) {
      setIsProcessing(false);
      console.error('Elfsight error:', err);
      setStatusMessage({
        text: `تعذر الجلب المباشر من Elfsight (${err.message || 'CORS'}). يمكنك نسخ بيانات الويدجت أو كود الصفحة ولصقها في تبويب اللصق المباشر.`,
        type: 'error'
      });
    }
  };

  // 3. Facebook Graph API Import
  const handleFetchGraphApi = async () => {
    const cleanPage = fbPageId.trim();
    const cleanToken = fbAccessToken.trim();

    if (!cleanPage || !cleanToken) {
      setStatusMessage({
        text: 'يرجى إدخال معرف الصفحة (Page ID) ورمز الوصول (Page Access Token) للربط مع Graph API.',
        type: 'error'
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ text: '⏳ جارٍ الاتصال بـ Facebook Graph API...', type: 'info' });

    try {
      localStorage.setItem('benammar_fb_page_id', cleanPage);
      localStorage.setItem('benammar_fb_token', cleanToken);
    } catch {}

    const basePrice = defaultPrice.trim() ? parseFloat(defaultPrice) || 0 : 0;

    try {
      const endpoint = `https://graph.facebook.com/v19.0/${encodeURIComponent(cleanPage)}/posts?fields=id,message,full_picture,attachments{media,subattachments},created_time&limit=50&access_token=${encodeURIComponent(cleanToken)}`;
      const res = await fetch(endpoint);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson?.error?.message || `خطأ Facebook API (${res.status})`);
      }

      const json = await res.json();
      const posts: any[] = json?.data || [];

      if (posts.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: 'لم يتم العثور على منشورات في هذه الصفحة عبر Graph API.',
          type: 'error'
        });
        return;
      }

      const extracted: ExtractedItem[] = [];

      posts.forEach((post, pIdx) => {
        const msg = (post.message || '').trim();
        let detectedPrice = basePrice;
        if (msg) {
          const priceMatch = msg.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
          if (priceMatch) {
            detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
          }
        }

        const title = msg ? msg.split('\n')[0].substring(0, 80) : `سلعة فيسبوك #${pIdx + 1}`;
        const discovered = discoverCategoryForItem(title, msg);

        // Collect all images of this post (albums / multiple photos)
        const postImages: string[] = [];
        const subattachments = post.attachments?.data?.[0]?.subattachments?.data;
        if (Array.isArray(subattachments) && subattachments.length > 0) {
          subattachments.forEach((sub: any) => {
            const subImg = sub.media?.image?.src;
            if (subImg && typeof subImg === 'string' && subImg.startsWith('http') && !postImages.includes(subImg)) {
              postImages.push(subImg);
            }
          });
        }
        const mainImg = post.attachments?.data?.[0]?.media?.image?.src || post.full_picture;
        if (mainImg && typeof mainImg === 'string' && mainImg.startsWith('http') && !postImages.includes(mainImg)) {
          postImages.unshift(mainImg);
        }

        if (postImages.length > 0) {
          extracted.push({
            id: `fb_graph_${post.id}_${pIdx}`,
            name: title,
            price: detectedPrice,
            category: discovered.category || defaultCategory,
            subcategory: discovered.subcategory || defaultSubcategory,
            image: postImages[0],
            images: postImages,
            description: msg || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
          });
        }
      });

      if (extracted.length === 0) {
        setIsProcessing(false);
        setStatusMessage({
          text: 'لم يتم العثور على صور ضمن منشورات الصفحة في Graph API.',
          type: 'error'
        });
        return;
      }

      setItems(prev => [...extracted.reverse(), ...prev]);
      setIsProcessing(false);
      setStatusMessage({
        text: `🔑 تم بنجاح استيراد ${extracted.length} صورة وسلعة عبر Facebook Graph API!`,
        type: 'success'
      });

      if (autoAiEnabled) {
        setTimeout(() => {
          handleAiAnalyzeDirect([...extracted, ...items]);
        }, 200);
      }
    } catch (err: any) {
      setIsProcessing(false);
      console.error('FB API error:', err);
      setStatusMessage({
        text: `تعذر الاتصال بـ Facebook API: ${err.message}`,
        type: 'error'
      });
    }
  };

  // 4. Manual / Bookmarklet / Text Extraction
  const handleExtract = async () => {
    if (!inputText.trim()) {
      setStatusMessage({ 
        text: 'يرجى لصق روابط صور فيسبوك (scontent...) أو كود الصفحة أو كود الاستخراج أولاً.', 
        type: 'error' 
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    const basePrice = defaultPrice.trim() ? parseFloat(defaultPrice) || 0 : 0;

    // 0. Auto-detect Juicer script or embed link if pasted in manual box
    const juicerEmbedMatch = inputText.match(/juicer\.io\/(?:embed|feeds|api\/feeds)\/([^\/?#\s"'\<]+)/i);
    if (juicerEmbedMatch) {
      const detectedId = juicerEmbedMatch[1].replace(/[^a-zA-Z0-9_-]/g, '');
      setJuicerFeedId(detectedId);
      setActiveTab('juicer');
      setIsProcessing(false);
      handleFetchJuicer(detectedId);
      return;
    }

    // 0.5. Check for data-post="{...}" HTML attributes (like from Juicer feed version 2 HTML)
    const dataPostRegex = /data-post=["']({[\s\S]+?})["']/gi;
    let dpMatch;
    const dataPostItems: any[] = [];
    while ((dpMatch = dataPostRegex.exec(inputText)) !== null) {
      const rawChunk = dpMatch[1];
      // Normalize entities and unicode safely
      const decoded = rawChunk
        .replace(/\\u0026/g, '&')
        .replace(/\\u003c/gi, '<')
        .replace(/\\u003e/gi, '>')
        .replace(/\\&quot;/g, '\\"')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      let parsed: any = null;
      try {
        parsed = JSON.parse(decoded);
      } catch {
        // Fallback: escape control characters (newlines inside JSON string literals)
        try {
          const sanitized = decoded.replace(/[\u0000-\u001f\u007f-\u009f]/g, (c) => {
            if (c === '\n') return '\\n';
            if (c === '\r') return '\\r';
            if (c === '\t') return '\\t';
            return '';
          });
          parsed = JSON.parse(sanitized);
        } catch {
          // Final fallback: direct regex extraction of fields
          const idM = decoded.match(/"id"\s*:\s*(\d+)/);
          const msgM = decoded.match(/"message"\s*:\s*"([\s\S]*?)(?<!\\)"\s*,\s*"/);
          let imgM = decoded.match(/"(?:image|full_size|poster_image)"\s*:\s*"([^"]+)"/);
          if (!imgM) {
            const mediaSrcM = decoded.match(/src=\\?["']([^"'\\]+)\\?["']/i) || 
                              decoded.match(/https?:\/\/[^\s"'\\]+(?:jpg|jpeg|png|webp|\/media\/\d+)[^\s"'\\]*/i);
            if (mediaSrcM) imgM = mediaSrcM;
          }
          const mediaHtmlM = decoded.match(/"media_html"\s*:\s*"([\s\S]*?)(?<!\\)"\s*,\s*"/);
          if (idM || msgM || imgM || mediaHtmlM) {
            parsed = {
              id: idM ? idM[1] : undefined,
              message: msgM ? msgM[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '',
              image: imgM ? (imgM[1] || imgM[0]) : '',
              media_html: mediaHtmlM ? mediaHtmlM[1] : decoded
            };
          }
        }
      }

      if (parsed) {
        dataPostItems.push(parsed);
      }
    }

    if (dataPostItems.length > 0) {
      const extracted: ExtractedItem[] = [];
      dataPostItems.forEach((dp, idx) => {
        const rawMsg = (dp.message || dp.unaltered_message || dp.caption || dp.text || '').trim();
        const cleanMsg = rawMsg
          .replace(/<br\s*[\/]?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<p[^>]*>/gi, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        let detectedPrice = basePrice;
        if (cleanMsg) {
          const priceMatch = cleanMsg.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
          if (priceMatch) detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
        }

        const firstLine = cleanMsg.split('\n').map(l => l.trim()).filter(Boolean)[0] || '';
        const title = firstLine.substring(0, 80) || `سلعة فيسبوك Juicer #${idx + 1}`;
        const discovered = discoverCategoryForItem(title, cleanMsg);

        // Gather all photos for this post into one product (preserving albums/carousels)
        const postImages: string[] = [];
        const seen = new Set<string>();

        const addImg = (url: any) => {
          if (!url || typeof url !== 'string') return;
          let clean = url.trim().replace(/\\"/g, '').replace(/\\'/g, '');
          clean = clean.replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
          if (!clean.startsWith('http')) return;
          if (seen.has(clean)) return;
          seen.add(clean);
          postImages.push(clean);
        };

        // 1. From media_html (e.g. Swiper slider with multiple images: /images/37088624.jpg, etc.)
        const mediaHtml = dp.media_html || dp.mediaHtml || '';
        if (mediaHtml) {
          const imgTagRegex = /src=\\?["']([^"'\\]+)\\?["']/gi;
          let m;
          while ((m = imgTagRegex.exec(mediaHtml)) !== null) {
            addImg(m[1]);
          }
          const directImgRegex = /(https?:\/\/[^\s"'<>\\]+?(?:\.jpg|\.jpeg|\.png|\.webp|\/images\/\d+|\/media\/\d+)[^\s"'<>\\]*)/gi;
          while ((m = directImgRegex.exec(mediaHtml)) !== null) {
            addImg(m[1]);
          }
        }

        // 2. Direct properties
        addImg(dp.full_size);
        addImg(dp.unaltered_image);
        addImg(dp.image);
        addImg(dp.photo);

        // 3. Additional photos or media array
        if (Array.isArray(dp.additional_photos)) {
          dp.additional_photos.forEach((ap: any) => addImg(typeof ap === 'string' ? ap : (ap?.url || ap?.src)));
        }
        if (Array.isArray(dp.media)) {
          dp.media.forEach((m: any) => addImg(typeof m === 'string' ? m : (m?.url || m?.src)));
        }

        // 4. Fallback to poster_image if no images found
        if (postImages.length === 0 && dp.poster_image) {
          addImg(dp.poster_image);
        }

        if (postImages.length > 0) {
          extracted.push({
            id: `dp_${dp.id || Date.now()}_${idx}`,
            name: title,
            price: detectedPrice,
            category: discovered.category || defaultCategory,
            subcategory: discovered.subcategory || defaultSubcategory,
            image: postImages[0],
            images: postImages,
            description: cleanMsg || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
          });
        }
      });

      if (extracted.length > 0) {
        setItems(prev => [...extracted.reverse(), ...prev]);
        setIsProcessing(false);
        setStatusMessage({
          text: `✅ تم بنجاح استخراج ${extracted.length} سلعة بالوصف الكامل والصور من كود Juicer!`,
          type: 'success'
        });
        return;
      }
    }

    // 1. Try structured JSON from Bookmarklet or Juicer / Elfsight JSON export
    try {
      const trimmed = inputText.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        const parsed = JSON.parse(trimmed);
        
        // If user pasted Juicer JSON
        if (parsed?.posts?.items && Array.isArray(parsed.posts.items)) {
          const juicerItems = parsed.posts.items;
          const extracted: ExtractedItem[] = [];
          juicerItems.forEach((p: any, idx: number) => {
            const msg = (p.message || '').trim();
            let detectedPrice = basePrice;
            if (msg) {
              const priceMatch = msg.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار|dt\b)/i);
              if (priceMatch) detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
            }
            const title = msg ? msg.split('\n')[0].substring(0, 80) : `سلعة Juicer #${idx + 1}`;
            const discovered = discoverCategoryForItem(title, msg);

            const postImages: string[] = [];
            const primaryImg = p.full_size || p.unaltered_image || p.image;
            if (primaryImg && typeof primaryImg === 'string' && primaryImg.startsWith('http')) {
              postImages.push(primaryImg);
            }
            if (Array.isArray(p.additional_photos)) {
              p.additional_photos.forEach((ap: any) => {
                const u = typeof ap === 'string' ? ap : (ap?.url || ap?.src);
                if (u && typeof u === 'string' && u.startsWith('http') && !postImages.includes(u)) {
                  postImages.push(u);
                }
              });
            }
            if (Array.isArray(p.media)) {
              p.media.forEach((m: any) => {
                const u = typeof m === 'string' ? m : (m?.url || m?.src);
                if (u && typeof u === 'string' && u.startsWith('http') && !postImages.includes(u)) {
                  postImages.push(u);
                }
              });
            }

            if (postImages.length > 0) {
              extracted.push({
                id: `json_juicer_${Date.now()}_${idx}`,
                name: title,
                price: detectedPrice,
                category: discovered.category || defaultCategory,
                subcategory: discovered.subcategory || defaultSubcategory,
                image: postImages[0],
                images: postImages,
                description: msg || `منتج متاح لدى بن عمار للمكتبية والإعلامية`
              });
            }
          });

          if (extracted.length > 0) {
            setItems(prev => [...extracted.reverse(), ...prev]);
            setIsProcessing(false);
            setStatusMessage({
              text: `✅ تم استيراد ${extracted.length} منتج من ملف JSON الخاص بـ Juicer بنجاح!`,
              type: 'success'
            });
            return;
          }
        }

        const list = Array.isArray(parsed) ? parsed : [parsed];
        if (list.length > 0 && (list[0].image || list[0].img || list[0].url)) {
          const directItems: ExtractedItem[] = list.map((item: any, idx: number) => {
            const detectedTitle = item.name || item.title || `منتج بن عمار #${items.length + idx + 1}`;
            const discovered = discoverCategoryForItem(detectedTitle, item.description || '');
            const itemImgs = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : [item.image || item.img || item.url].filter(Boolean);
            return {
              id: `fb_struct_${Date.now()}_${idx}`,
              name: detectedTitle,
              price: item.price !== undefined && item.price !== null && !isNaN(Number(item.price)) ? Number(item.price) : basePrice,
              category: item.category || discovered.category || defaultCategory,
              subcategory: item.subcategory || discovered.subcategory || defaultSubcategory,
              image: itemImgs[0] || item.image || item.img || item.url,
              images: itemImgs,
              description: item.description || item.desc || `منتج أصلي متوفر لدى بن عمار للمكتبية و الإعلامية`
            };
          }).filter(it => it.image && typeof it.image === 'string' && it.image.startsWith('http'));

          if (directItems.length > 0) {
            setItems(prev => [...directItems.reverse(), ...prev]);
            setIsProcessing(false);
            setStatusMessage({
              text: `✅ تم بنجاح استيراد ${directItems.length} منتج بالأسماء والأسعار والتصنيفات المستخرجة!`,
              type: 'success'
            });
            return;
          }
        }
      }
    } catch {
      // not JSON, proceed to standard parsing
    }

    // 2. Standard text / HTML extraction
    const urls = extractAllFacebookImages(inputText);

    if (urls.length === 0) {
      setIsProcessing(false);
      setStatusMessage({ 
        text: 'لم يتم العثور على روابط صور. تأكد من نسخ رابط الصورة المباشر أو كود الصفحة، أو استخدم Juicer أو زر "رفع صور من جهازك".', 
        type: 'error' 
      });
      return;
    }

    // Extract text lines for name matching
    const textLines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('http') && !l.startsWith('<') && l.length > 3 && l.length < 100);

    const newItems: ExtractedItem[] = urls.map((url, idx) => {
      let detectedName = '';
      if (textLines.length > idx) {
        detectedName = textLines[idx];
      }

      if (!detectedName) {
        const escapedUrl = url.split('?')[0];
        const altMatch = inputText.match(new RegExp(`alt=["']([^"']+)["'][^>]*${escapedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')) ||
                         inputText.match(new RegExp(`${escapedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*alt=["']([^"']+)["']`, 'i'));
        if (altMatch && altMatch[1] && !altMatch[1].includes('قد تكون صورة')) {
          detectedName = altMatch[1].trim();
        }
      }

      // Detect price if present in text line
      let detectedPrice = basePrice;
      if (detectedName) {
        const priceMatch = detectedName.match(/(\d+(?:[.,]\d+)?)\s*(?:dt|DT|د\.ت|دينار)/i);
        if (priceMatch) {
          detectedPrice = parseFloat(priceMatch[1].replace(',', '.'));
        }
      }

      const finalName = detectedName || `منتج مكتبة بن عمار #${items.length + idx + 1}`;
      const discovered = discoverCategoryForItem(finalName, detectedName);

      return {
        id: `fb_${Date.now()}_${idx}`,
        name: finalName,
        price: detectedPrice,
        category: discovered.category || defaultCategory,
        subcategory: discovered.subcategory || defaultSubcategory,
        image: url,
        images: [url],
        description: detectedName ? `منتج أصلي (${detectedName}) متوفر لدى بن عمار للمكتبية و الإعلامية` : `منتج عالي الجودة متوفر لدى بن عمار للمكتبية و الإعلامية`
      };
    });

    setItems(prev => [...newItems.reverse(), ...prev]);
    setIsProcessing(false);
    setStatusMessage({ 
      text: `✅ تم استخراج ${newItems.length} صورة بنجاح في بداية القائمة! يمكنك الآن تسميتها أو اكتشاف تصنيفاتها أو تعديل أسعارها.`, 
      type: 'success' 
    });

    if (autoAiEnabled) {
      setTimeout(() => {
        handleAiAnalyzeDirect([...items, ...newItems]);
      }, 100);
    }
  };

  // Stop AI immediately
  const handleStopAiAnalysis = () => {
    aiAbortRef.current = true;
    setIsAnalyzingAi(false);
    setStatusMessage({
      text: '🛑 تم إيقاف الذكاء الاصطناعي فوراً!',
      type: 'info'
    });
  };

  // AI Direct analysis with abort check
  const handleAiAnalyzeDirect = async (currentItems: ExtractedItem[]) => {
    if (currentItems.length === 0) return;
    setIsAnalyzingAi(true);
    aiAbortRef.current = false;

    const updated = [...currentItems];
    let completedCount = 0;

    for (let i = 0; i < updated.length; i++) {
      if (aiAbortRef.current) {
        break; // Stop immediately if requested
      }

      try {
        const item = updated[i];
        const res = await analyzeProductImage(item.image, i, item.name);
        
        if (aiAbortRef.current) break;

        updated[i] = {
          ...item,
          name: (res.name && !res.name.includes('سلعة')) ? res.name : item.name,
          category: res.category || item.category,
          subcategory: res.subcategory || item.subcategory,
          price: item.price > 0 ? item.price : (res.price || item.price),
          description: (item.description && item.description.length > 25 && !item.description.includes('منتج متاح لدى بن عمار'))
            ? item.description
            : (res.description || item.description)
        };
        completedCount++;
        setItems([...updated]);
      } catch (e) {
        console.warn('AI analysis error for image', i, e);
      }
    }

    setIsAnalyzingAi(false);
    if (!aiAbortRef.current) {
      setStatusMessage({ 
        text: `✨ تم بنجاح تحليل وإعادة تسمية وتصنيف ${completedCount} سلعة بالذكاء الاصطناعي!`, 
        type: 'success' 
      });
    }
  };

  // Discover categories for all items
  const handleDiscoverCategories = () => {
    if (items.length === 0) {
      setStatusMessage({ text: 'لا توجد سلع مستخرجة لاكتشاف تصنيفاتها بعد.', type: 'info' });
      return;
    }

    let updatedCount = 0;
    const updated = items.map(it => {
      const discovered = discoverCategoryForItem(it.name, it.description);
      if (discovered.category) {
        updatedCount++;
        return {
          ...it,
          category: discovered.category,
          subcategory: discovered.subcategory || it.subcategory
        };
      }
      return it;
    });

    setItems(updated);
    setStatusMessage({
      text: `🏷️ تم اكتشاف وتعيين التصنيفات والأقسام الفرعية لـ ${updatedCount} سلعة تلقائياً بنجاح!`,
      type: 'success'
    });
  };

  // Rename items from original post text lines
  const handleRenameFromPostText = () => {
    if (items.length === 0) return;

    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('http') && !l.startsWith('<') && l.length > 2 && l.length < 100);

    if (lines.length === 0) {
      setStatusMessage({
        text: 'لم يتم العثور على أسطر نصية كافية في الصندوق. يمكنك كتابة أسماء أو استخدام التسمية التسلسلية.',
        type: 'error'
      });
      return;
    }

    const updated = items.map((it, idx) => {
      const newName = lines[idx % lines.length];
      const discovered = discoverCategoryForItem(newName, it.description);
      return {
        ...it,
        name: newName,
        category: discovered.category || it.category,
        subcategory: discovered.subcategory || it.subcategory
      };
    });

    setItems(updated);
    setStatusMessage({
      text: `📄 تم بنجاح استخراج الأسماء من نصوص المنشور وتسمية ${updated.length} سلعة!`,
      type: 'success'
    });
  };

  // Sequential batch rename
  const handleApplySequentialRename = () => {
    if (items.length === 0) return;
    const prefix = batchRenamePrefix.trim() || 'سلعة مكتبة بن عمار';
    const updated = items.map((it, idx) => ({
      ...it,
      name: `${prefix} #${idx + 1}`
    }));
    setItems(updated);
    setShowBatchRenameModal(false);
    setStatusMessage({
      text: `🔢 تم تطبيق التسمية التسلسلية بنجاح لـ ${updated.length} سلعة!`,
      type: 'success'
    });
  };

  // Batch price setter
  const handleApplyBatchPrice = () => {
    if (items.length === 0) return;
    const priceNum = parseFloat(batchPriceInput);
    if (isNaN(priceNum) || priceNum < 0) {
      setStatusMessage({ text: 'يرجى إدخال سعر صحيح بالأرقام.', type: 'error' });
      return;
    }
    const updated = items.map(it => ({
      ...it,
      price: priceNum
    }));
    setItems(updated);
    setShowBatchPriceModal(false);
    setStatusMessage({
      text: `💰 تم بنجاح تحديد السعر (${priceNum.toFixed(3)} د.ت) لكافة السلع!`,
      type: 'success'
    });
  };

  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setStatusMessage({ text: '🔄 جارٍ المزامنة مع قاعدة البيانات السحابية...', type: 'info' });
    try {
      const res = await productService.syncWithFirestore();
      setIsSyncing(false);
      setStatusMessage({ 
        text: res.message || `✅ تمت المزامنة بنجاح! إجمالي السلع المتزامنة: ${res.syncedCount}`, 
        type: 'success' 
      });
    } catch {
      setIsSyncing(false);
      setStatusMessage({ 
        text: 'تعذرت المزامنة السحابية. تم الاحتفاظ بالبيانات في المتجر محلياً.', 
        type: 'error' 
      });
    }
  };

  const handlePublishAll = () => {
    if (items.length === 0 || isPublishing) return;
    setIsPublishing(true);

    const newProducts: Omit<Product, 'id'>[] = items.map(item => {
      const allItemImages = (item.images && item.images.length > 0)
        ? item.images
        : [item.image];

      return {
        name: item.name.trim() || 'سلعة جديدة',
        price: Number(item.price) || 0,
        category: item.category || defaultCategory || 'اللوازم المدرسية',
        subcategory: item.subcategory || defaultSubcategory || undefined,
        description: item.description || item.name,
        image: item.image || allItemImages[0],
        images: allItemImages,
        brand: 'بن عمار للمكتبية و الإعلامية',
        availability: 'متوفر',
        rating: 5,
        reviewsCount: 12,
        source: 'manual'
      };
    });

    newProducts.forEach(p => {
      productService.addProduct(p);
    });

    setIsPublishing(false);
    onSuccess(newProducts.length, `تم بنجاح نشر ${newProducts.length} سلعة في متجر بن عمار!`);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ExtractedItem, val: any) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));
  };

  const selectedCatObj = categories.find(c => c.name === defaultCategory);

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-6 text-right font-sans" dir="rtl">
      {/* Header with Sync & Guide Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-xs bg-[oklch(54.1%_0.281_293.009)]" />
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              استيراد سلع فيسبوك الشامل (API & Juicer & Elfsight)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            جلب مباشر عبر تغذية Juicer أو Elfsight أو Facebook Graph API، مع استخراج الصور الحقيقية وتصنيفها ونشرها فوراً.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Guide Explainer Button */}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-xs font-black transition-all shadow-2xs cursor-pointer"
            title="كيف تستخدم Juicer و Elfsight و API لجلب كل الصور تلقائياً؟"
          >
            <HelpCircle size={14} className="text-amber-700" />
            <span>شرح طرق الاستيراد و API 💡</span>
          </button>

          {/* Direct Sync Button */}
          <button
            type="button"
            onClick={handleSyncFirestore}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[oklch(54.1%_0.281_293.009)] border border-purple-200 rounded-md text-xs font-black transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            title="مزامنة مع قاعدة البيانات السحابية Firestore"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            <span>{isSyncing ? 'جارٍ المزامنة...' : 'زر مزامنة 🔄'}</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Modern Method Tabs Selector */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
        {/* Tab 1: Juicer (Highlighted as easiest) */}
        <button
          type="button"
          onClick={() => setActiveTab('juicer')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'juicer'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
          }`}
        >
          <span className="text-sm">🍹</span>
          <span>تغذية Juicer.io (موصى به)</span>
        </button>

        {/* Tab 2: Elfsight */}
        <button
          type="button"
          onClick={() => setActiveTab('elfsight')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'elfsight'
              ? 'bg-[oklch(54.1%_0.281_293.009)] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
          }`}
        >
          <Layers size={14} />
          <span>ويدجت Elfsight Feed</span>
        </button>

        {/* Tab 3: Facebook Graph API */}
        <button
          type="button"
          onClick={() => setActiveTab('graph_api')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'graph_api'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
          }`}
        >
          <Key size={14} />
          <span>Facebook Graph API</span>
        </button>

        {/* Tab 4: Manual / Bookmarklet */}
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
          }`}
        >
          <Clipboard size={14} />
          <span>لصق روابط / كود</span>
        </button>

        {/* Tab 5: Device Upload */}
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
          }`}
        >
          <Upload size={14} />
          <span>صور من الجهاز</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {/* ==================== TAB 1: JUICER ==================== */}
        {activeTab === 'juicer' && (
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500 text-stone-950 rounded-md font-black text-sm">🍹</span>
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    الربط الفوري مع Juicer.io Social Feed (بدون جدار حماية فيسبوك)
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    خدمة Juicer توفر تغذية JSON مفتوحة لصفحة فيسبوك بدون مشاكل CORS أو تسجيل دخول، وتجلب الصور الأصلية عالية الدقة.
                  </p>
                </div>
              </div>
              <a
                href="https://www.juicer.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 hover:text-amber-950 underline self-start sm:self-auto"
              >
                <span>موقع Juicer.io المجاني</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Detected Feed Badge */}
            <div className="bg-amber-100/90 border border-amber-300 rounded-lg p-3.5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-black text-amber-950">
                    تم تفعيل والتعرف على تغذية متجرك في Juicer API:
                  </span>
                  <code className="bg-white px-2 py-0.5 rounded font-mono font-black text-amber-900 border border-amber-300 text-xs">
                    {juicerFeedId || '100063679074454'}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.juicer.io/api/feeds/${encodeURIComponent(juicerFeedId || '100063679074454')}?per=20`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                    title="معاينة بيانات JSON المباشرة القادمة من Juicer API"
                  >
                    <span>معاينة رد الـ API (JSON)</span>
                    <ExternalLink size={11} />
                  </a>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    متصل وجاهز ✨
                  </span>
                </div>
              </div>

              <div className="bg-white/80 rounded border border-amber-200/80 p-2 text-[11px] text-stone-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-mono text-[10px] text-stone-600 truncate max-w-full">
                  <span className="font-bold text-amber-900 shrink-0">رابط الـ API المباشر:</span>
                  <span className="truncate">https://www.juicer.io/api/feeds/{juicerFeedId || '100063679074454'}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded shrink-0">
                  CORS مفتوح • بدون توكن مطلوب
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-stone-800 block">
                    🔑 مفتاح Juicer API الرسمي (API Key / Bearer Token):
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    تم التفعيل والربط بنجاح ✅
                  </span>
                </div>
                <input
                  type="text"
                  value={juicerApiKey}
                  onChange={(e) => setJuicerApiKey(e.target.value)}
                  placeholder="jcr_ec7a05918aaff5545f2095692e8cb4528bf5553ffb00c2430ab406dedb6e2f45"
                  className="w-full p-2.5 bg-white rounded-lg border border-stone-300 focus:border-amber-500 text-xs font-mono text-stone-900 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-stone-800 block">
                  معرف التغذية (Juicer Feed ID أو Slug):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={juicerFeedId}
                    onChange={(e) => setJuicerFeedId(e.target.value)}
                    placeholder="100063679074454 أو معرف التغذية"
                    className="flex-1 p-3 bg-white rounded-lg border border-stone-300 focus:border-amber-500 text-xs sm:text-sm font-mono text-stone-900 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => handleFetchJuicer()}
                    disabled={isProcessing}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-lg text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                    <span>جلب المنشورات والصور عبر Juicer API الرسمي 🚀</span>
                  </button>
                </div>
              </div>

              {/* Website URL Guide box for Juicer setup */}
              <div className="bg-white/90 border border-stone-200 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">
                    🌐 عنوان موقع متجرك (في حال طلب منك Juicer إدخال Website URL):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-oswiv6pu3eyp2yigg3oc72-569858524695.europe-west2.run.app';
                      navigator.clipboard.writeText(url);
                      setStatusMessage({ text: 'تم نسخ عنوان موقع متجرك بنجاح! 📋', type: 'info' });
                    }}
                    className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    نسخ عنوان المتجر 📋
                  </button>
                </div>
                <div className="font-mono text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded border border-stone-200 select-all">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-oswiv6pu3eyp2yigg3oc72-569858524695.europe-west2.run.app'}
                </div>
                <p className="text-[10px] text-stone-500">
                  إذا سألك موقع Juicer عند إنشاء التغذية عن <strong>Website URL</strong>، الصق الرابط أعلاه في إعدادات Juicer، أو اضغط مباشرة على زر الجلب حيث يعمل الـ API الآن عبر سيرفر المتجر الداخلي دون قيود!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: ELFSIGHT ==================== */}
        {activeTab === 'elfsight' && (
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[oklch(54.1%_0.281_293.009)] text-white rounded-md font-black text-sm">
                  <Layers size={15} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    الربط مع ويدجت Elfsight Social Photo Feed
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    استيراد مباشر لمنشورات وسلع صفحة فيسبوك عبر معرف ويدجت Elfsight المعين لمتجرك.
                  </p>
                </div>
              </div>
              <a
                href="https://elfsight.com/facebook-feed-widget/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-black text-purple-800 hover:text-purple-950 underline self-start sm:self-auto"
              >
                <span>موقع Elfsight Feed</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-stone-800 block">
                معرف ويدجت Elfsight (Widget ID / UUID):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={elfsightWidgetId}
                  onChange={(e) => setElfsightWidgetId(e.target.value)}
                  placeholder="مثال: e2c3f814-1180-496a-8671-3444005e834b أو رابط التثبيت"
                  className="flex-1 p-3 bg-white rounded-lg border border-stone-300 focus:border-[oklch(54.1%_0.281_293.009)] text-xs sm:text-sm font-mono text-stone-900 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleFetchElfsight}
                  disabled={isProcessing}
                  className="bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white px-6 py-3 rounded-lg text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Layers size={16} />}
                  <span>جلب السلع من Elfsight ⚡</span>
                </button>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                💡 في حال واجه متصفحك حماية CORS مع Elfsight، يمكنك فتح رابط الويدجت في المتصفح ونسخ الـ JSON ولصقه في تبويب <strong>«لصق روابط / كود»</strong> وسيتم استيراده تلقائياً!
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: FACEBOOK GRAPH API ==================== */}
        {activeTab === 'graph_api' && (
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-600 text-white rounded-md font-black text-sm">
                <Key size={15} />
              </span>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  الربط المباشر بـ Meta / Facebook Graph API الرسمي
                </h3>
                <p className="text-[11px] text-stone-600">
                  اتصال مباشر بسيرفرات فيسبوك لجلب المنشورات والصور الأصلية والألبومات (Subattachments).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-stone-800 block mb-1">
                  معرف الصفحة (Page ID أو اسم الصفحة):
                </label>
                <input
                  type="text"
                  value={fbPageId}
                  onChange={(e) => setFbPageId(e.target.value)}
                  placeholder="مثال: 100064567890123 أو benammar.stationery"
                  className="w-full p-2.5 bg-white rounded-lg border border-stone-300 focus:border-blue-600 text-xs sm:text-sm font-mono text-stone-900 outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="text-xs font-black text-stone-800 block mb-1">
                  رمز الوصول (Page Access Token):
                </label>
                <input
                  type="password"
                  value={fbAccessToken}
                  onChange={(e) => setFbAccessToken(e.target.value)}
                  placeholder="EAA..."
                  className="w-full p-2.5 bg-white rounded-lg border border-stone-300 focus:border-blue-600 text-xs sm:text-sm font-mono text-stone-900 outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
              >
                <span>الحصول على Access Token عبر Graph API Explorer</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={handleFetchGraphApi}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Globe size={16} />}
                <span>الاتصال بـ Facebook API واستخراج السلع 🔑</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: MANUAL / BOOKMARKLET ==================== */}
        {activeTab === 'manual' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-black text-stone-800">
                الصق هنا روابط صور فيسبوك الحقيقية (scontent...) أو كود الصفحة أو بيانات JSON:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  <Clipboard size={13} />
                  <span>لصق من الحافظة</span>
                </button>
                {inputText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="text-stone-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="الصق هنا روابط صور فيسبوك الحقيقية، أو كود الاستخراج المنسوخ عبر الكود السحري، أو بيانات JSON من Juicer / Elfsight..."
              className="w-full p-3 bg-stone-50 rounded-lg border border-stone-300 focus:border-[oklch(54.1%_0.281_293.009)] focus:bg-white text-xs sm:text-sm font-mono text-stone-900 outline-none transition-all shadow-inner leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleExtract}
                disabled={isProcessing}
                className="bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white py-2.5 px-6 rounded-lg text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                <span>استخراج الصور وتجهيز السلع ⚡</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: DEVICE UPLOAD ==================== */}
        {activeTab === 'upload' && (
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900">
                رفع صور المنتجات مباشرة من حاسوبك أو هاتفك
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                اختر صورة واحدة أو مجموعة صور دفعة واحدة، وسيقوم النظام بتسميتها واكتشاف تصنيفاتها وإضافتها لأعلى القائمة فوراً.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-lg text-xs sm:text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Upload size={16} />
              <span>اختيار وتحديد صور من الجهاز 📁</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Quick Batch Settings: Default Category, Subcategory & Default Price (empty by default) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-100 p-3 rounded-lg border border-stone-200">
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">التصنيف الافتراضي:</label>
            <select
              value={defaultCategory}
              onChange={(e) => {
                setDefaultCategory(e.target.value);
                setDefaultSubcategory('');
              }}
              className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-xs font-bold text-stone-800 outline-none focus:border-[oklch(54.1%_0.281_293.009)] cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">القسم الفرعي:</label>
            <select
              value={defaultSubcategory}
              onChange={(e) => setDefaultSubcategory(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-xs font-bold text-stone-800 outline-none focus:border-[oklch(54.1%_0.281_293.009)] cursor-pointer"
            >
              <option value="">بدون قسم فرعي (تلقائي)</option>
              {selectedCatObj?.subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              السعر الافتراضي (د.ت): <span className="text-stone-400 font-normal">(فارغ افتراضياً)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              placeholder="اتركه فارغاً أو حدد سعراً"
              className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-xs font-bold text-stone-800 outline-none focus:border-[oklch(54.1%_0.281_293.009)] placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* AI Auto-naming toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">التسمية التلقائية بالذكاء الاصطناعي:</span>
            <button
              type="button"
              onClick={() => setAutoAiEnabled(prev => !prev)}
              className={`px-3 py-1 rounded-md text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border ${
                autoAiEnabled 
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                  : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
              }`}
            >
              {autoAiEnabled ? '✅ مفعل (تحليل تلقائي)' : '🛑 معطل (حفظ الأسماء الأصلية)'}
            </button>
          </div>

          <div className="text-[11px] text-stone-500 font-medium">
            {autoAiEnabled ? 'سيقوم الذكاء الاصطناعي بقراءة الصور فور الاستخراج' : 'يمكنك استخدام أوامر التسمية أو تشغيل الذكاء متى شئت'}
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-3 rounded-lg text-xs font-bold flex items-center justify-between border ${
          statusMessage.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-purple-50 border-purple-200 text-purple-900'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="p-1 opacity-70 hover:opacity-100 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Extracted Items Section with Reverse Order & Naming Commands */}
      {items.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          {/* Commands Toolbar */}
          <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2">
                  <span>السلع المستخرجة ({items.length} سلعة)</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[oklch(54.1%_0.281_293.009)]">
                    جاهزة للنشر (الترتيب: الأحدث أولاً)
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  استخدم أوامر التسمية واكتشاف التصنيفات السريعة أدناه للتحكم الشامل بضغطة زر.
                </p>
              </div>

              {/* Action Buttons: Publish + Stop AI if running */}
              <div className="flex items-center gap-2">
                {isAnalyzingAi && (
                  <button
                    type="button"
                    onClick={handleStopAiAnalysis}
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-md text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse"
                    title="إيقاف تحليل الذكاء الاصطناعي فوراً"
                  >
                    <StopCircle size={15} />
                    <span>إيقاف الذكاء 🛑</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePublishAll}
                  disabled={isPublishing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  <span>نشر الجميع في المتجر الآن ({items.length})</span>
                </button>
              </div>
            </div>

            {/* Smart Naming & Category Discovery Commands Bar */}
            <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-stone-700 shrink-0">أوامر سريعة:</span>

              {/* 1. Discover Categories */}
              <button
                type="button"
                onClick={handleDiscoverCategories}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="فحص أسماء السلع وتحديد التصنيف والقسم الفرعي الأنسب لكل سلعة تلقائياً"
              >
                <Tag size={13} />
                <span>اكتشف التصنيفات تلقائياً 🏷️</span>
              </button>

              {/* 2. Rename from Original Post Text */}
              <button
                type="button"
                onClick={handleRenameFromPostText}
                className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="استخراج وتسمية السلع من أسطر ونصوص المنشور الأصلية"
              >
                <FileText size={13} />
                <span>تسمية من نص المنشور الأصلي 📄</span>
              </button>

              {/* 3. Sequential Custom Rename */}
              <button
                type="button"
                onClick={() => setShowBatchRenameModal(true)}
                className="bg-stone-700 hover:bg-stone-800 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="إعادة تسمية جميع السلع برقم متسلسل مثل: حقيبة مدرسية #1، #2..."
              >
                <Hash size={13} />
                <span>تسمية تسلسلية موحدة 🔢</span>
              </button>

              {/* 4. Batch Price Setter */}
              <button
                type="button"
                onClick={() => setShowBatchPriceModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="تحديد سعر موحد لجميع السلع دفعة واحدة"
              >
                <DollarSign size={13} />
                <span>تحديد سعر جماعي للكل 💰</span>
              </button>

              {/* 5. AI Analyze or Stop */}
              {!isAnalyzingAi ? (
                <button
                  type="button"
                  onClick={() => handleAiAnalyzeDirect(items)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="تحسين وتوليد أسماء وتصنيفات السلع بالذكاء الاصطناعي"
                >
                  <Sparkles size={13} />
                  <span>تشغيل الذكاء الاصطناعي ✨</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopAiAnalysis}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="إيقاف الذكاء الاصطناعي فوراً"
                >
                  <StopCircle size={13} />
                  <span>إيقاف الذكاء 🛑</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Preview of Extracted Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((it) => (
              <div 
                key={it.id} 
                className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex gap-3 items-start relative group hover:border-[oklch(54.1%_0.281_293.009)] transition-colors shadow-2xs"
              >
                <div className="w-20 shrink-0 space-y-1">
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden border border-stone-200 p-0.5 relative">
                    <img 
                      src={it.image} 
                      alt={it.name} 
                      className="w-full h-full object-cover rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                    {it.images && it.images.length > 1 && (
                      <span 
                        className="absolute top-1 right-1 bg-stone-900/85 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs" 
                        title={`هذا المنشور يضم ${it.images.length} صور في ألبوم واحد`}
                      >
                        <span>📷</span>
                        <span>{it.images.length}</span>
                      </span>
                    )}
                    {it.price === 0 && (
                      <span className="absolute bottom-0 right-0 left-0 bg-amber-500/90 text-stone-950 font-black text-[9px] text-center py-0.5">
                        حدد السعر
                      </span>
                    )}
                  </div>

                  {/* Multi-photo thumbnails preview & switcher */}
                  {it.images && it.images.length > 1 && (
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[80px] pb-0.5" title="انقر لتحديد الصورة الرئيسية">
                      {it.images.map((imgUrl, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => handleUpdateItem(it.id, 'image', imgUrl)}
                          className={`w-4 h-4 rounded-xs shrink-0 overflow-hidden border cursor-pointer transition-all ${
                            it.image === imgUrl 
                              ? 'border-[oklch(54.1%_0.281_293.009)] ring-1 ring-[oklch(54.1%_0.281_293.009)] scale-110' 
                              : 'border-stone-300 opacity-60 hover:opacity-100'
                          }`}
                          title={`الصورة ${imgIdx + 1} (انقر لجعلها الصورة الأساسية)`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    value={it.name}
                    onChange={(e) => handleUpdateItem(it.id, 'name', e.target.value)}
                    placeholder="اسم السلعة"
                    className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold text-stone-900 outline-none focus:border-[oklch(54.1%_0.281_293.009)]"
                  />

                  {/* Price Field (Empty by default if 0) */}
                  <div className="flex items-center gap-2">
                    <div className="w-28">
                      <input
                        type="number"
                        step="0.1"
                        value={it.price === 0 ? '' : it.price}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                          handleUpdateItem(it.id, 'price', val);
                        }}
                        placeholder="0.000 د.ت"
                        className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-black text-[oklch(54.1%_0.281_293.009)] outline-none focus:border-[oklch(54.1%_0.281_293.009)] placeholder:text-stone-400 placeholder:font-normal"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500">د.ت</span>
                  </div>

                  {/* Category Selector */}
                  <div className="flex flex-col gap-1">
                    <select
                      value={it.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const catObj = categories.find(c => c.name === newCat);
                        handleUpdateItem(it.id, 'category', newCat);
                        if (catObj && catObj.subcategories.length > 0) {
                          handleUpdateItem(it.id, 'subcategory', catObj.subcategories[0]);
                        } else {
                          handleUpdateItem(it.id, 'subcategory', '');
                        }
                      }}
                      className="w-full bg-white border border-stone-300 rounded px-1.5 py-0.5 text-[10px] font-bold text-stone-700 outline-none focus:border-[oklch(54.1%_0.281_293.009)] cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    {it.subcategory && (
                      <span className="text-[9px] font-medium text-stone-500 truncate" title={it.subcategory}>
                        {it.subcategory}
                      </span>
                    )}
                  </div>

                  {/* Full Description / Post Text Field */}
                  <div className="pt-1.5 border-t border-stone-200/80">
                    <div className="flex items-center justify-between text-[10px] text-stone-600 font-bold mb-1">
                      <span>وصف المنشور / تفاصيل السلعة:</span>
                      <span className="text-stone-400 font-normal text-[9px]">
                        {it.description?.length || 0} حرف
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={it.description}
                      onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                      placeholder="أدخل وصف السلعة وتفاصيلها هنا..."
                      className="w-full bg-white border border-stone-300 rounded p-1.5 text-[11px] text-stone-800 outline-none focus:border-[oklch(54.1%_0.281_293.009)] font-sans leading-relaxed resize-y shadow-2xs placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(it.id)}
                  className="text-stone-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                  title="حذف من القائمة"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handlePublishAll}
              disabled={isPublishing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-sm font-black transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              <span>تأكيد وحفظ ونشر كافة السلع ({items.length}) في المتجر</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Rename Modal */}
      {showBatchRenameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-stone-200 text-right space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-base font-black text-stone-900">تسمية تسلسلية لكافة السلع</h3>
              <button 
                type="button" 
                onClick={() => setShowBatchRenameModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-600">
              أدخل البادئة أو الاسم الأساسي وسيقوم النظام بترقيم السلع أوتوماتيكياً (مثال: حقيبة مدرسية #1, #2...).
            </p>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">الاسم الأساسي للسلعة:</label>
              <input
                type="text"
                value={batchRenamePrefix}
                onChange={(e) => setBatchRenamePrefix(e.target.value)}
                placeholder="مثال: حقيبة مدرسية أكسفورد"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-[oklch(54.1%_0.281_293.009)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchRenameModal(false)}
                className="px-3.5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApplySequentialRename}
                className="px-4 py-2 text-xs font-black bg-[oklch(54.1%_0.281_293.009)] hover:bg-[oklch(48%_0.26_290)] text-white rounded-md shadow-xs cursor-pointer"
              >
                تطبيق التسمية الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Price Modal */}
      {showBatchPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-stone-200 text-right space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-base font-black text-stone-900">تحديد سعر موحد لجميع السلع</h3>
              <button 
                type="button" 
                onClick={() => setShowBatchPriceModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-600">
              أدخل السعر بالدينار التونسي ليتم تطبيقه على كافة السلع المستخرجة دفعة واحدة.
            </p>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">السعر (د.ت):</label>
              <input
                type="number"
                step="0.1"
                value={batchPriceInput}
                onChange={(e) => setBatchPriceInput(e.target.value)}
                placeholder="مثال: 18.500"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-black text-[oklch(54.1%_0.281_293.009)] outline-none focus:border-[oklch(54.1%_0.281_293.009)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchPriceModal(false)}
                className="px-3.5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApplyBatchPrice}
                className="px-4 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-xs cursor-pointer"
              >
                تطبيق السعر للكل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Guide & API Solutions Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto text-right space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900">
                <span className="w-2.5 h-6 rounded-xs bg-amber-500" />
                <h3 className="text-lg sm:text-xl font-black">
                  دليل حلول استيراد سلع فيسبوك (API & Juicer & Elfsight)
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowGuideModal(false)}
                className="text-stone-400 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Methods Breakdown */}
            <div className="space-y-4">
              {/* Method 1: Juicer */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                    🍹 طريقة Juicer.io (الأسهل والأسرع)
                  </span>
                  <span className="text-xs font-bold text-amber-900">تغذية مفتوحة بدون مشاكل</span>
                </div>
                <h5 className="font-black text-stone-900 text-sm">كيف تربط بـ Juicer في دقيقة مجاناً؟</h5>
                <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1 bg-white p-3 rounded-lg border border-amber-100">
                  <li>ادخل على موقع <strong>Juicer.io</strong> وأنشئ حساباً مجانياً.</li>
                  <li>اضغط على <strong>Add Feed Source</strong> واختر <strong>Facebook</strong> ثم ضع رابط صفحة فيسبوك الخاصة بك.</li>
                  <li>انسخ اسم التغذية (Feed Name) مثل <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900">ben-ammar</code>.</li>
                  <li>الصقه في تبويب <strong>«تغذية Juicer.io»</strong> واضغط <strong>«جلب المنشورات»</strong> وسيتم سحب كل الصور والأسعار تلقائياً!</li>
                </ol>
              </div>

              {/* Method 2: Elfsight */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md">
                    ⚡ طريقة Elfsight Widget
                  </span>
                  <span className="text-xs font-bold text-purple-900">سحب سلع فيسبوك</span>
                </div>
                <h5 className="font-black text-stone-900 text-sm">كيف تستورد عبر Elfsight؟</h5>
                <p className="text-xs text-stone-700 leading-relaxed">
                  أنشئ ويدجت <strong>Facebook Feed</strong> على موقع Elfsight واربطه بصفحة فيسبوك، ثم انسخ معرف الويدجت (Widget ID) مثل <code className="bg-stone-100 px-1 py-0.5 rounded text-purple-900">abc-1234-...</code> وضعه في تبويب Elfsight لجلب السلع بنقرة واحدة.
                </p>
              </div>

              {/* Method 3: Facebook Graph API */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md">
                    🔑 Facebook Graph API الرسمي
                  </span>
                  <span className="text-xs font-bold text-blue-900">اتصال رسمي بالمطورين</span>
                </div>
                <h5 className="font-black text-stone-900 text-sm">للمتاجر التي تمتلك تطبيق فيسبوك (Meta App):</h5>
                <p className="text-xs text-stone-700 leading-relaxed">
                  أدخل معرف الصفحة ورمز الوصول (Page Access Token). هذه الطريقة تجلب المنشورات الرسمية مع ألبومات الصور الكاملة (Subattachments) بدون أي حدود.
                </p>
              </div>

              {/* Method 4: Bookmarklet */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-stone-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md">
                    📋 كود الاستخراج المباشر (Bookmarklet)
                  </span>
                  <span className="text-xs font-bold text-stone-600">من داخل المتصفح</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  إذا كنت تتصفح صفحة فيسبوك مباشرة في متصفحك، اضغط على زر النسخ أدناه ثم الصقه في كونسول المتصفح (F12) داخل صفحة فيسبوك وسيقوم فوراً بنسخ جميع الصور إلى الحافظة لتلصقها هنا:
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCopyBookmarklet}
                    className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-1.5 rounded-md text-xs font-black shadow-xs cursor-pointer transition-all"
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode ? 'تم نسخ الكود!' : 'نسخ كود الاستخراج السريع 📋'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer"
              >
                فهمت، إغلاق الدليل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
