import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  city: string;
  shippingFee: number;
  freeShippingThreshold: number;
  shippingEstimate: string;
  shippingCompany: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
  enableCod: boolean;
  enableOnlinePayment: boolean;
  paymentGateway: 'konnect' | 'flouci' | 'clicktopay';
  gatewayApiKey?: string;
  autoWhatsappNotification: boolean;
}

const STORAGE_KEY = 'benammar_store_settings';

export const defaultStoreSettings: StoreSettings = {
  storeName: 'بن عمار للمكتبية و الإعلامية',
  phone: '+21693997226',
  whatsappPhone: '21693997226',
  email: 'infobenammar1@gmail.com',
  address: 'البليدات',
  city: 'قبلي',
  shippingFee: 7.000,
  freeShippingThreshold: 120.000,
  shippingEstimate: 'خلال 24 إلى 48 ساعة لكافة ولايات الجمهورية',
  shippingCompany: 'Aramex / التوصيل السريع',
  facebookPixelId: '',
  googleAnalyticsId: '',
  enableCod: true,
  enableOnlinePayment: true,
  paymentGateway: 'konnect',
  gatewayApiKey: '',
  autoWhatsappNotification: true,
};

export const storeSettingsService = {
  getSettings: (): StoreSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultStoreSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse store settings from storage', e);
    }
    return defaultStoreSettings;
  },

  saveSettings: (settings: Partial<StoreSettings>): StoreSettings => {
    const current = storeSettingsService.getSettings();
    const updated: StoreSettings = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Update Meta Pixel if provided
    if (updated.facebookPixelId && typeof window !== 'undefined') {
      storeSettingsService.initFacebookPixel(updated.facebookPixelId);
    }

    // Background sync to Firestore
    try {
      setDoc(doc(db, 'settings', 'store_config'), updated, { merge: true })
        .catch(err => console.warn('Firestore settings write warning:', err));
    } catch (err) {
      console.warn('Firestore settings write failed:', err);
    }

    window.dispatchEvent(new CustomEvent('store_settings_updated', { detail: updated }));
    return updated;
  },

  syncWithFirestore: async (): Promise<StoreSettings> => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'store_config'));
      if (snap.exists()) {
        const remoteData = snap.data() as StoreSettings;
        const merged = { ...defaultStoreSettings, ...remoteData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('store_settings_updated', { detail: merged }));
        return merged;
      }
    } catch (e) {
      console.warn('Firestore settings sync warning:', e);
    }
    return storeSettingsService.getSettings();
  },

  initFacebookPixel: (pixelId: string) => {
    if (!pixelId || typeof window === 'undefined') return;
    const cleanId = pixelId.trim();
    if (!cleanId) return;

    if ((window as any).fbq) return; // Already initialized

    try {
      /* eslint-disable */
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      (window as any).fbq('init', cleanId);
      (window as any).fbq('track', 'PageView');
      console.log('Meta Pixel initialized with ID:', cleanId);
    } catch (err) {
      console.warn('Failed to initialize Meta Pixel:', err);
    }
  },

  trackEvent: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('track', eventName, params);
      } catch (e) {
        console.warn('Meta Pixel tracking error:', e);
      }
    }
  },

  generateWhatsappOrderLink: (order: {
    id: string;
    customer: string;
    phone: string;
    address: string;
    city: string;
    total: number;
    items: { name: string; quantity: number; price: number }[];
  }): string => {
    const settings = storeSettingsService.getSettings();
    const phone = settings.whatsappPhone.replace(/[^0-9]/g, '') || '21693997226';

    const itemsList = order.items
      .map((it, idx) => `  ${idx + 1}. ${it.name} (×${it.quantity}) - ${(it.price * it.quantity).toFixed(3)} د.ت`)
      .join('\n');

    const message = `السلام عليكم بن عمار للمكتبية و الإعلامية 👋
قمت بطلب شراء جديد من موقعكم الإلكتروني:

📋 *رقم الطلب:* ${order.id}
👤 *الاسم:* ${order.customer}
📞 *الهاتف:* ${order.phone}
📍 *العنوان:* ${order.address} - ${order.city}

🛒 *المنتجات:*
${itemsList}

💰 *المبلغ الجملي:* ${order.total.toFixed(3)} د.ت (الدفع عند الاستلام)

الرجاء تأكيد الطلبية وموعد التوصيل. شكراً لكم!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
};
