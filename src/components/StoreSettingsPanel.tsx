import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MessageCircle, 
  CreditCard, 
  Globe, 
  Save, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Sliders, 
  QrCode, 
  DollarSign, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import { storeSettingsService, StoreSettings, defaultStoreSettings } from '../services/storeSettingsService';

export default function StoreSettingsPanel() {
  const [settings, setSettings] = useState<StoreSettings>(() => storeSettingsService.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testPixelSuccess, setTestPixelSuccess] = useState(false);

  useEffect(() => {
    storeSettingsService.syncWithFirestore().then(remoteSettings => {
      setSettings(remoteSettings);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : (name === 'shippingFee' || name === 'freeShippingThreshold') 
          ? parseFloat(value) || 0 
          : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      storeSettingsService.saveSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPixel = () => {
    if (!settings.facebookPixelId.trim()) {
      alert('يرجى إدخال معرّف فيسبوك بيكسل أولاً');
      return;
    }
    storeSettingsService.initFacebookPixel(settings.facebookPixelId);
    storeSettingsService.trackEvent('TestEvent', { test: true });
    setTestPixelSuccess(true);
    setTimeout(() => setTestPixelSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12" dir="rtl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-stone-900 flex items-center gap-2.5">
            <Sliders className="text-[#5794ff]" size={24} />
            <span>إعدادات التجارة والتشغيل الفعلي</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            اضبط أسعار التوصيل في تونس، ورقم الواتساب للطلبيات، وتتبع الإعلانات (Meta Pixel)، وبوابات الدفع الإلكتروني.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-black px-4 py-2 rounded-lg border border-emerald-200">
            <Check size={16} className="text-emerald-600" />
            <span>تم حفظ الإعدادات وتحديثها في المتجر والسحابة!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. SHIPPING & DELIVERY SETTINGS */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">إعدادات الشحن والتوصيل في تونس</h3>
              <p className="text-xs text-stone-500 font-medium">تسعيرة التوصيل الثابتة وحد الشحن المجاني للحرفاء</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                تسعيرة التوصيل القياسية (د.ت)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.100"
                  min="0"
                  name="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-black text-stone-900 outline-none focus:bg-white focus:border-[#5794ff] focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="7.000"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">د.ت</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">تكلفة الشحن لجميع الولايات عبر شركة التوصيل (مثال: 7 د.ت أو 8 د.ت).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                شحن مجاني للطلبات فوق (د.ت)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-black text-stone-900 outline-none focus:bg-white focus:border-[#5794ff] focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="120"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">د.ت</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">يصبح الشحن مجانياً تلقائياً إذا تجاوزت سلة الحريف هذا المبلغ (ضع 0 لإلغائه).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                شركة الشحن والخدمة
              </label>
              <input
                type="text"
                name="shippingCompany"
                value={settings.shippingCompany}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:border-[#5794ff] focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Aramex / التوصيل السريع"
              />
              <p className="text-[11px] text-stone-400 mt-1">تظهر للحريف في صفحة الدفع وتفاصيل الفاتورة.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              مدة التوصيل المتوقعة
            </label>
            <input
              type="text"
              name="shippingEstimate"
              value={settings.shippingEstimate}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-medium text-stone-900 outline-none focus:bg-white focus:border-[#5794ff] focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="خلال 24 إلى 48 ساعة لكافة ولايات الجمهورية"
            />
          </div>
        </div>

        {/* 2. WHATSAPP & DIRECT ORDER CONFIRMATION */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">تأكيد ومتابعة الطلبيات عبر واتساب (WhatsApp)</h3>
              <p className="text-xs text-stone-500 font-medium">إرسال تفاصيل كل طلبية بنقرة واحدة إلى هاتفك مباشرة لتأكيدها مع الحريف</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رقم الواتساب لاستقبال الطلبات (مع الرمز الدولي 216)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="whatsappPhone"
                  value={settings.whatsappPhone}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-bold text-stone-900 outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all dir-ltr text-right"
                  placeholder="21693997226"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">يفتح محادثة واتساب فورية جاهزة بنص الطلب واسم الحريف ورقم هاتفه.</p>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="autoWhatsappNotification"
                name="autoWhatsappNotification"
                checked={settings.autoWhatsappNotification}
                onChange={handleChange}
                className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="autoWhatsappNotification" className="text-xs font-bold text-stone-800 cursor-pointer">
                عرض زر تأكيد الطلبية عبر واتساب للحريف فور إتمام الشراء
              </label>
            </div>
          </div>
        </div>

        {/* 3. META PIXEL & ADVERTISING TRACKING */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">تتبع الإعلانات والتحليلات (Meta Pixel / فيسبوك بيكسل)</h3>
              <p className="text-xs text-stone-500 font-medium">ربط معرّف البيكسل لتتبع النقرات وإتمام الشراء من الحملات الإعلانية الممولة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                معرّف Meta Pixel ID (فيسبوك)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="facebookPixelId"
                  value={settings.facebookPixelId}
                  onChange={handleChange}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-mono text-stone-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="مثال: 1234567890123456"
                />
                <button
                  type="button"
                  onClick={handleTestPixel}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2.5 rounded-lg text-xs font-bold transition-all border border-indigo-200 cursor-pointer whitespace-nowrap"
                >
                  اختبار البيكسل ⚡
                </button>
              </div>
              {testPixelSuccess && (
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  ✓ تم إرسال حدث تجريبي بنجاح إلى فيسبوك بيكسل!
                </span>
              )}
              <p className="text-[11px] text-stone-400 mt-1">
                يتتبع تلقائياً الأحداث التالية: PageView, ViewContent, AddToCart, Purchase.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                معرّف Google Analytics (G-XXXXX)
              </label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={handleChange}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm font-mono text-stone-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-[11px] text-stone-400 mt-1">لمعرفة عدد الزوار ومصادر الزيارات بدقة.</p>
            </div>
          </div>
        </div>

        {/* 4. PAYMENT METHODS & TUNISIAN PAYMENT GATEWAYS */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">طرق الدفع وبوابات الدفع التونسية</h3>
              <p className="text-xs text-stone-500 font-medium">الدفع عند الاستلام (COD) والبطاقات البنكية التونسية / e-Dinar</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* COD Option */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
              <input
                type="checkbox"
                id="enableCod"
                name="enableCod"
                checked={settings.enableCod}
                onChange={handleChange}
                className="w-5 h-5 rounded border-stone-300 text-[#5794ff] focus:ring-blue-500 mt-0.5 cursor-pointer"
              />
              <div>
                <label htmlFor="enableCod" className="text-sm font-black text-stone-900 cursor-pointer block">
                  الدفع عند الاستلام (Paiement à la livraison - COD)
                </label>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  الخيار المفضل والأكثر استخداماً في تونس (الحريف يدفع نقداً لمندوب التوصيل عند فتح الطرد). مفعل وموصى به دائماً.
                </p>
              </div>
            </div>

            {/* Online Payment Gateways */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableOnlinePayment"
                  name="enableOnlinePayment"
                  checked={settings.enableOnlinePayment}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="enableOnlinePayment" className="text-sm font-black text-stone-900 cursor-pointer block">
                    الدفع الإلكتروني بالبطاقات البنكية و e-Dinar (بوابات الدفع التونسية)
                  </label>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    قبول بطاقات CIB التونسية، البطاقات البنكية (Visa / MasterCard)، وبطاقة البريد التونسي e-Dinar.
                  </p>
                </div>
              </div>

              {settings.enableOnlinePayment && (
                <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      بوابة الدفع التونسية المختارة
                    </label>
                    <select
                      name="paymentGateway"
                      value={settings.paymentGateway}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-xs font-bold text-stone-800 outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      <option value="konnect">Konnect (الأسهل والأكثر دعماً في تونس)</option>
                      <option value="flouci">Flouci (محفظة رقمية وبطاقات بنكية)</option>
                      <option value="clicktopay">ClickToPay (بوابة البنوك التونسية الرسمية)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      مفتاح الربط (API Key / Wallet Key)
                    </label>
                    <input
                      type="password"
                      name="gatewayApiKey"
                      value={settings.gatewayApiKey || ''}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-xs font-mono text-stone-800 outline-none focus:border-indigo-600"
                      placeholder="أدخل مفتاح الـ API الخاص ببوابة الدفع"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      يمكنك الحصول عليه فور فتح حساب تاجر على Konnect.network أو Flouci.com.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-stone-500 font-medium">
            يتم حفظ الإعدادات تلقائياً وتفعيلها في واجهة المتجر وقاعدة البيانات.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#5794ff] hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isSaving ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>حفظ جميع الإعدادات 💾</span>
          </button>
        </div>
      </form>
    </div>
  );
}
