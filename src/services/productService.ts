import { Product, CsvBatchInfo } from '../types';
import { products as initialProducts } from '../constants';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

const STORAGE_KEY = 'app_products';

function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = cleanForFirestore(value);
      }
    }
    return clean;
  }
  return obj;
}

export const productService = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((p: any) => ({
            ...p,
            price: Number(p.price) || 0,
            compareAtPrice: p.compareAtPrice !== undefined && p.compareAtPrice !== null && p.compareAtPrice !== '' ? Number(p.compareAtPrice) : undefined,
            minPrice: p.minPrice !== undefined && p.minPrice !== null && p.minPrice !== '' ? Number(p.minPrice) : undefined,
            maxPrice: p.maxPrice !== undefined && p.maxPrice !== null && p.maxPrice !== '' ? Number(p.maxPrice) : undefined,
            discount: Number(p.discount) || 0,
            rating: Number(p.rating) || 5,
            reviewsCount: Number(p.reviewsCount) || 65,
            csvBatchId: p.csvBatchId || (p.source === 'csv' || p.isCsvImported || p.id > 10 ? (p.csvFileName ? `batch_${p.csvFileName}` : 'batch_legacy') : undefined),
            csvFileName: p.csvFileName || (p.source === 'csv' || p.isCsvImported || p.id > 10 ? 'ملف CSV مستورد' : undefined),
            importedAt: p.importedAt || (p.source === 'csv' || p.isCsvImported || p.id > 10 ? 'سابقاً' : undefined),
          }));
        }
      } catch (e) {
        console.error('Failed to parse products from localStorage', e);
      }
    }
    return initialProducts;
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Dispatch a custom event to notify other parts of the app
    window.dispatchEvent(new Event('products_updated'));
  },

  // Sync with Firestore on startup or when requested
  syncWithFirestore: async (): Promise<{ syncedCount: number; isConnected: boolean }> => {
    try {
      const colRef = collection(db, 'products');
      const snapshot = await getDocs(colRef);

      if (!snapshot.empty) {
        const remoteProducts: Product[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          remoteProducts.push({
            ...(data as Product),
            id: Number(data.id) || Number(docSnap.id)
          });
        });
        remoteProducts.sort((a, b) => a.id - b.id);
        productService.saveProducts(remoteProducts);
        return { syncedCount: remoteProducts.length, isConnected: true };
      } else {
        // Upload initial / current products to Firestore so cloud database has the catalog
        const currentProducts = productService.getProducts();
        if (currentProducts.length > 0) {
          const batch = writeBatch(db);
          currentProducts.forEach(p => {
            const docRef = doc(db, 'products', String(p.id));
            batch.set(docRef, cleanForFirestore(p));
          });
          await batch.commit();
        }
        return { syncedCount: currentProducts.length, isConnected: true };
      }
    } catch (error) {
      console.warn('Firestore sync failed, continuing with local store:', error);
      return { syncedCount: 0, isConnected: false };
    }
  },

  addProduct: (product: Omit<Product, 'id'>): Product => {
    const products = productService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      source: 'manual'
    };
    const updatedProducts = [...products, newProduct];
    productService.saveProducts(updatedProducts);

    // Sync to Firestore in background
    try {
      setDoc(doc(db, 'products', String(newProduct.id)), cleanForFirestore(newProduct))
        .catch(err => console.warn('Firestore background write error:', err));
    } catch (e) {
      console.warn('Firestore write failed:', e);
    }

    return newProduct;
  },

  addProductsBulk: (
    newItems: Omit<Product, 'id'>[],
    meta?: { fileName?: string; batchId?: string; importedAt?: string }
  ): Product[] => {
    const products = productService.getProducts();
    let maxId = Math.max(0, ...products.map(p => p.id));
    const batchId = meta?.batchId || `batch_${Date.now()}`;
    const fileName = meta?.fileName || 'ملف_مستورد.csv';
    const importedAt = meta?.importedAt || new Date().toLocaleString('ar-TN', { dateStyle: 'short', timeStyle: 'short' });

    const created: Product[] = newItems.map(item => {
      maxId += 1;
      return {
        ...item,
        id: maxId,
        sku: item.sku || '',
        source: 'csv',
        isCsvImported: true,
        csvBatchId: batchId,
        csvFileName: fileName,
        importedAt: importedAt,
      };
    });
    const updatedProducts = [...products, ...created];
    productService.saveProducts(updatedProducts);

    // Sync batch to Firestore in chunks of 400
    try {
      const CHUNK_SIZE = 400;
      for (let i = 0; i < created.length; i += CHUNK_SIZE) {
        const chunk = created.slice(i, i + CHUNK_SIZE);
        const batch = writeBatch(db);
        chunk.forEach(p => {
          const docRef = doc(db, 'products', String(p.id));
          batch.set(docRef, cleanForFirestore(p));
        });
        batch.commit().catch(err => console.warn('Firestore batch write error:', err));
      }
    } catch (e) {
      console.warn('Firestore bulk write failed:', e);
    }

    return created;
  },

  isCsvProduct: (product: Product): boolean => {
    return Boolean(product.isCsvImported || product.source === 'csv' || Boolean(product.csvBatchId) || product.id > 10);
  },

  getCsvBatches: (): CsvBatchInfo[] => {
    const products = productService.getProducts();
    const csvItems = products.filter(p => productService.isCsvProduct(p));
    const batchesMap = new Map<string, { batchId: string; fileName: string; importedAt: string; productCount: number }>();

    csvItems.forEach(p => {
      const batchId = p.csvBatchId || (p.csvFileName ? `batch_${p.csvFileName}` : 'batch_legacy');
      const fileName = p.csvFileName || 'ملف CSV مستورد';
      const importedAt = p.importedAt || 'مستورد مسبقاً';

      if (!batchesMap.has(batchId)) {
        batchesMap.set(batchId, {
          batchId,
          fileName,
          importedAt,
          productCount: 0
        });
      }
      batchesMap.get(batchId)!.productCount += 1;
    });

    return Array.from(batchesMap.values());
  },

  deleteCsvBatch: (batchId: string): number => {
    const products = productService.getProducts();
    const toDeleteIds = new Set<number>();

    products.forEach(p => {
      if (productService.isCsvProduct(p)) {
        const pBatchId = p.csvBatchId || (p.csvFileName ? `batch_${p.csvFileName}` : 'batch_legacy');
        if (pBatchId === batchId || p.csvFileName === batchId) {
          toDeleteIds.add(p.id);
        }
      }
    });

    const updatedProducts = products.filter(p => !toDeleteIds.has(p.id));
    productService.saveProducts(updatedProducts);

    // Sync deletion to Firestore
    try {
      const batch = writeBatch(db);
      toDeleteIds.forEach(id => {
        batch.delete(doc(db, 'products', String(id)));
      });
      batch.commit().catch(err => console.warn('Firestore batch delete error:', err));
    } catch (e) {
      console.warn('Firestore batch delete failed:', e);
    }

    return toDeleteIds.size;
  },

  updateProduct: (product: Product) => {
    const products = productService.getProducts();
    const updatedProducts = products.map(p => p.id === product.id ? product : p);
    productService.saveProducts(updatedProducts);

    try {
      setDoc(doc(db, 'products', String(product.id)), cleanForFirestore(product))
        .catch(err => console.warn('Firestore update error:', err));
    } catch (e) {
      console.warn('Firestore update error:', e);
    }
  },

  deleteProduct: (id: number) => {
    const products = productService.getProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    productService.saveProducts(updatedProducts);

    try {
      deleteDoc(doc(db, 'products', String(id)))
        .catch(err => console.warn('Firestore delete error:', err));
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
  },

  deleteProductsBulk: (ids: number[]) => {
    const set = new Set(ids);
    const products = productService.getProducts();
    const updatedProducts = products.filter(p => !set.has(p.id));
    productService.saveProducts(updatedProducts);

    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        batch.delete(doc(db, 'products', String(id)));
      });
      batch.commit().catch(err => console.warn('Firestore bulk delete error:', err));
    } catch (e) {
      console.warn('Firestore bulk delete error:', e);
    }
  },

  deleteCsvProductsOnly: (): number => {
    const products = productService.getProducts();
    const csvIds = products.filter(p => productService.isCsvProduct(p)).map(p => p.id);
    const updatedProducts = products.filter(p => !productService.isCsvProduct(p));
    productService.saveProducts(updatedProducts);

    try {
      const batch = writeBatch(db);
      csvIds.forEach(id => {
        batch.delete(doc(db, 'products', String(id)));
      });
      batch.commit().catch(err => console.warn('Firestore csv delete error:', err));
    } catch (e) {
      console.warn('Firestore csv delete error:', e);
    }

    return csvIds.length;
  },

  clearAllProducts: () => {
    productService.saveProducts([]);
  },

  resetToInitialProducts: () => {
    productService.saveProducts(initialProducts);
    try {
      const batch = writeBatch(db);
      initialProducts.forEach(p => {
        batch.set(doc(db, 'products', String(p.id)), cleanForFirestore(p));
      });
      batch.commit().catch(err => console.warn('Firestore reset error:', err));
    } catch (e) {
      console.warn('Firestore reset error:', e);
    }
  }
};
