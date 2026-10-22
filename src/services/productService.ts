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
          return parsed.map((p: any) => {
            const safeImage = (p.image && typeof p.image === 'string' && p.image.trim() !== '') 
              ? p.image.trim() 
              : '/logo.svg';
            const validImages = Array.isArray(p.images) 
              ? p.images.filter((img: any) => typeof img === 'string' && img.trim() !== '') 
              : [];

            return {
              ...p,
              image: safeImage,
              images: validImages.length > 0 ? validImages : [safeImage],
              price: Number(p.price) || 0,
              compareAtPrice: p.compareAtPrice !== undefined && p.compareAtPrice !== null && p.compareAtPrice !== '' ? Number(p.compareAtPrice) : undefined,
              minPrice: p.minPrice !== undefined && p.minPrice !== null && p.minPrice !== '' ? Number(p.minPrice) : undefined,
              maxPrice: p.maxPrice !== undefined && p.maxPrice !== null && p.maxPrice !== '' ? Number(p.maxPrice) : undefined,
              discount: Number(p.discount) || 0,
              rating: Number(p.rating) || 5,
              reviewsCount: Number(p.reviewsCount) || 12,
            };
          });
        }
      } catch (e) {
        console.error('Failed to parse products from localStorage', e);
      }
    }
    return [];
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Dispatch a custom event to notify other parts of the app
    window.dispatchEvent(new Event('products_updated'));
  },

  // Sync with Firestore on startup or when requested
  syncWithFirestore: async (): Promise<{ syncedCount: number; isConnected: boolean; message?: string }> => {
    try {
      const colRef = collection(db, 'products');
      const snapshot = await getDocs(colRef);
      const localProducts = productService.getProducts();

      const remoteMap = new Map<number, Product>();
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const pId = Number(data.id) || Number(docSnap.id);
        const safeImg = (data.image && typeof data.image === 'string' && data.image.trim() !== '')
          ? data.image.trim()
          : '/logo.svg';
        const validImgs = Array.isArray(data.images)
          ? data.images.filter((img: any) => typeof img === 'string' && img.trim() !== '')
          : [];

        remoteMap.set(pId, {
          ...(data as Product),
          id: pId,
          image: safeImg,
          images: validImgs.length > 0 ? validImgs : [safeImg]
        });
      });

      // Merge: Keep all remote products, and push any local-only products to remote
      const mergedMap = new Map<number, Product>(remoteMap);
      const toUploadToCloud: Product[] = [];

      localProducts.forEach(lp => {
        if (!mergedMap.has(lp.id)) {
          mergedMap.set(lp.id, lp);
          toUploadToCloud.push(lp);
        }
      });

      // If we have local products that aren't in Firestore yet, batch write them
      if (toUploadToCloud.length > 0) {
        const CHUNK_SIZE = 400;
        for (let i = 0; i < toUploadToCloud.length; i += CHUNK_SIZE) {
          const chunk = toUploadToCloud.slice(i, i + CHUNK_SIZE);
          const batch = writeBatch(db);
          chunk.forEach(p => {
            const docRef = doc(db, 'products', String(p.id));
            batch.set(docRef, cleanForFirestore(p));
          });
          await batch.commit();
        }
      }

      const allMerged = Array.from(mergedMap.values()).sort((a, b) => a.id - b.id);
      productService.saveProducts(allMerged);

      return { 
        syncedCount: allMerged.length, 
        isConnected: true,
        message: `تمت المزامنة بنجاح! إجمالي السلع المتزامنة: ${allMerged.length}`
      };
    } catch (error: any) {
      console.warn('Firestore sync failed, continuing with local store:', error);
      const localProducts = productService.getProducts();
      return { 
        syncedCount: localProducts.length, 
        isConnected: false,
        message: `تعذر الاتصال بقاعدة البيانات السحابية، تم الاعتماد على الذاكرة المحلية (${localProducts.length} سلعة)`
      };
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

  updateProductsCategoryBulk: (ids: number[], newCategory: string, newSubcategory?: string): number => {
    const set = new Set(ids);
    const products = productService.getProducts();
    const updatedProducts = products.map(p => {
      if (set.has(p.id)) {
        return {
          ...p,
          category: newCategory,
          ...(newSubcategory !== undefined ? { subcategory: newSubcategory.trim() || undefined } : {})
        };
      }
      return p;
    });
    productService.saveProducts(updatedProducts);

    try {
      const batch = writeBatch(db);
      const CHUNK_SIZE = 400;
      const modified = updatedProducts.filter(p => set.has(p.id));
      for (let i = 0; i < modified.length; i += CHUNK_SIZE) {
        const chunk = modified.slice(i, i + CHUNK_SIZE);
        const b = writeBatch(db);
        chunk.forEach(p => {
          b.set(doc(db, 'products', String(p.id)), cleanForFirestore(p));
        });
        b.commit().catch(err => console.warn('Firestore bulk update error:', err));
      }
    } catch (e) {
      console.warn('Firestore bulk category update failed:', e);
    }

    return ids.length;
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
