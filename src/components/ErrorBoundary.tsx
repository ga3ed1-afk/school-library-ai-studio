import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('app_products');
      localStorage.removeItem('oxford_orders');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || '';
      const isRateExceeded =
        errorMessage.toLowerCase().includes('rate') ||
        errorMessage.toLowerCase().includes('quota') ||
        errorMessage.toLowerCase().includes('resource_exhausted') ||
        errorMessage.toLowerCase().includes('429');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900" dir="rtl">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              {isRateExceeded ? 'تم تجاوز حد الطلبات مؤقتاً' : 'حدث خطأ غير متوقع'}
            </h1>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {isRateExceeded
                ? 'وصلت خوادم الخدمة أو الاستعلامات إلى حد الاستخدام المؤقت (Rate exceeded). يرجى الانتظار لبضع ثوانٍ ثم النقر على زر التحديث أدناه.'
                : 'حدث تعذر أثناء تحميل الصفحة. يمكنك إعادة تحميل المتجر أو استعادة الحالة الافتراضية.'}
            </p>

            {errorMessage && (
              <div className="bg-slate-100 rounded-xl p-3.5 mb-6 text-xs text-slate-700 font-mono text-left max-h-24 overflow-y-auto border border-slate-200" dir="ltr">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#5794ff] hover:bg-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط المتجر</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
