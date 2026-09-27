import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  FileSpreadsheet,
  UploadCloud,
  Download,
  FileText,
  SlidersHorizontal,
  RefreshCw,
  ChevronDown,
  CheckSquare,
  Check,
  Eye,
  Folder,
  Menu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../constants';
import { Product, CsvBatchInfo } from '../types';
import { productService } from '../services/productService';
import { orderService, CustomerOrder } from '../services/orderService';
import {
  parseCsvRows,
  autoDetectColumnMapping,
  convertRowsToProducts,
  CSV_FIELDS
} from '../utils/csvParser';

const data = [
  { name: 'يناير', sales: 4000, orders: 240 },
  { name: 'فبراير', sales: 3000, orders: 198 },
  { name: 'مارس', sales: 2000, orders: 150 },
  { name: 'أبريل', sales: 2780, orders: 210 },
  { name: 'مايو', sales: 1890, orders: 120 },
  { name: 'يونيو', sales: 2390, orders: 170 },
];

const recentOrders = [
  { id: '#ORD-7281', customer: 'أحمد بن علي', date: '2024-03-20', total: 125.500, status: 'تم التوصيل' },
  { id: '#ORD-7282', customer: 'سارة محمد', date: '2024-03-21', total: 45.000, status: 'قيد المعالجة' },
  { id: '#ORD-7283', customer: 'ياسين بن عمر', date: '2024-03-21', total: 89.900, status: 'تم الشحن' },
  { id: '#ORD-7284', customer: 'ليلى بن صالح', date: '2024-03-22', total: 210.000, status: 'قيد المعالجة' },
];

