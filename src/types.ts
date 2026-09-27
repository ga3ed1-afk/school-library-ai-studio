export interface Product {
  id: number;
  sku?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  size?: string;
  sizes?: string[];
  style?: string;
  styles?: string[];
  brand?: string;
  colors?: string[];
  merchantPrice?: number;
  discount?: number;
  productType?: string;
  weight?: string;
  features?: string;
  bulletPoints?: string[];
  publishDate?: string;
  publishTime?: string;
  publishStatus?: 'مجدول' | 'منشور' | 'مسودة';
  tags?: string[];
  keywords?: string;
  availability?: 'متوفر' | 'غير متوفر' | 'قريباً';
  minPrice?: number;
  maxPrice?: number;
  notes?: string;
  compareAtPrice?: number;
  rating?: number;
  reviewsCount?: number;
  source?: 'csv' | 'manual' | 'initial';
  isCsvImported?: boolean;
  csvBatchId?: string;
  csvFileName?: string;
  importedAt?: string;
}

export interface CsvBatchInfo {
  batchId: string;
  fileName: string;
  importedAt: string;
  productCount: number;
}


export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  name: string;
  icon: string;
  subcategories: string[];
  bannerImage?: string;
  itemCount?: number;
}

export interface Brand {
  name: string;
  logo: string;
}