export const COLOR_PRESETS = [
  { name: 'Noir', label: 'Noir (أسود)', bg: '#111827' },
  { name: 'Rouge', label: 'Rouge (أحمر)', bg: '#DC2626' },
  { name: 'Vert', label: 'Vert (أخضر)', bg: '#16A34A' },
  { name: 'Bleu', label: 'Bleu (أزرق)', bg: '#2563EB' },
  { name: 'Blanc', label: 'Blanc (أبيض)', bg: '#FFFFFF' },
  { name: 'Jaune', label: 'Jaune (أصفر)', bg: '#EAB308' },
  { name: 'Gris', label: 'Gris (رمادي)', bg: '#6B7280' },
  { name: 'Marron', label: 'Marron (بني)', bg: '#78350F' },
  { name: 'Rose', label: 'Rose (وردي)', bg: '#EC4899' },
  { name: 'Orange', label: 'Orange (برتقالي)', bg: '#EA580C' },
  { name: 'Violet', label: 'Violet (بنفسجي)', bg: '#9333EA' },
];

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'add-product' | 'products-grid' | 'cart' | 'checkout' | 'edit-product' | 'order-details' | 'wishlist' | 'calendar' | 'gallery' | 'alerts' | 'projects' | 'mockups'>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    setSearchParams({ tab });
    setIsMobileMenuOpen(false);
  };

  const [products, setProducts] = useState<Product[]>(productService.getProducts());
  const [orders, setOrders] = useState<CustomerOrder[]>(orderService.getOrders());
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const editImageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];
    const files = Array.from(e.target.files || []).filter(file => allowedTypes.includes((file as File).type)) as File[];
    
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(base64Strings => {
        if (isEdit && editingProduct) {
          const currentImages = editingProduct.images || [];
          const newImages = [...currentImages, ...base64Strings];
          setEditingProduct({ 
            ...editingProduct, 
            image: newImages[0],
            images: newImages 
          });
        } else {
          const currentImages = newProduct.images || [];
          const newImages = [...currentImages, ...base64Strings];
          setNewProduct({ 
            ...newProduct, 
            image: newImages[0],
            images: newImages 
          });
        }
      });
    }
  };

  const removeImage = (index: number, isEdit: boolean) => {
    if (isEdit && editingProduct) {
      const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
      setEditingProduct({
        ...editingProduct,
        image: newImages[0] || '',
        images: newImages
      });
    } else {
      const newImages = (newProduct.images || []).filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        image: newImages[0] || '',
        images: newImages
      });
    }
  };

  const initialProductState: Omit<Product, 'id'> = {
    sku: '',
    name: '',
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    notes: '',
    merchantPrice: 0,
    discount: 0,
    compareAtPrice: 0,
    description: '',
    image: '',
    images: [],
    category: 'اللوازم المدرسية',
    size: 'حجم مدمج',
    sizes: ['حجم قياسي', 'حجم كبير (XL)', 'حجم مدمج'],
    style: 'طقم إضافي',
    styles: ['طراز قياسي', 'طراز بريميوم', 'طقم إضافي'],
    brand: 'أكسفورد سيتي',
    colors: ['Noir', 'Rouge', 'Vert', 'Bleu'],
    productType: '',
    weight: '',
    features: '',
    bulletPoints: [],
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '12:00',
    publishStatus: 'منشور',
    tags: ['أدوات مكتبية', 'لوازم مدرسية'],
    availability: 'متوفر',
    rating: 5,
    reviewsCount: 65,
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ text: string, productId?: number } | null>(null);

  // CSV Import State
  const [addProductMode, setAddProductMode] = useState<'manual' | 'csv'>('manual');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [csvRawRows, setCsvRawRows] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvDelimiter, setCsvDelimiter] = useState<string>(',');
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});
  const [showColumnMapper, setShowColumnMapper] = useState<boolean>(false);
  const [parsedCsvProducts, setParsedCsvProducts] = useState<Omit<Product, 'id'>[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearProductsModal, setShowClearProductsModal] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [csvModalTab, setCsvModalTab] = useState<'files' | 'options' | 'pick_items'>('files');
  const [csvModalSearch, setCsvModalSearch] = useState('');
  const [csvFilterActive, setCsvFilterActive] = useState(false);
  const [selectedCsvBatchFilter, setSelectedCsvBatchFilter] = useState<string | null>(null);


  React.useEffect(() => {
    const handleUpdate = () => {
      setProducts(productService.getProducts());
    };
    const handleOrdersUpdate = () => {
      setOrders(orderService.getOrders());
    };
    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('orders_updated', handleOrdersUpdate);
    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('orders_updated', handleOrdersUpdate);
    };
  }, []);

  const toggleNewProductColor = (colorName: string) => {
    setNewProduct(prev => {
      const current = prev.colors || [];
      const exists = current.some(c => c.trim().toLowerCase() === colorName.trim().toLowerCase());
      const updated = exists
        ? current.filter(c => c.trim().toLowerCase() !== colorName.trim().toLowerCase())
        : [...current, colorName];
      return { ...prev, colors: updated };
    });
  };

  const toggleEditProductColor = (colorName: string) => {
    if (!editingProduct) return;
    setEditingProduct(prev => {
      if (!prev) return prev;
      const current = prev.colors || [];
      const exists = current.some(c => c.trim().toLowerCase() === colorName.trim().toLowerCase());
      const updated = exists
        ? current.filter(c => c.trim().toLowerCase() !== colorName.trim().toLowerCase())
        : [...current, colorName];
      return { ...prev, colors: updated };
    });
  };

  const allCategoryOptions = React.useMemo(() => {
    const set = new Set<string>();
    categories.forEach(c => set.add(c.name));
    products.forEach(p => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [products]);

  const handleQuickCategoryChange = (productId: number, newCategory: string) => {
    const currentProducts = productService.getProducts();
    const target = currentProducts.find(p => p.id === productId);
    if (!target) return;
    const updated = { ...target, category: newCategory };
    productService.updateProduct(updated);
    setProducts(productService.getProducts());
  };

  const handleAddProduct = () => {
    const sanitized: Omit<Product, 'id'> = {
      ...newProduct,
      price: Number(newProduct.price) || 0,
      compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : 0,
      minPrice: newProduct.minPrice !== undefined && newProduct.minPrice !== '' ? Number(newProduct.minPrice) : undefined,
      maxPrice: newProduct.maxPrice !== undefined && newProduct.maxPrice !== '' ? Number(newProduct.maxPrice) : undefined,
      discount: Number(newProduct.discount) || 0,
      reviewsCount: Number(newProduct.reviewsCount) || 65,
      rating: Number(newProduct.rating) || 5,
    };
    const added = productService.addProduct(sanitized);
    setProducts(productService.getProducts());
    setNewProduct(initialProductState);
    setSuccessMessage({ text: 'تم إضافة المنتج بنجاح!', productId: added.id });
    setActiveTab('products');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    const sanitized: Product = {
      ...editingProduct,
      price: Number(editingProduct.price) || 0,
      compareAtPrice: editingProduct.compareAtPrice ? Number(editingProduct.compareAtPrice) : 0,
      minPrice: editingProduct.minPrice !== undefined && editingProduct.minPrice !== '' ? Number(editingProduct.minPrice) : undefined,
      maxPrice: editingProduct.maxPrice !== undefined && editingProduct.maxPrice !== '' ? Number(editingProduct.maxPrice) : undefined,
      discount: Number(editingProduct.discount) || 0,
      reviewsCount: Number(editingProduct.reviewsCount) || 65,
      rating: Number(editingProduct.rating) || 5,
    };
    productService.updateProduct(sanitized);
    setProducts(productService.getProducts());
    setSuccessMessage({ text: 'تم تحديث المنتج بنجاح!', productId: editingProduct.id });
    setEditingProduct(null);
    setActiveTab('products');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleCsvFileUpload = (file: File) => {
    setCsvError(null);
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setCsvError('الملف المرفوع فارغ، يرجى اختيار ملف CSV صالح.');
          return;
        }

        setCsvRawText(text);
        const { rows, delimiterUsed } = parseCsvRows(text);
        if (rows.length < 2) {
          setCsvError('يجب أن يحتوي ملف CSV على سطر العناوين وسطر بيانات واحد على الأقل.');
          return;
        }

        const headers = rows[0];
        setCsvRawRows(rows);
        setCsvHeaders(headers);
        setCsvDelimiter(delimiterUsed);

        const detected = autoDetectColumnMapping(headers);
        setColumnMapping(detected);

        const products = convertRowsToProducts(rows, detected);
        setParsedCsvProducts(products);

        if (products.length === 0 || detected['name'] === undefined) {
          setShowColumnMapper(true);
          setCsvError('تنبيه: يرجى تحديد عمود "اسم المنتج" من لوحة مطابقة الأعمدة أدناه لاستخراج المنتجات بدقة.');
        } else {
          setCsvError(null);
        }
      } catch (err: any) {
        setCsvError('حدث خطأ أثناء معالجة ملف CSV: ' + (err.message || 'يرجى التحقق من صحة الملف'));
      }
    };
    reader.readAsText(file);
  };

  const handleDelimiterChange = (newDelim: string) => {
    if (!csvRawText) return;
    setCsvDelimiter(newDelim);
    const { rows } = parseCsvRows(csvRawText, newDelim);
    if (rows.length >= 2) {
      const headers = rows[0];
      setCsvRawRows(rows);
      setCsvHeaders(headers);
      const detected = autoDetectColumnMapping(headers);
      setColumnMapping(detected);
      const products = convertRowsToProducts(rows, detected);
      setParsedCsvProducts(products);
      if (products.length > 0) {
        setCsvError(null);
      }
    }
  };

  const handleMappingChange = (fieldId: string, colIdx: number) => {
    const updated = { ...columnMapping };
    if (colIdx === -1) {
      delete updated[fieldId];
    } else {
      updated[fieldId] = colIdx;
    }
    setColumnMapping(updated);
    if (csvRawRows.length > 0) {
      const products = convertRowsToProducts(csvRawRows, updated);
      setParsedCsvProducts(products);
      if (products.length > 0) {
        setCsvError(null);
      }
    }
  };

  const handleResetAutoMapping = () => {
    if (csvHeaders.length === 0 || csvRawRows.length === 0) return;
    const detected = autoDetectColumnMapping(csvHeaders);
    setColumnMapping(detected);
    const products = convertRowsToProducts(csvRawRows, detected);
    setParsedCsvProducts(products);
    if (products.length > 0) {
      setCsvError(null);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = "رمز المنتج;اسم المنتج;النوع/الحجم;السعر;السعر الأدنى (د.ت);السعر الأقصى (د.ت);الفئة;الوصف;ملاحظات;الماركة;رابط الصورة;حالة التوفر\n" +
      "OXF-2001;دفتر ملاحظات فاخر A5 مقوى;A5 - 160 صفحة;18.500;16.000;22.000;اللوازم المدرسية;دفتر مسطر بغلاف جلدي أنيق مناسب للكتابة اليومية والتدوين;ورق عالي الجودة 90 غرام خالي من الأحماض;أكسفورد;https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800;متوفر\n" +
      "OXF-2002;طقم أقلام حبر جاف فائق الدقة;علبة 10 ألوان;14.200;12.500;16.000;أدوات مكتبية;مجموعة أقلام ملونة ممتازة للتدوين والتنظيم والخرائط الذهنية;حبر تدفق ثابت ضد التلطخ يدوم طويلاً;بايلوت;https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800;متوفر\n" +
      "OXF-2003;حقيبة مدرسية طبية مع مقصورة لابتوب;حجم كبير 32L;78.000;70.000;85.000;حقائب وأمتعة;حقيبة ظهر مريحة مع دعامة طبية للظهر ومقاومة للماء;مزودة ببطانة هوائية وأشرطة أمان ليلية;أكسفورد;https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800;متوفر\n" +
      "OXF-2004;علبة ألوان مائية فنية احترافية;طقم 36 لون;32.000;28.000;36.000;الفنون الجميلة;ألوان مائية نقية وعالية الصباغ للرسم والتصميم;تشمل فرشاة مائية مدمجة وباليت للمزج;كوه-إي-نور;https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800;متوفر";

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'نموذج_منتجات_أكسفورد.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteCsvImport = () => {
    if (parsedCsvProducts.length === 0) return;
    setIsImporting(true);
    const fileName = csvFile?.name || `ملف_منتجات_${new Date().toISOString().slice(0, 10)}.csv`;
    const batchId = `batch_${Date.now()}`;
    const importedAt = new Date().toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('ar-TN');

    const created = productService.addProductsBulk(parsedCsvProducts, {
      fileName,
      batchId,
      importedAt
    });
    setProducts(productService.getProducts());
    setSuccessMessage({ text: `تم استيراد ${created.length} منتج بنجاح من الملف "${fileName}"!` });
    setParsedCsvProducts([]);
    setCsvFile(null);
    setIsImporting(false);
    setActiveTab('products');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'merchantPrice' || name === 'discount' || name === 'minPrice' || name === 'maxPrice' ? parseFloat(value) || 0 : value
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' || name === 'merchantPrice' || name === 'discount' || name === 'minPrice' || name === 'maxPrice' ? parseFloat(value) || 0 : value
    });
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'ملغي' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;

  const stats = [
    { title: 'إجمالي المبيعات', value: `${totalSales.toFixed(3)} د.ت`, change: '+12.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'إجمالي الطلبات', value: totalOrdersCount.toString(), change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'إجمالي المنتجات', value: products.length.toString(), change: '+2', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'إجمالي العملاء', value: Math.max(1, new Set(orders.map(o => o.phone || o.customer)).size).toString(), change: '+15.3%', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const csvProducts = products.filter(p => productService.isCsvProduct(p));
  const csvBatches = productService.getCsvBatches();

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCsvFilter = !csvFilterActive || productService.isCsvProduct(p);
    const matchesBatchFilter = !selectedCsvBatchFilter || 
      p.csvBatchId === selectedCsvBatchFilter || 
      p.csvFileName === selectedCsvBatchFilter ||
      (selectedCsvBatchFilter === 'batch_legacy' && (!p.csvBatchId || p.csvBatchId === 'batch_legacy'));
    return matchesSearch && matchesCsvFilter && matchesBatchFilter;
  });

  const handleToggleSelectProduct = (id: number) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectCsvOnly = () => {
    const csvIds = csvProducts.map(p => p.id);
    setSelectedProductIds(csvIds);
    setSuccessMessage({ text: `تم تحديد ${csvIds.length} منتج مستورد عبر CSV.` });
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteCsvBatch = (batch: CsvBatchInfo) => {
    const count = productService.deleteCsvBatch(batch.batchId);
    setProducts(productService.getProducts());
    if (selectedCsvBatchFilter === batch.batchId) {
      setSelectedCsvBatchFilter(null);
    }
    setSelectedProductIds(prev => prev.filter(id => productService.getProducts().some(p => p.id === id)));
    setShowClearProductsModal(false);
    setSuccessMessage({ text: `تم مسح جميع منتجات الملف "${batch.fileName}" (${count} منتج) بنجاح!` });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleClearSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    productService.deleteProductsBulk(selectedProductIds);
    setProducts(productService.getProducts());
    setSelectedProductIds([]);
    setShowClearProductsModal(false);
    setSuccessMessage({ text: `تم مسح ${count} منتج تم تحديده بنجاح!` });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleClearCsvProductsOnly = () => {
    const count = productService.deleteCsvProductsOnly();
    setProducts(productService.getProducts());
    setSelectedProductIds(prev => prev.filter(id => productService.getProducts().some(p => p.id === id)));
    setShowClearProductsModal(false);
    setSuccessMessage({ text: `تم مسح ${count} منتج من ملفات CSV بنجاح، مع بقاء المنتجات الأصلية واليدوية!` });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteProductDirect = (product: Product) => {
    productService.deleteProduct(product.id);
    setProducts(productService.getProducts());
    setSelectedProductIds(prev => prev.filter(id => id !== product.id));
    setSuccessMessage({ text: `تم مسح المنتج "${product.name}" بنجاح.` });
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleClearAllProducts = () => {
    productService.clearAllProducts();
    setProducts([]);
    setSelectedProductIds([]);
    setSuccessMessage({ text: 'تم مسح وتفريغ كافة المنتجات بنجاح!' });
    setShowClearProductsModal(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetToDefaultProducts = () => {
    productService.resetToInitialProducts();
    setProducts(productService.getProducts());
    setSelectedProductIds([]);
    setSuccessMessage({ text: 'تمت استعادة المنتجات الافتراضية بنجاح!' });
    setShowClearProductsModal(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };


  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans" dir="rtl">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Desktop permanent, Mobile off-canvas drawer) */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-white shadow-2xl overflow-y-auto flex-shrink-0 border-l border-gray-200 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:z-auto md:shadow-xl md:w-80
        ${isMobileMenuOpen ? 'translate-x-0 block' : 'translate-x-full md:translate-x-0 hidden md:block'}
      `}>
        <div className="p-4 sm:p-5 text-xl sm:text-2xl font-bold text-oxford-blue border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-cubes"></i> <span>إكسترا</span>
          </div>
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            title="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 text-sm">
          {/* MAIN STACK / DASHBOARDS */}
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1"><i className="fas fa-circle text-[6px]"></i> الرئيسية</div>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => handleTabChange('overview')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-chart-line w-5"></i> <span>نظرة عامة</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('products')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-list w-5"></i> <span>قائمة المنتجات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('products-grid')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'products-grid' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-th-large w-5"></i> <span>شبكة المنتجات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('orders')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-truck w-5"></i> <span>الطلبات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('cart')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'cart' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-shopping-cart w-5"></i> <span>سلة التسوق</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('checkout')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'checkout' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-credit-card w-5"></i> <span>إتمام الشراء</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1"><i className="fas fa-circle text-[6px]"></i> المنتجات</div>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => handleTabChange('add-product')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'add-product' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-plus-circle w-5"></i> <span>إضافة منتج</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('edit-product')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'edit-product' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-edit w-5"></i> <span>تعديل منتج</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('order-details')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'order-details' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-file-invoice w-5"></i> <span>تفاصيل الطلب</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('wishlist')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'wishlist' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-heart w-5"></i> <span>المفضلة</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1"><i className="fas fa-circle text-[6px]"></i> تطبيقات</div>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => handleTabChange('calendar')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-calendar-alt w-5"></i> <span>التقويم الكامل</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('gallery')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'gallery' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-images w-5"></i> <span>معرض الصور</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('alerts')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'alerts' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-bell w-5"></i> <span>تنبيهات</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('projects')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'projects' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-project-diagram w-5"></i> <span>المشاريع</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('mockups')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'mockups' ? 'bg-oxford-blue/10 text-oxford-blue font-bold' : 'hover:bg-stone-50 text-gray-700'}`}
                >
                  <i className="fas fa-book-open w-5"></i> <span>نماذج العرض (Mockups)</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="mt-auto pt-4 border-t border-stone-100">
            <a href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-oxford-red/10 text-oxford-red font-bold">
              <i className="fas fa-sign-out-alt w-5"></i> <span>العودة للمتجر</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
        {/* Mobile Top Navigation Header */}
        <div className="md:hidden sticky top-0 z-30 -mt-4 -mx-4 mb-4 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-stone-200 flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5 font-bold text-xs cursor-pointer active:scale-95"
            title="فتح القائمة الجانبية"
          >
            <Menu size={18} className="text-oxford-blue" />
            <span>القائمة</span>
          </button>

          <div className="flex items-center gap-1.5 text-center">
            <span className="font-black text-sm text-oxford-blue">لوحة التحكم</span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
              {activeTab === 'overview' && 'نظرة عامة'}
              {activeTab === 'products' && 'قائمة المنتجات'}
              {activeTab === 'products-grid' && 'شبكة المنتجات'}
              {activeTab === 'orders' && 'الطلبات'}
              {activeTab === 'cart' && 'سلة التسوق'}
              {activeTab === 'checkout' && 'إتمام الشراء'}
              {activeTab === 'add-product' && 'إضافة منتج'}
              {activeTab === 'edit-product' && 'تعديل منتج'}
              {activeTab === 'order-details' && 'تفاصيل الطلب'}
              {activeTab === 'wishlist' && 'المفضلة'}
              {activeTab === 'calendar' && 'التقويم'}
              {activeTab === 'gallery' && 'معرض الصور'}
              {activeTab === 'alerts' && 'تنبيهات'}
              {activeTab === 'projects' && 'المشاريع'}
              {activeTab === 'mockups' && 'نماذج العرض'}
            </span>
          </div>

          <Link
            to="/"
            className="text-xs font-bold text-oxford-red hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span>المتجر ←</span>
          </Link>
        </div>
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4"
            >
              <i className="fas fa-check-circle"></i>
              <span className="font-bold">{successMessage.text}</span>
              {successMessage.productId && (
                <Link 
                  to={`/product/${successMessage.productId}`} 
                  target="_blank"
                  className="bg-white text-emerald-500 px-4 py-1 rounded-lg text-sm font-black hover:bg-emerald-50 transition-all"
                >
                  عرض المنتج على الموقع
                </Link>
              )}
              <button onClick={() => setSuccessMessage(null)} className="hover:opacity-70">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="max-w-[1400px] mx-auto">
          {/* Header removed */}

        {activeTab === 'mockups' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Magazine Mockup Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-oxford-blue">نموذج مجلة احترافي</h2>
                  <p className="text-stone-400 font-bold">عرض عالي الجودة للعلامة التجارية</p>
                </div>
                <button className="bg-oxford-blue text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-oxford-red transition-all shadow-lg shadow-oxford-blue/20">
                  تحميل النموذج (PSD)
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-4 rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden group">
                  <div className="relative aspect-[3/2] rounded-[2rem] overflow-hidden bg-stone-50">
                    <img 
                      src="https://elements-resized.envatousercontent.com/elements-preview-images/9c9118f7-76d3-4f6c-a576-3febb6d95d3e?w=1200&cf_fit=scale-down&q=85&format=auto&s=05144715c1ca2304567841000ba1431c64f171a12a62ccabb89e9ac2b6091490" 
                      alt="Magazine Mockup Main" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-oxford-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                      <div className="text-white">
                        <span className="bg-oxford-red px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Premium Mockup</span>
                        <h3 className="text-4xl font-black">مجلة العلامة التجارية v2.0</h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "41d4b44e-8968-44b8-9b2d-a04141a26004",
                      "0deb26ef-5cf4-428e-90cc-c677e1734153",
                      "2a46c7dd-3a83-44ae-97cb-4160e065ba85",
                      "3c397d7a-b7c3-4e8c-85ea-3fa0671bd17f"
                    ].map((id, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-stone-50">
                          <img 
                            src={`https://elements-resized.envatousercontent.com/elements-preview-images/${id}?w=400&cf_fit=scale-down&q=85&format=auto`} 
                            alt={`Magazine Detail ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-oxford-blue p-8 rounded-[2rem] text-white">
                    <h4 className="font-black text-xl mb-4">المواصفات التقنية</h4>
                    <ul className="space-y-3 text-sm font-bold text-white/70">
                      <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400"></i> دقة عالية 4000x3000 بكسل</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400"></i> طبقات ذكية (Smart Objects)</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400"></i> خلفية قابلة للتغيير</li>
                      <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400"></i> تأثيرات إضاءة واقعية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Books Mockup Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-oxford-blue">نماذج الكتب</h2>
                <p className="text-stone-400 font-bold">مجموعة متنوعة من تصاميم الكتب</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Arabic Book */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 group hover:shadow-xl transition-all">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-50 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800" 
                      alt="Arabic Book Mockup" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-oxford-blue text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">عربي</div>
                  </div>
                  <h3 className="text-xl font-black text-oxford-blue mb-2">نموذج كتاب عربي</h3>
                  <p className="text-stone-400 text-sm font-bold mb-6">تصميم كلاسيكي للكتب العربية مع تجليد فاخر.</p>
                  <button className="w-full py-4 bg-stone-50 text-oxford-blue rounded-xl font-black text-sm hover:bg-oxford-blue hover:text-white transition-all">
                    تخصيص التصميم
                  </button>
                </div>

                {/* French Book */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 group hover:shadow-xl transition-all">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-50 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800" 
                      alt="French Book Mockup" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-oxford-red text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Français</div>
                  </div>
                  <h3 className="text-xl font-black text-oxford-blue mb-2">نموذج كتاب فرنسي</h3>
                  <p className="text-stone-400 text-sm font-bold mb-6">تصميم عصري للروايات والكتب الفرنسية.</p>
                  <button className="w-full py-4 bg-stone-50 text-oxford-blue rounded-xl font-black text-sm hover:bg-oxford-blue hover:text-white transition-all">
                    تخصيص التصميم
                  </button>
                </div>

                {/* Religious Book */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 group hover:shadow-xl transition-all">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-50 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1585241936939-be4099591252?q=80&w=800" 
                      alt="Religious Book Mockup" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">ديني</div>
                  </div>
                  <h3 className="text-xl font-black text-oxford-blue mb-2">نموذج كتاب ديني</h3>
                  <p className="text-stone-400 text-sm font-bold mb-6">تصميم وقور للكتب الدينية والمصاحف.</p>
                  <button className="w-full py-4 bg-stone-50 text-oxford-blue rounded-xl font-black text-sm hover:bg-oxford-blue hover:text-white transition-all">
                    تخصيص التصميم
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 group hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon size={28} />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                      <ArrowUpRight size={14} />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-stone-500 font-bold text-sm uppercase tracking-widest mb-2">{stat.title}</h3>
                  <p className="text-3xl font-black text-oxford-blue">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-oxford-blue">إحصائيات المبيعات</h3>
                  <select className="bg-stone-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none">
                    <option>آخر 6 أشهر</option>
                    <option>آخر سنة</option>
                  </select>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#142C73" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#142C73" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12, fontWeight: 'bold'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#142C73" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-oxford-blue">أحدث الطلبات</h3>
                  <span className="text-xs font-bold text-stone-400">{orders.length} طلبات</span>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => {
                        setSelectedOrder(order);
                        setActiveTab('order-details');
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-oxford-blue font-bold text-xs">
                          {order.id.replace('#ORD-', '')}
                        </div>
                        <div>
                          <p className="font-black text-oxford-blue group-hover:text-oxford-red transition-colors">{order.customer}</p>
                          <p className="text-xs text-stone-400 font-bold">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-oxford-blue mb-1">{order.total.toFixed(3)} د.ت</p>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                          order.status === 'تم التوصيل' ? 'bg-emerald-50 text-emerald-600' : 
                          order.status === 'تم الشحن' ? 'bg-blue-50 text-blue-600' : 
                          order.status === 'ملغي' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="w-full mt-6 py-3 text-oxford-blue font-black text-sm hover:bg-stone-50 rounded-xl transition-all cursor-pointer border border-stone-200"
                >
                  عرض جميع الطلبات ({orders.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xs border border-stone-200 overflow-hidden"
          >
            {/* Extremely compact banner/header for products list */}
            <div className="p-2.5 sm:px-4 sm:py-2 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/40">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ابحث عن منتج بالاسم أو الفئة أو SKU..." 
                  className="w-full bg-white border border-stone-200 rounded-lg py-1.5 pr-9 pl-3 text-xs focus:border-oxford-blue outline-none transition-all font-normal text-stone-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedProductIds.length > 0 ? (
                  <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
                    <span className="text-xs font-bold text-red-700">
                      محدد ({selectedProductIds.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSelectedProducts}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="مسح المنتجات المحددة"
                    >
                      <Trash2 size={11} />
                      <span>مسح المحدد</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProductIds([])}
                      className="text-stone-500 hover:text-stone-800 text-[11px] px-1 cursor-pointer font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-stone-400 font-normal ml-1">
                      إجمالي المنتجات: {filteredProducts.length}
                    </span>
                    {csvProducts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCsvFilterActive(!csvFilterActive)}
                        className={`text-xs px-2 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                          csvFilterActive 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                        title="تصفية لعرض منتجات CSV فقط"
                      >
                        منتجات CSV ({csvProducts.length})
                      </button>
                    )}
                  </>
                )}

                {/* شارة التصفية بحسب ملف CSV محدد */}
                {selectedCsvBatchFilter && (
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-2 py-1 rounded-lg text-xs font-semibold">
                    <FileSpreadsheet size={13} className="text-blue-600 shrink-0" />
                    <span className="truncate max-w-[140px]">
                      الملف: {csvBatches.find(b => b.batchId === selectedCsvBatchFilter)?.fileName || 'الملف المختار'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCsvBatchFilter(null)}
                      className="text-blue-500 hover:text-blue-800 p-0.5 rounded cursor-pointer mr-0.5"
                      title="إلغاء التصفية بالملف"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* زر ملفات CSV المرفوعة */}
                {csvBatches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCsvModalTab('files');
                      setShowClearProductsModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-lg transition-all text-xs font-semibold cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    title="فصل ومسح كل ملف CSV على حدة"
                  >
                    <Folder size={13} className="text-blue-600 shrink-0" />
                    <span>ملفات CSV ({csvBatches.length})</span>
                  </button>
                )}

                {/* زر خيارات مسح CSV */}
                <button
                  type="button"
                  onClick={() => {
                    setCsvModalTab('files');
                    setShowClearProductsModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 rounded-lg transition-all text-xs font-semibold cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                  title="خيارات مسح منتجات CSV حسب الملف أو بالاختيار"
                >
                  <Trash2 size={13} className="text-red-500 shrink-0" />
                  <span className="whitespace-nowrap">مسح بالملف / CSV</span>
                </button>

                {csvProducts.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleSelectCsvOnly}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-all text-xs cursor-pointer"
                    title="تحديد واختيار كل منتجات CSV"
                  >
                    <CheckSquare size={13} className="text-oxford-blue" />
                    <span className="text-[11px]">تحديد CSV ({csvProducts.length})</span>
                  </button>
                )}

                {/* زر حالة المزامنة مع Firebase */}
                <button
                  type="button"
                  onClick={async () => {
                    setSuccessMessage({ text: 'جارٍ المزامنة السحابية مع Firebase...' });
                    const res = await productService.syncWithFirestore();
                    await orderService.syncWithFirestore();
                    setSuccessMessage({ text: `تمت المزامنة بنجاح مع Firebase Firestore (${res.syncedCount} منتج متزامن)!` });
                    setTimeout(() => setSuccessMessage(null), 3500);
                  }}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-lg transition-all text-xs font-semibold cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                  title="الضغط للمزامنة الفورية مع قاعدة بيانات Firebase Firestore السحابية"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Firebase سحابي</span>
                </button>

                <button className="p-1.5 bg-white border border-stone-200 text-stone-500 rounded-lg hover:bg-stone-50 transition-all text-xs" title="فلترة">
                  <Filter size={15} />
                </button>
                <button className="p-1.5 bg-white border border-stone-200 text-stone-500 rounded-lg hover:bg-stone-50 transition-all text-xs">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-stone-50/80 text-stone-500 font-light border-b border-stone-100">
                    <th className="px-3 py-2.5 w-10 text-center">
                      <input 
                        type="checkbox"
                        className="rounded border-stone-300 text-oxford-blue focus:ring-oxford-blue/20 cursor-pointer"
                        checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={handleSelectAllFiltered}
                        title="تحديد أو إلغاء تحديد الكل"
                      />
                    </th>
                    <th className="px-4 py-2.5 font-normal">المنتج</th>
                    <th className="px-4 py-2.5 font-normal">الفئة</th>
                    <th className="px-4 py-2.5 font-normal">السعر</th>
                    <th className="px-4 py-2.5 font-normal">المخزون</th>
                    <th className="px-4 py-2.5 font-normal">الحالة</th>
                    <th className="px-4 py-2.5 text-left font-normal">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    const isCsv = productService.isCsvProduct(product);
                    return (
                    <tr key={product.id} className={`transition-colors group ${isSelected ? 'bg-oxford-blue/5' : 'hover:bg-stone-50/40'}`}>
                      <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          className="rounded border-stone-300 text-oxford-blue focus:ring-oxford-blue/20 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleToggleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-9 h-9 rounded-md object-cover border border-stone-100 shrink-0" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-normal text-stone-800 text-xs group-hover:text-oxford-red transition-colors">{product.name}</span>
                              {isCsv && (
                                <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                                  CSV
                                </span>
                              )}
                              {product.csvFileName && (
                                <span 
                                  className="text-[9px] bg-blue-50 text-blue-700 font-medium px-1.5 py-0.2 rounded border border-blue-200/80 truncate max-w-[120px]"
                                  title={`مستورد من ملف: ${product.csvFileName}`}
                                >
                                  {product.csvFileName}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-stone-400 font-light">
                                رمز: {product.sku || `OXF-${String(product.id).padStart(4, '0')}`}
                              </span>
                              {product.size && (
                                <span className="text-[10px] bg-stone-100 text-stone-600 px-1 py-0.2 rounded font-light border border-stone-200">
                                  {product.size}
                                </span>
                              )}
                              {product.notes && (
                                <span className="text-[10px] text-stone-400 font-light truncate max-w-[140px]" title={product.notes}>
                                  {product.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative inline-flex items-center group/cat">
                          <select
                            value={product.category || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '__NEW__') {
                                const customCat = window.prompt('أدخل اسم التصنيف الجديد:');
                                if (customCat && customCat.trim()) {
                                  handleQuickCategoryChange(product.id, customCat.trim());
                                }
                              } else {
                                handleQuickCategoryChange(product.id, val);
                              }
                            }}
                            className="appearance-none bg-stone-100/80 hover:bg-stone-200/90 text-stone-700 hover:text-stone-900 border border-stone-200/80 hover:border-stone-300 rounded px-2 py-0.5 pl-5 text-[11px] font-normal outline-none transition-all cursor-pointer focus:ring-1 focus:ring-oxford-blue focus:border-oxford-blue focus:bg-white max-w-[150px] truncate"
                            title="انقر لاختيار أو تغيير التصنيف مباشرة"
                          >
                            <option value="" disabled className="text-stone-400">-- اختر تصنيفاً --</option>
                            {allCategoryOptions.map((catName) => (
                              <option key={catName} value={catName}>
                                {catName}
                              </option>
                            ))}
                            <option value="__NEW__" className="text-oxford-blue font-bold">
                              ➕ إضافة تصنيف جديد...
                            </option>
                          </select>
                          <ChevronDown 
                            size={11} 
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 text-stone-400 group-hover/cat:text-stone-600 pointer-events-none transition-colors" 
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-normal text-oxford-red text-xs">{product.price.toFixed(3)} د.ت</div>
                        {(product.minPrice || product.maxPrice) && (
                          <div className="text-[9px] font-light text-stone-400">
                            {product.minPrice ? `${product.minPrice.toFixed(3)}` : '—'} - {product.maxPrice ? `${product.maxPrice.toFixed(3)} د.ت` : '—'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 font-light text-stone-500 text-xs">24 قطعة</td>
                      <td className="px-4 py-2">
                        <span className="flex items-center gap-1 text-emerald-600 font-light text-[11px]">
                          <CheckCircle size={12} />
                          متوفر
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              setActiveTab('edit-product');
                            }}
                            className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                            title="تعديل المنتج"
                          >
                            <Edit size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProductDirect(product)}
                            className="p-1.5 text-stone-400 hover:text-oxford-red hover:bg-oxford-red/10 rounded transition-all cursor-pointer"
                            title="مسح فوري بدون إزعاج"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-2.5 sm:px-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/20 text-xs">
              <p className="text-xs text-stone-400 font-light">عرض {filteredProducts.length} من أصل {products.length} منتج</p>
              <div className="flex items-center gap-1.5">
                <button className="px-2.5 py-1 bg-white border border-stone-200 text-stone-500 rounded font-light hover:bg-stone-50 transition-all text-xs">السابق</button>
                <button className="px-2.5 py-1 bg-oxford-blue text-white rounded font-normal text-xs">1</button>
                <button className="px-2.5 py-1 bg-white border border-stone-200 text-stone-500 rounded font-light hover:bg-stone-50 transition-all text-xs">التالي</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden"
          >
            <div className="p-8 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-oxford-blue">إدارة الطلبات</h3>
                <p className="text-xs text-stone-400 font-bold mt-1">متابعة وتحديث كافة الطلبات الواردة من المتجر وصفحة إتمام الشراء</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-50 rounded-xl p-1 border border-stone-100">
                  {['الكل', 'قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'ملغي'].map((status) => (
                    <button 
                      key={status}
                      type="button"
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        orderStatusFilter === status 
                          ? 'bg-white text-oxford-blue shadow-xs font-black' 
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-stone-50/50 text-stone-400 font-black text-xs uppercase tracking-widest">
                    <th className="px-8 py-6">رقم الطلب</th>
                    <th className="px-8 py-6">العميل</th>
                    <th className="px-8 py-6">التاريخ</th>
                    <th className="px-8 py-6">العناصر</th>
                    <th className="px-8 py-6">الإجمالي</th>
                    <th className="px-8 py-6">الحالة</th>
                    <th className="px-8 py-6 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders
                    .filter(o => orderStatusFilter === 'الكل' || o.status === orderStatusFilter)
                    .map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-all group">
                      <td className="px-8 py-6 font-black text-oxford-blue">{order.id}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-stone-700">{order.customer}</p>
                        <p className="text-[11px] text-stone-400 dir-ltr text-right">{order.phone}</p>
                      </td>
                      <td className="px-8 py-6 text-stone-400 font-medium text-xs">{order.date}</td>
                      <td className="px-8 py-6 text-stone-600 font-bold text-xs">
                        {order.items.length} منتج ({order.items.reduce((s, i) => s + i.quantity, 0)} قطعة)
                      </td>
                      <td className="px-8 py-6 font-black text-oxford-blue">{order.total.toFixed(3)} د.ت</td>
                      <td className="px-8 py-6">
                        <select 
                          value={order.status}
                          onChange={(e) => {
                            orderService.updateOrderStatus(order.id, e.target.value as any);
                            setOrders(orderService.getOrders());
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter border-none cursor-pointer outline-none ${
                            order.status === 'تم التوصيل' ? 'bg-emerald-50 text-emerald-600' : 
                            order.status === 'تم الشحن' ? 'bg-blue-50 text-blue-600' : 
                            order.status === 'ملغي' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          <option value="قيد المعالجة">قيد المعالجة</option>
                          <option value="تم الشحن">تم الشحن</option>
                          <option value="تم التوصيل">تم التوصيل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActiveTab('order-details');
                            }}
                            className="px-4 py-2 bg-stone-50 text-oxford-blue rounded-lg font-bold text-xs hover:bg-oxford-blue hover:text-white transition-all cursor-pointer"
                          >
                            تفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.filter(o => orderStatusFilter === 'الكل' || o.status === orderStatusFilter).length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stone-400 font-bold">
                        لا توجد طلبات في هذه الحالة حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'products-grid' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Filters Sidebar */}
            <aside className="lg:w-80 bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8 h-fit space-y-8">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="font-black text-oxford-blue">تصفية</span>
                <button className="text-xs font-black text-oxford-red uppercase tracking-widest">مسح الكل</button>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-oxford-blue text-sm uppercase tracking-widest">الفئات</h4>
                <ul className="space-y-3">
                  {categories.map(cat => (
                    <li key={cat.name} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm font-bold text-stone-500 group-hover:text-oxford-blue transition-colors">{cat.name}</span>
                      <span className="text-[10px] font-black text-stone-300 bg-stone-50 px-2 py-0.5 rounded-full">24</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-oxford-blue text-sm uppercase tracking-widest">نطاق السعر</h4>
                <input type="range" className="w-full accent-oxford-blue" />
                <div className="flex justify-between text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <span>0 د.ت</span>
                  <span>500 د.ت</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-oxford-blue text-sm uppercase tracking-widest">الماركة</h4>
                <ul className="space-y-3">
                  {['Oxford', 'Muffi', 'SoundWave', 'SmartSync'].map(brand => (
                    <li key={brand} className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-stone-200 text-oxford-blue focus:ring-oxford-blue" />
                      <span className="text-sm font-bold text-stone-500">{brand}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white p-5 rounded-md shadow-xs border border-stone-100 group hover:shadow-lg transition-all">
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-4 bg-stone-50">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                        <Package size={36} className="mb-1 opacity-50" />
                        <span className="text-[10px] font-bold text-stone-400">بدون صورة</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-sm text-[10px] font-black text-oxford-blue shadow-xs">
                        {product.category}
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mb-2 group-hover:text-oxford-red transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">{product.name}</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-oxford-red">{product.price.toFixed(3)} د.ت</span>
                      <span className="text-[11px] font-normal text-stone-400 line-through">{(product.price * 1.2).toFixed(3)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setActiveTab('edit-product');
                        }}
                        className="p-2 bg-stone-50 text-stone-400 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
                        title="تعديل المنتج"
                      >
                        <Edit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProductDirect(product)}
                        className="p-2 bg-stone-50 text-stone-400 rounded-md hover:bg-oxford-red/10 hover:text-oxford-red transition-all cursor-pointer"
                        title="مسح فوري بدون إزعاج"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'cart' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            <div className="flex-[2] bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8">
              <h2 className="text-2xl font-black text-oxford-blue mb-8">عناصر السلة</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-stone-100 pb-6 group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                        <img src={`https://picsum.photos/seed/${item + 10}/200`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-oxford-blue group-hover:text-oxford-red transition-colors">منتج تجريبي رقم {item}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full uppercase tracking-widest">مقاس L</span>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">متوفر</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-oxford-blue text-lg">125.000 د.ت</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="w-8 h-8 flex items-center justify-center bg-stone-50 rounded-lg text-stone-400 hover:bg-oxford-blue hover:text-white transition-all">-</button>
                        <span className="font-black text-oxford-blue">1</span>
                        <button className="w-8 h-8 flex items-center justify-center bg-stone-50 rounded-lg text-stone-400 hover:bg-oxford-blue hover:text-white transition-all">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8 h-fit space-y-8">
              <h2 className="text-2xl font-black text-oxford-blue">ملخص الطلب</h2>
              <div className="bg-stone-50 p-4 rounded-2xl flex gap-2 border border-stone-100">
                <input placeholder="أدخل رمز ترويجي" className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
                <button className="bg-oxford-blue text-white px-6 py-2 rounded-xl text-xs font-black">تطبيق</button>
              </div>
              <div className="space-y-4 text-sm font-bold text-stone-500">
                <div className="flex justify-between"><span>المجموع الفرعي</span><span className="text-oxford-blue font-black">375.000 د.ت</span></div>
                <div className="flex justify-between text-emerald-600"><span>خصم 20%</span><span className="font-black">-75.000 د.ت</span></div>
                <div className="flex justify-between"><span>رسوم التوصيل</span><span className="text-emerald-600 font-black">مجاني</span></div>
                <div className="border-t border-stone-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-oxford-blue">الإجمالي</span>
                  <span className="text-2xl font-black text-oxford-red">300.000 د.ت</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('checkout')}
                className="w-full bg-oxford-blue text-white py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all"
              >
                متابعة إتمام الشراء
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'checkout' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8">
                <h3 className="text-2xl font-black text-oxford-blue mb-8">طرق الشحن</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-6 border-2 border-oxford-blue bg-oxford-blue/5 rounded-2xl cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input type="radio" name="shipping" defaultChecked className="w-5 h-5 text-oxford-blue focus:ring-oxford-blue" />
                      <div>
                        <p className="font-black text-oxford-blue">توصيل سريع (Aramex)</p>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">التوصيل خلال ٢٤-٤٨ ساعة</p>
                      </div>
                    </div>
                    <span className="font-black text-oxford-blue">7.000 د.ت</span>
                  </label>
                  <label className="flex items-center justify-between p-6 border-2 border-stone-100 hover:border-oxford-blue/20 rounded-2xl cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <input type="radio" name="shipping" className="w-5 h-5 text-oxford-blue focus:ring-oxford-blue" />
                      <div>
                        <p className="font-black text-oxford-blue">توصيل عادي</p>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">التوصيل خلال ٣-٥ أيام عمل</p>
                      </div>
                    </div>
                    <span className="font-black text-oxford-blue">مجاني</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8">
                <h3 className="text-2xl font-black text-oxford-blue mb-8">عنوان الشحن</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-600 mr-2">الاسم الكامل</label>
                    <input type="text" defaultValue="أحمد بن علي" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-600 mr-2">رقم الهاتف</label>
                    <input type="text" defaultValue="+216 22 333 444" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-black text-stone-600 mr-2">العنوان</label>
                    <input type="text" defaultValue="نهج الحرية، تونس العاصمة" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8 h-fit space-y-8">
              <h3 className="text-2xl font-black text-oxford-blue">ملخص الطلب</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-stone-500">
                  <span>المجموع</span>
                  <span className="text-oxford-blue font-black">300.000 د.ت</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-500">
                  <span>الشحن</span>
                  <span className="text-oxford-blue font-black">7.000 د.ت</span>
                </div>
                <div className="border-t border-stone-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-oxford-blue">الإجمالي</span>
                  <span className="text-2xl font-black text-oxford-red">307.000 د.ت</span>
                </div>
              </div>
              <button className="w-full bg-oxford-blue text-white py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all">
                تأكيد الطلب والدفع
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'edit-product' && editingProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-5 text-oxford-blue">تعديل المنتج: {editingProduct.name}</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">اسم المنتج</label>
                <input 
                  type="text" 
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
                <p className="text-xs text-gray-400 mt-1">حد أقصى ٣٠ حرف</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الفئة</label>
                <select 
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option>إلكترونيات</option>
                  <option>ملابس</option>
                  <option>ساعات</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">النوع / الحجم</label>
                <input 
                  type="text"
                  name="size"
                  list="edit-size-presets"
                  value={editingProduct.size || ''}
                  onChange={handleEditChange}
                  placeholder="مثال: A5، 10 ألوان، كبير، 32L..."
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all"
                />
                <datalist id="edit-size-presets">
                  <option value="صغير" />
                  <option value="وسط" />
                  <option value="كبير" />
                  <option value="A4" />
                  <option value="A5" />
                  <option value="علبة 10 ألوان" />
                  <option value="علبة 24 لون" />
                  <option value="علبة 36 لون" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الماركة</label>
                <input 
                  type="text" 
                  name="brand"
                  value={editingProduct.brand || ''}
                  onChange={handleEditChange}
                  placeholder="أكسفورد سيتي"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">خيارات الأحجام المتوفرة (مفصولة بفواصل)</label>
                <input 
                  type="text" 
                  value={(editingProduct.sizes || []).join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setEditingProduct({...editingProduct, sizes: parts});
                  }}
                  placeholder="مثال: حجم قياسي، حجم كبير (XL)، حجم مدمج" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">خيارات الأنماط / الطراز (مفصولة بفواصل)</label>
                <input 
                  type="text" 
                  value={(editingProduct.styles || []).join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setEditingProduct({...editingProduct, styles: parts});
                  }}
                  placeholder="مثال: طراز قياسي، طراز بريميوم، طقم إضافي" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">الألوان</label>
                  <span className="text-xs text-gray-400 font-semibold">{(editingProduct.colors || []).length} لون محدد</span>
                </div>
                <input 
                  type="text" 
                  value={(editingProduct.colors || []).join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setEditingProduct({...editingProduct, colors: parts});
                  }}
                  placeholder="مثال: Noir، Rouge، Vert، Bleu" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
                <div className="mt-2">
                  <span className="text-xs font-bold text-gray-500 block mb-1.5">ألوان مقترحة (اضغط للاختيار أو الحذف):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = (editingProduct.colors || []).some(
                        c => c.trim().toLowerCase() === preset.name.toLowerCase()
                      );
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => toggleEditProductColor(preset.name)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                            isSelected 
                              ? 'bg-oxford-blue text-white border-oxford-blue shadow-xs' 
                              : 'bg-white text-stone-700 border-stone-200 hover:border-oxford-blue hover:bg-stone-50'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0" 
                            style={{ backgroundColor: preset.bg }}
                          />
                          <span>{preset.label}</span>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الفعلي (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر المشطوب (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="compareAtPrice"
                    value={editingProduct.compareAtPrice || ''}
                    onChange={handleEditChange}
                    placeholder="15.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأدنى (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="minPrice"
                    value={editingProduct.minPrice || ''}
                    onChange={handleEditChange}
                    placeholder="0.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأقصى (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="maxPrice"
                    value={editingProduct.maxPrice || ''}
                    onChange={handleEditChange}
                    placeholder="0.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">الخصم %</label>
                  <input 
                    type="number" 
                    name="discount"
                    value={editingProduct.discount || 0}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">عدد التقييمات المعروض</label>
                <input 
                  type="number" 
                  name="reviewsCount"
                  value={editingProduct.reviewsCount || 65}
                  onChange={handleEditChange}
                  placeholder="65"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">ملاحظات</label>
                <textarea 
                  name="notes"
                  rows={2} 
                  value={editingProduct.notes || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  placeholder="ملاحظات حول المنتج، المخزون، أو أي تفاصيل إضافية..." 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">الوصف</label>
                <textarea 
                  name="description"
                  rows={3} 
                  value={editingProduct.description}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                />
                <p className="text-xs text-gray-400 mt-1">أقصى ٥٠٠ حرف</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">نوع المنتج</label>
                <input 
                  type="text" 
                  name="productType"
                  value={editingProduct.productType || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الوزن (جرام)</label>
                <input 
                  type="text" 
                  name="weight"
                  value={editingProduct.weight || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">ميزات المنتج</label>
                <textarea 
                  name="features"
                  rows={2} 
                  value={editingProduct.features || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  placeholder="- تعليمات العناية: غسيل آلي&#10;- نوع الرقبة: كرو&#10;- أكمام طويلة" 
                />
              </div>
              
              <div 
                onClick={() => editImageInputRef.current?.click()}
                className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={editImageInputRef}
                  className="hidden" 
                  accept=".jpg,.jpeg,.webp"
                  multiple
                  onChange={(e) => handleImageUpload(e, true)}
                />
                <div className="flex flex-col items-center">
                  <i className="fas fa-cloud-upload-alt fa-2x mb-2 text-indigo-500"></i>
                  <span className="block font-medium">اسحب صوراً جديدة أو استبدل</span>
                  <span className="text-xs">(JPG, WEBP)</span>
                </div>
              </div>

              {editingProduct.images && editingProduct.images.length > 0 && (
                <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(idx, true); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 hover:border-indigo-500 transition-all cursor-pointer">
                <i className="fas fa-file-alt mb-1 text-indigo-500"></i>
                <span className="block text-sm">اسحب مستندات الضمان أو انقر</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ النشر</label>
                  <input 
                    type="date" 
                    name="publishDate"
                    value={editingProduct.publishDate || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">وقت النشر</label>
                  <input 
                    type="time" 
                    name="publishTime"
                    value={editingProduct.publishTime || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة النشر</label>
                <select 
                  name="publishStatus"
                  value={editingProduct.publishStatus || 'منشور'}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="مجدول">مجدول</option>
                  <option value="منشور">منشور</option>
                  <option value="مسودة">مسودة</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">علامات المنتج</label>
                <div className="flex flex-wrap gap-2 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  {(editingProduct.tags || []).map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2">
                      {tag} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setEditingProduct({...editingProduct, tags: editingProduct.tags?.filter((_, i) => i !== idx)})} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="أضف علامة" 
                    className="border-0 flex-1 min-w-[100px] text-sm outline-none" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setEditingProduct({...editingProduct, tags: [...(editingProduct.tags || []), val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة التوفر</label>
                <select 
                  name="availability"
                  value={editingProduct.availability || 'متوفر'}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="متوفر">متوفر</option>
                  <option value="غير متوفر">غير متوفر</option>
                  <option value="قريباً">قريباً</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">رمز المنتج (SKU)</label>
                <input 
                  type="text" 
                  name="sku"
                  value={editingProduct.sku || ''}
                  onChange={handleEditChange}
                  placeholder="مثل: OXF-1001"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" 
                />
                <p className="text-xs text-gray-400 mt-1">الرمز الفريد للمنتج</p>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={handleUpdateProduct}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  تحديث المنتج
                </button>
                <button type="button" onClick={() => setActiveTab('products')} className="border border-gray-300 px-8 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'order-details' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8"
          >
            {selectedOrder ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-oxford-blue">تفاصيل الطلب {selectedOrder.id}</h2>
                      <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                        selectedOrder.status === 'تم التوصيل' ? 'bg-emerald-50 text-emerald-600' : 
                        selectedOrder.status === 'تم الشحن' ? 'bg-blue-50 text-blue-600' : 
                        selectedOrder.status === 'ملغي' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 font-bold mt-1">تاريخ الإنشاء: {selectedOrder.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="bg-stone-50 text-oxford-blue px-5 py-2.5 rounded-xl font-black text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      ← العودة للطلبات
                    </button>
                    <button 
                      type="button"
                      onClick={() => window.print()}
                      className="bg-oxford-blue text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-opacity-90 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <i className="fas fa-print"></i> طباعة الفاتورة
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-stone-100 pb-8 mb-8 bg-stone-50/50 p-6 rounded-2xl">
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-1">العميل</span>
                    <p className="font-black text-oxford-blue">{selectedOrder.customer}</p>
                    <p className="text-xs text-stone-500 font-bold dir-ltr text-right mt-0.5">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-1">عنوان الشحن</span>
                    <p className="font-bold text-stone-700 text-xs">{selectedOrder.city}</p>
                    <p className="text-xs text-stone-500">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-1">طريقة الدفع والشحن</span>
                    <p className="font-bold text-oxford-blue text-xs">{selectedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية'}</p>
                    <p className="text-xs text-stone-500">{selectedOrder.shippingMethod === 'express' ? 'توصيل سريع' : 'توصيل قياسي'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-1">المبلغ الإجمالي</span>
                    <p className="font-black text-oxford-red text-xl">{selectedOrder.total.toFixed(3)} د.ت</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mb-8 p-4 bg-amber-50/60 border border-amber-200/50 rounded-2xl text-xs">
                    <span className="font-black text-amber-800 block mb-1">ملاحظات العميل:</span>
                    <p className="text-amber-900 font-medium">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-oxford-blue">المنتجات المطلوبة ({selectedOrder.items.length})</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400">تحديث الحالة:</span>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        orderService.updateOrderStatus(selectedOrder.id, newStatus);
                        const updated = { ...selectedOrder, status: newStatus };
                        setSelectedOrder(updated);
                        setOrders(orderService.getOrders());
                      }}
                      className="px-3 py-1.5 bg-stone-50 rounded-lg text-xs font-black text-oxford-blue border border-stone-200 cursor-pointer"
                    >
                      <option value="قيد المعالجة">قيد المعالجة</option>
                      <option value="تم الشحن">تم الشحن</option>
                      <option value="تم التوصيل">تم التوصيل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-14 h-14 object-cover rounded-xl border border-stone-200" 
                        />
                        <div>
                          <p className="font-black text-oxford-blue text-sm">{item.name}</p>
                          <div className="flex items-center gap-3 text-xs text-stone-400 font-bold mt-1">
                            {item.selectedColor && (
                              <span>اللون: <span className="text-oxford-blue">{item.selectedColor}</span></span>
                            )}
                            {item.selectedSize && (
                              <span>المقاس: <span className="text-oxford-blue">{item.selectedSize}</span></span>
                            )}
                            <span>الكمية: <span className="text-oxford-blue font-black">{item.quantity}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-oxford-blue">{(item.price * item.quantity).toFixed(3)} د.ت</p>
                        <p className="text-[11px] text-stone-400 font-bold">{item.price.toFixed(3)} د.ت للقطعة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-stone-400 font-bold mb-4">لم يتم اختيار أي طلب لعرض التفاصيل</p>
                <button 
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="bg-oxford-blue text-white px-6 py-2.5 rounded-xl font-black text-xs cursor-pointer"
                >
                  الذهاب لقائمة الطلبات
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'wishlist' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                    <img src={`https://picsum.photos/seed/wish${i}/200`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-oxford-blue">منتج مفضل {i}</h4>
                    <p className="text-xs font-bold text-stone-400">125.000 د.ت</p>
                  </div>
                </div>
                <button className="p-3 bg-stone-50 text-oxford-blue rounded-xl hover:bg-oxford-blue hover:text-white transition-all">
                  <ShoppingCart size={18} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {['calendar', 'gallery', 'alerts', 'projects'].includes(activeTab) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-20 text-center"
          >
            <div className="w-24 h-24 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-stone-300">
              <LayoutDashboard size={48} />
            </div>
            <h2 className="text-3xl font-black text-oxford-blue mb-2">قريباً جداً</h2>
            <p className="text-stone-400 font-bold">نحن نعمل على تطوير هذه الصفحة لتكون متاحة لك في أقرب وقت.</p>
          </motion.div>
        )}

        {activeTab === 'add-product' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            {/* Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-oxford-blue">إضافة منتجات للمتجر</h2>
                <p className="text-xs text-stone-500 font-medium mt-1">أضف منتجاً فردياً مع رمز SKU أو قم باستيراد مئات المنتجات دفعة واحدة عبر ملف CSV</p>
              </div>

              <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 w-fit">
                <button
                  type="button"
                  onClick={() => setAddProductMode('manual')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    addProductMode === 'manual'
                      ? 'bg-white text-oxford-blue shadow-sm font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Plus size={16} />
                  <span>إدخال يدوي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddProductMode('csv')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    addProductMode === 'csv'
                      ? 'bg-oxford-blue text-white shadow-sm font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  <span>استيراد ملف CSV</span>
                </button>
              </div>
            </div>

            {/* CSV Import Interface */}
            {addProductMode === 'csv' && (
              <div className="space-y-6">
                {/* Information and Template Download */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileSpreadsheet size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-oxford-blue text-sm sm:text-base">استيراد المنتجات المجمّع عبر ملف CSV</h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        قم برفع ملف بتنسيق CSV يحتوي على أعمدة: (رمز المنتج، اسم المنتج، النوع/الحجم، السعر، السعر الأدنى (د.ت)، السعر الأقصى (د.ت)، ملاحظات، الفئة، الوصف، الماركة، رابط الصورة، حالة التوفر). يدعم النظام العناوين باللغتين العربية والإنجليزية.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="flex items-center gap-2 bg-white hover:bg-stone-100 text-oxford-blue border border-stone-300 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    <Download size={16} />
                    <span>تحميل نموذج CSV التجريبي</span>
                  </button>
                </div>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-stone-300 hover:border-oxford-blue rounded-2xl p-8 text-center transition-colors bg-white relative">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCsvFileUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-oxford-blue/5 text-oxford-blue flex items-center justify-center mb-3">
                      <UploadCloud size={32} />
                    </div>
                    <h5 className="font-bold text-stone-800 text-base mb-1">
                      {csvFile ? csvFile.name : "اضغط هنا لاختيار ملف CSV أو اسحبه وأفلته هنا"}
                    </h5>
                    <p className="text-xs text-stone-500 font-medium">
                      {csvFile ? `الحجم: ${(csvFile.size / 1024).toFixed(1)} كيلوبايت` : "يدعم جميع تنسيقات CSV (فاصلة ، فاصلة منقوطة ؛ أو Tab) بترميز UTF-8"}
                    </p>
                  </div>
                </div>

                {/* File Detection & Delimiter Bar */}
                {csvHeaders.length > 0 && (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-oxford-blue">
                        <CheckCircle size={15} className="text-emerald-600" />
                        <span>تم تحليل الملف: {csvHeaders.length} أعمدة، {Math.max(0, csvRawRows.length - 1)} منتج</span>
                      </div>

                      <div className="h-4 w-px bg-stone-300 hidden md:block"></div>

                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-medium">رمز الفاصل (Delimiter):</span>
                        <div className="inline-flex bg-white rounded-lg border border-stone-200 p-0.5 shadow-2xs">
                          {[
                            { label: 'فاصلة منقوطة (;)', val: ';' },
                            { label: 'فاصلة (,)', val: ',' },
                            { label: 'Tab', val: '\t' },
                            { label: 'عامود (|)', val: '|' },
                          ].map(d => (
                            <button
                              key={d.val}
                              type="button"
                              onClick={() => handleDelimiterChange(d.val)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                csvDelimiter === d.val
                                  ? 'bg-oxford-blue text-white shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => setShowColumnMapper(!showColumnMapper)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          showColumnMapper
                            ? 'bg-oxford-blue text-white border-oxford-blue'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        <SlidersHorizontal size={14} />
                        <span>{showColumnMapper ? 'إخفاء مطابقة الأعمدة' : 'تعديل مطابقة الأعمدة'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetAutoMapping}
                        title="إعادة التعرف التلقائي على الأعمدة"
                        className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Column Mapping Configuration Panel */}
                {showColumnMapper && csvHeaders.length > 0 && (
                  <div className="bg-white border-2 border-oxford-blue/30 rounded-xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <h5 className="font-bold text-oxford-blue text-sm">لوحة مطابقة الأعمدة يدويّاً</h5>
                        <p className="text-xs text-stone-500 mt-0.5">
                          حدد العمود المقابل لكل حقل في متجرك. يتم تحديث المعاينة فوراً عند أي تغيير.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                        الحقل الإلزامي فقط: اسم المنتج
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {CSV_FIELDS.map(field => {
                        const currentIdx = columnMapping[field.id] !== undefined ? columnMapping[field.id] : -1;
                        return (
                          <div key={field.id} className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-stone-800 flex items-center gap-1">
                                <span>{field.label}</span>
                                {field.required && <span className="text-oxford-red font-black">*</span>}
                              </label>
                              {currentIdx !== -1 && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                                  مطابق للعمود {currentIdx + 1}
                                </span>
                              )}
                            </div>

                            <select
                              value={currentIdx}
                              onChange={(e) => handleMappingChange(field.id, parseInt(e.target.value))}
                              className="w-full bg-white border border-stone-300 rounded-md p-2 text-xs font-medium focus:ring-2 focus:ring-oxford-blue focus:border-oxford-blue outline-none transition-all cursor-pointer"
                            >
                              <option value="-1">-- غير محدد (تجاهل) --</option>
                              {csvHeaders.map((hdr, hIdx) => {
                                const sampleVal = csvRawRows[1] && csvRawRows[1][hIdx] ? csvRawRows[1][hIdx] : '';
                                const sampleText = sampleVal ? ` (مثال: "${sampleVal.slice(0, 15)}")` : '';
                                return (
                                  <option key={hIdx} value={hIdx}>
                                    العمود {hIdx + 1}: {hdr || `[عمود ${hIdx + 1}]`}{sampleText}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {csvError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{csvError}</span>
                    </div>
                    {csvHeaders.length > 0 && !showColumnMapper && (
                      <button
                        type="button"
                        onClick={() => setShowColumnMapper(true)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
                      >
                        فتح مطابقة الأعمدة
                      </button>
                    )}
                  </div>
                )}

                {/* Parsed Products Preview Table */}
                {parsedCsvProducts.length > 0 && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-600" />
                        <span className="font-bold text-sm text-oxford-blue">
                          تم التعرف بنجاح على {parsedCsvProducts.length} منتج جاهز للإضافة:
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 font-medium">معاينة أولية للبيانات المستخرجة (بما في ذلك النوع/الحجم، الأسعار الدنيا والقصوى، والملاحظات)</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-stone-100/75 text-stone-600 font-bold sticky top-0 border-b border-stone-200">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">رمز المنتج (SKU)</th>
                            <th className="p-3">الصورة</th>
                            <th className="p-3">اسم المنتج</th>
                            <th className="p-3">النوع/الحجم</th>
                            <th className="p-3">السعر</th>
                            <th className="p-3">السعر الأدنى (د.ت)</th>
                            <th className="p-3">السعر الأقصى (د.ت)</th>
                            <th className="p-3">ملاحظات</th>
                            <th className="p-3">الفئة</th>
                            <th className="p-3">الماركة</th>
                            <th className="p-3">التوفر</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium">
                          {parsedCsvProducts.map((p, idx) => (
                            <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                              <td className="p-3 text-stone-400 font-mono">{idx + 1}</td>
                              <td className="p-3">
                                <span className="font-mono font-bold bg-stone-100 text-oxford-blue px-2 py-0.5 rounded-sm border border-stone-200 whitespace-nowrap">
                                  {p.sku || `OXF-AUTO`}
                                </span>
                              </td>
                              <td className="p-3">
                                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-sm object-cover bg-stone-100" />
                              </td>
                              <td className="p-3 font-bold text-stone-900 min-w-[140px]">{p.name}</td>
                              <td className="p-3">
                                <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded-sm border border-stone-200 inline-block whitespace-nowrap">
                                  {p.size || '—'}
                                </span>
                              </td>
                              <td className="p-3 font-black text-oxford-red whitespace-nowrap">{p.price.toFixed(3)} د.ت</td>
                              <td className="p-3 font-bold text-stone-700 whitespace-nowrap">
                                {p.minPrice ? `${p.minPrice.toFixed(3)} د.ت` : '—'}
                              </td>
                              <td className="p-3 font-bold text-stone-700 whitespace-nowrap">
                                {p.maxPrice ? `${p.maxPrice.toFixed(3)} د.ت` : '—'}
                              </td>
                              <td className="p-3 text-stone-600 max-w-[160px] truncate" title={p.notes || ''}>
                                {p.notes || '—'}
                              </td>
                              <td className="p-3 text-stone-600 whitespace-nowrap">{p.category}</td>
                              <td className="p-3 text-stone-500 whitespace-nowrap">{p.brand || '—'}</td>
                              <td className="p-3">
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm text-[11px] font-bold whitespace-nowrap">
                                  {p.availability}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setParsedCsvProducts([]);
                          setCsvFile(null);
                        }}
                        className="text-stone-500 hover:text-stone-800 text-xs font-bold px-3 py-2 cursor-pointer"
                      >
                        إلغاء الملف
                      </button>

                      <button
                        type="button"
                        onClick={handleExecuteCsvImport}
                        disabled={isImporting}
                        className="bg-oxford-blue hover:bg-oxford-red text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        <CheckCircle size={16} />
                        <span>استيراد {parsedCsvProducts.length} منتج إلى المتجر</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Form */}
            {addProductMode === 'manual' && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">اسم المنتج</label>
                  <input 
                    type="text" 
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewChange}
                    placeholder="مثل: دفتر سلك جامعي 200 صفحة" 
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                  <p className="text-xs text-gray-400 mt-1">حد أقصى ٣٠ حرف</p>
                </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الفئة</label>
                <select 
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option>إلكترونيات</option>
                  <option>ملابس</option>
                  <option>ساعات</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">النوع / الحجم</label>
                <input 
                  type="text" 
                  name="size"
                  list="new-size-presets"
                  value={newProduct.size}
                  onChange={handleNewChange}
                  placeholder="مثال: A5، 10 ألوان، كبير، 32L..." 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
                <datalist id="new-size-presets">
                  <option value="صغير" />
                  <option value="وسط" />
                  <option value="كبير" />
                  <option value="A4" />
                  <option value="A5" />
                  <option value="علبة 10 ألوان" />
                  <option value="علبة 24 لون" />
                  <option value="علبة 36 لون" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الماركة</label>
                <input 
                  type="text" 
                  name="brand"
                  value={newProduct.brand}
                  onChange={handleNewChange}
                  placeholder="أكسفورد سيتي" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">خيارات الأحجام المتوفرة (مفصولة بفواصل)</label>
                <input 
                  type="text" 
                  value={(newProduct.sizes || []).join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setNewProduct({...newProduct, sizes: parts});
                  }}
                  placeholder="مثال: حجم قياسي، حجم كبير (XL)، حجم مدمج" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">خيارات الأنماط / الطراز (مفصولة بفواصل)</label>
                <input 
                  type="text" 
                  value={(newProduct.styles || []).join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setNewProduct({...newProduct, styles: parts});
                  }}
                  placeholder="مثال: طراز قياسي، طراز بريميوم، طقم إضافي" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">الألوان</label>
                  <span className="text-xs text-gray-400 font-semibold">{newProduct.colors.length} لون محدد</span>
                </div>
                <input 
                  type="text" 
                  value={newProduct.colors.join('، ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                    setNewProduct({...newProduct, colors: parts});
                  }}
                  placeholder="مثال: Noir، Rouge، Vert، Bleu" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-oxford-blue outline-none transition-all" 
                />
                <div className="mt-2">
                  <span className="text-xs font-bold text-gray-500 block mb-1.5">ألوان مقترحة (اضغط للاختيار السريع):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = newProduct.colors.some(
                        c => c.trim().toLowerCase() === preset.name.toLowerCase()
                      );
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => toggleNewProductColor(preset.name)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                            isSelected 
                              ? 'bg-oxford-blue text-white border-oxford-blue shadow-xs' 
                              : 'bg-white text-stone-700 border-stone-200 hover:border-oxford-blue hover:bg-stone-50'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0" 
                            style={{ backgroundColor: preset.bg }}
                          />
                          <span>{preset.label}</span>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الفعلي (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر المشطوب (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="compareAtPrice"
                    value={newProduct.compareAtPrice || ''}
                    onChange={handleNewChange}
                    placeholder="15.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأدنى (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="minPrice"
                    value={newProduct.minPrice || ''}
                    onChange={handleNewChange}
                    placeholder="0.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأقصى (د.ت)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    name="maxPrice"
                    value={newProduct.maxPrice || ''}
                    onChange={handleNewChange}
                    placeholder="0.000"
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">الخصم %</label>
                  <input 
                    type="number" 
                    name="discount"
                    value={newProduct.discount}
                    onChange={handleNewChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">عدد التقييمات المعروض</label>
                <input 
                  type="number" 
                  name="reviewsCount"
                  value={newProduct.reviewsCount || 65}
                  onChange={handleNewChange}
                  placeholder="65"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">ملاحظات</label>
                <textarea 
                  name="notes"
                  rows={2} 
                  value={newProduct.notes || ''}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  placeholder="ملاحظات حول المنتج، المخزون، أو أي تفاصيل إضافية..." 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">الوصف</label>
                <textarea 
                  name="description"
                  rows={3} 
                  value={newProduct.description}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  placeholder="خامة ناعمة ومريحة..." 
                />
                <p className="text-xs text-gray-400 mt-1">أقصى ٥٠٠ حرف</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">نوع المنتج</label>
                <input 
                  type="text" 
                  name="productType"
                  value={newProduct.productType}
                  onChange={handleNewChange}
                  placeholder="ساعة" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الوزن (جرام)</label>
                <input 
                  type="text" 
                  name="weight"
                  value={newProduct.weight}
                  onChange={handleNewChange}
                  placeholder="180gms" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">ميزات المنتج</label>
                <textarea 
                  name="features"
                  rows={2} 
                  value={newProduct.features}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
                  placeholder="- تعليمات العناية: غسيل آلي&#10;- نوع الرقبة: كرو&#10;- أكمام طويلة" 
                />
              </div>
              
              <div 
                onClick={() => imageInputRef.current?.click()}
                className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={imageInputRef}
                  className="hidden" 
                  accept=".jpg,.jpeg,.webp"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                />
                <div className="flex flex-col items-center">
                  <i className="fas fa-cloud-upload-alt fa-2x mb-2 text-indigo-500"></i>
                  <span className="block font-medium">اسحب الصور هنا أو انقر للرفع</span>
                  <span className="text-xs">(JPG, WEBP)</span>
                </div>
              </div>

              {newProduct.images && newProduct.images.length > 0 && (
                <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(idx, false); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 hover:border-indigo-500 transition-all cursor-pointer">
                <i className="fas fa-file-alt mb-1 text-indigo-500"></i>
                <span className="block text-sm">اسحب مستندات الضمان أو انقر</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ النشر</label>
                  <input 
                    type="date" 
                    name="publishDate"
                    value={newProduct.publishDate}
                    onChange={handleNewChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">وقت النشر</label>
                  <input 
                    type="time" 
                    name="publishTime"
                    value={newProduct.publishTime}
                    onChange={handleNewChange}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة النشر</label>
                <select 
                  name="publishStatus"
                  value={newProduct.publishStatus}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="مجدول">مجدول</option>
                  <option value="منشور">منشور</option>
                  <option value="مسودة">مسودة</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">علامات المنتج</label>
                <div className="flex flex-wrap gap-2 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  {newProduct.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2">
                      {tag} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setNewProduct({...newProduct, tags: newProduct.tags.filter((_, i) => i !== idx)})} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="أضف علامة" 
                    className="border-0 flex-1 min-w-[100px] text-sm outline-none" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setNewProduct({...newProduct, tags: [...newProduct.tags, val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة التوفر</label>
                <select 
                  name="availability"
                  value={newProduct.availability}
                  onChange={handleNewChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="متوفر">متوفر</option>
                  <option value="غير متوفر">غير متوفر</option>
                  <option value="قريباً">قريباً</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">رمز المنتج (SKU)</label>
                <input 
                  type="text" 
                  name="sku"
                  value={newProduct.sku || ''}
                  onChange={handleNewChange}
                  placeholder="مثل: OXF-1001" 
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" 
                />
                <p className="text-xs text-gray-400 mt-1">الرمز الفريد للمنتج</p>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={handleAddProduct}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  إضافة المنتج
                </button>
                <button type="button" className="border border-gray-300 px-8 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  حفظ كمسودة
                </button>
                <button type="button" onClick={() => setActiveTab('products')} className="border border-gray-300 px-8 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
            )}
          </motion.div>
        )}
      </div>
    </main>
      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-oxford-blue/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-oxford-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-oxford-blue">إضافة منتج جديد</h2>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">أدخل تفاصيل المنتج أدناه</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 hover:bg-white rounded-xl transition-all shadow-sm group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-600 mr-2">اسم المنتج</label>
                    <input type="text" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" placeholder="مثلاً: حقيبة مدرسية" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-600 mr-2">السعر (د.ت)</label>
                    <input type="number" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" placeholder="0.000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">الفئة</label>
                  <select className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold">
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">رابط الصورة</label>
                  <input type="text" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">الوصف</label>
                  <textarea rows={3} className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-bold resize-none" placeholder="اكتب وصفاً مفصلاً للمنتج..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-600 mr-2">رمز المنتج (SKU)</label>
                  <input type="text" className="w-full bg-stone-50 border-2 border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-oxford-blue outline-none transition-all font-mono font-bold" placeholder="مثل: OXF-1001" />
                  <p className="text-xs text-gray-400 mt-1">الرمز الفريد للمنتج</p>
                </div>
              </div>

              <div className="p-8 border-t border-stone-100 bg-stone-50 flex gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-oxford-blue text-white py-4 rounded-xl font-black shadow-xl shadow-oxford-blue/20 hover:bg-oxford-red transition-all"
                >
                  حفظ المنتج
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 bg-white text-stone-500 py-4 rounded-xl font-black border border-stone-200 hover:bg-stone-100 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal for clearing all CSV / products with selection choices */}
      <AnimatePresence>
        {showClearProductsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearProductsModal(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 p-6 border border-stone-200 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">خيارات مسح واختيار منتجات CSV</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      يمكنك اختيار مسح منتجات CSV فقط دون مسح المتجر كاملاً، أو تحديد ما تريده بدقة.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClearProductsModal(false)}
                  className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Tabs: By File, Pick Individual CSV items, Quick Options */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCsvModalTab('files')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    csvModalTab === 'files' 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Folder size={13} className="text-blue-600" />
                  <span>حسب الملف المرفوع</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {csvBatches.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCsvModalTab('pick_items')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    csvModalTab === 'pick_items' 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <CheckSquare size={13} className="text-oxford-blue" />
                  <span>تحديد يدوي</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {csvProducts.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCsvModalTab('options')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    csvModalTab === 'options' 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  خيارات شاملة
                </button>
              </div>

              {/* Content of Tab 0: By Uploaded File */}
              {csvModalTab === 'files' && (
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-0.5">
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                    <FileSpreadsheet size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">فصل منتجات كل ملف CSV ومسحه على حدة</p>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        يمكنك حذف منتجات ملف معين تم رفعه دون المساس بباقي الملفات أو المنتجات اليدوية في المتجر.
                      </p>
                    </div>
                  </div>

                  {csvBatches.length > 0 ? (
                    <div className="space-y-2.5">
                      {csvBatches.map((batch) => (
                        <div 
                          key={batch.batchId}
                          className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-oxford-blue/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/80">
                              <FileSpreadsheet size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                <span>{batch.fileName}</span>
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                                <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                                  {batch.productCount} منتج
                                </span>
                                <span>•</span>
                                <span className="text-stone-400">
                                  تاريخ الرفع: {batch.importedAt}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCsvBatchFilter(batch.batchId);
                                setShowClearProductsModal(false);
                                setSuccessMessage({ text: `تمت تصفية الجدول لعرض منتجات الملف "${batch.fileName}" (${batch.productCount} منتج).` });
                                setTimeout(() => setSuccessMessage(null), 3000);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="عرض منتجات هذا الملف في الجدول"
                            >
                              <Eye size={12} />
                              <span>عرض بالجدول</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCsvBatch(batch)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                              title={`مسح جميع منتجات الملف "${batch.fileName}" فقط`}
                            >
                              <Trash2 size={12} />
                              <span>مسح هذا الملف ({batch.productCount})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80">
                      <Folder size={32} className="mx-auto text-stone-300 mb-2" />
                      <p className="text-xs font-bold text-stone-700">لا توجد ملفات CSV مسجلة حالياً</p>
                      <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                        عند قيامك برفع أي ملف CSV عبر تبويب «إضافة منتجات»، سيتم تسجيل اسمه وتاريخه تلقائياً ليمكنك مسحه أو تصفية منتجاته على حدة.
                      </p>
                    </div>
                  )}

                  <div className="border-t border-stone-200/80 pt-3 mt-4 flex items-center justify-between text-xs text-stone-500">
                    <span>إجمالي ملفات CSV: <strong>{csvBatches.length}</strong></span>
                    <button
                      type="button"
                      onClick={() => setCsvModalTab('options')}
                      className="text-oxford-blue hover:underline font-semibold cursor-pointer"
                    >
                      خيارات مسح شاملة ←
                    </button>
                  </div>
                </div>
              )}


              {/* Content of Tab 1: Quick Options */}
              {csvModalTab === 'options' && (
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-0.5">
                  {/* Option 1: Delete CSV products ONLY (Recommended) */}
                  <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 transition-all hover:bg-amber-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs sm:text-sm">مسح منتجات CSV فقط (المستوردة)</span>
                          <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.5 rounded">موصى به</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          يحذف فقط المنتجات التي تم استيرادها بواسطة ملفات CSV ({csvProducts.length} منتج)، مع الحفاظ التام على المنتجات اليدوية والأساسية دون مسح المتجر كاملاً.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={csvProducts.length === 0}
                      onClick={handleClearCsvProductsOnly}
                      className="mt-3 w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>مسح منتجات CSV فقط ({csvProducts.length} منتج)</span>
                    </button>
                  </div>

                  {/* Option 2: Delete Selected Products */}
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 transition-all">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">مسح المنتجات المحددة بالاختيار</span>
                        <p className="text-xs text-stone-500 mt-0.5">
                          مسح المنتجات التي تم تحديدها بخانات الاختيار في الجدول ({selectedProductIds.length} منتج محدد).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={selectedProductIds.length === 0}
                      onClick={handleClearSelectedProducts}
                      className="mt-2.5 w-full py-2 px-3 bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>مسح المنتجات المحددة ({selectedProductIds.length})</span>
                    </button>
                  </div>

                  {/* Option 3: Button to switch to picking individual items */}
                  {csvProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCsvModalTab('pick_items')}
                      className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckSquare size={14} className="text-oxford-blue" />
                      <span>اختيار وتحديد يدوي للمنتجات التي ترغب بحذفها من CSV ({csvProducts.length})</span>
                    </button>
                  )}

                  <div className="border-t border-stone-200/80 pt-3 mt-3">
                    <p className="text-[11px] font-bold text-stone-400 mb-2 uppercase tracking-wider">خيارات إضافية للمتجر</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleResetToDefaultProducts}
                        className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>استعادة المنتجات الافتراضية</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllProducts}
                        className="py-1.5 px-3 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="تفريغ كافة المنتجات تماماً"
                      >
                        <AlertCircle size={12} />
                        <span>مسح وتفريغ كل شيء ({products.length})</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content of Tab 2: Pick individual CSV items */}
              {csvModalTab === 'pick_items' && (
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="ابحث داخل منتجات CSV..."
                      value={csvModalSearch}
                      onChange={(e) => setCsvModalSearch(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:bg-white focus:border-oxford-blue font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const ids = csvProducts.map(p => p.id);
                        const allSelected = ids.every(id => selectedProductIds.includes(id));
                        if (allSelected) {
                          setSelectedProductIds(prev => prev.filter(id => !ids.includes(id)));
                        } else {
                          setSelectedProductIds(prev => Array.from(new Set([...prev, ...ids])));
                        }
                      }}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      تحديد / إلغاء الكل
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[45vh] border border-stone-200 rounded-xl divide-y divide-stone-100 bg-white">
                    {csvProducts
                      .filter(p => p.name.toLowerCase().includes(csvModalSearch.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(csvModalSearch.toLowerCase())))
                      .map((p) => {
                        const checked = selectedProductIds.includes(p.id);
                        return (
                          <div 
                            key={p.id}
                            onClick={() => handleToggleSelectProduct(p.id)}
                            className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 transition-colors ${
                              checked ? 'bg-oxford-blue/5' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleSelectProduct(p.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded border-stone-300 text-oxford-blue focus:ring-oxford-blue/20 cursor-pointer"
                              />
                              <img src={p.image} alt="" className="w-8 h-8 rounded object-cover border border-stone-100 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-bold text-stone-800 truncate">{p.name}</p>
                                <p className="text-[10px] text-stone-400 font-mono">
                                  {p.sku || `OXF-${p.id}`} | {p.price.toFixed(3)} د.ت
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                              CSV
                            </span>
                          </div>
                        );
                      })}
                    {csvProducts.length === 0 && (
                      <div className="p-6 text-center text-xs text-stone-400">
                        لا توجد أي منتجات مستوردة عبر CSV حالياً.
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-stone-500 font-medium">
                      المحدد لمسحه: <strong className="text-red-600">{csvProducts.filter(p => selectedProductIds.includes(p.id)).length}</strong> منتج
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCsvModalTab('options')}
                        className="px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                      >
                        رجوع
                      </button>
                      <button
                        type="button"
                        disabled={csvProducts.filter(p => selectedProductIds.includes(p.id)).length === 0}
                        onClick={handleClearSelectedProducts}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Trash2 size={13} />
                        <span>مسح المحدد من CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
