import { CartItem } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs 
} from 'firebase/firestore';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  status: 'قيد المعالجة' | 'تم الشحن' | 'تم التوصيل' | 'ملغي';
}

const ORDERS_STORAGE_KEY = 'oxford_orders';

function cleanOrderForFirestore(order: any): any {
  if (order === null || order === undefined) return null;
  if (Array.isArray(order)) return order.map(cleanOrderForFirestore);
  if (typeof order === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(order)) {
      if (value !== undefined) {
        clean[key] = cleanOrderForFirestore(value);
      }
    }
    return clean;
  }
  return order;
}

const initialOrders: CustomerOrder[] = [];

export const orderService = {
  getOrders: (): CustomerOrder[] => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy mock orders from 2024
          const realOrders = parsed.filter(o => 
            o.id !== '#ORD-7281' && 
            o.id !== '#ORD-7282' && 
            o.id !== '#ORD-7283' && 
            o.id !== '#ORD-7284'
          );
          return realOrders;
        }
      } catch (e) {
        console.error('Failed to parse orders from storage', e);
      }
    }
    return [];
  },

  saveOrders: (orders: CustomerOrder[]) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders_updated'));
  },

  syncWithFirestore: async (): Promise<{ syncedCount: number; isConnected: boolean }> => {
    try {
      const colRef = collection(db, 'orders');
      const snapshot = await getDocs(colRef);

      if (!snapshot.empty) {
        const remoteOrders: CustomerOrder[] = [];
        snapshot.forEach(docSnap => {
          remoteOrders.push(docSnap.data() as CustomerOrder);
        });
        orderService.saveOrders(remoteOrders);
        return { syncedCount: remoteOrders.length, isConnected: true };
      } else {
        // Upload initial orders
        const currentOrders = orderService.getOrders();
        for (const o of currentOrders) {
          await setDoc(doc(db, 'orders', o.id.replace('#', '')), cleanOrderForFirestore(o));
        }
        return { syncedCount: currentOrders.length, isConnected: true };
      }
    } catch (e) {
      console.warn('Firestore orders sync failed, continuing local:', e);
      return { syncedCount: 0, isConnected: false };
    }
  },

  createOrder: (orderData: Omit<CustomerOrder, 'id' | 'date' | 'status'>): CustomerOrder => {
    const orders = orderService.getOrders();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newOrder: CustomerOrder = {
      ...orderData,
      id: `#ORD-${randomId}`,
      date: new Date().toISOString().split('T')[0],
      status: 'قيد المعالجة'
    };
    const updated = [newOrder, ...orders];
    orderService.saveOrders(updated);

    // Sync to Firestore in background
    try {
      setDoc(doc(db, 'orders', newOrder.id.replace('#', '')), cleanOrderForFirestore(newOrder))
        .catch(err => console.warn('Firestore order write error:', err));
    } catch (e) {
      console.warn('Firestore order write failed:', e);
    }

    return newOrder;
  },

  updateOrderStatus: (id: string, status: CustomerOrder['status']) => {
    const orders = orderService.getOrders();
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    orderService.saveOrders(updated);

    try {
      setDoc(doc(db, 'orders', id.replace('#', '')), { status }, { merge: true })
        .catch(err => console.warn('Firestore order status update error:', err));
    } catch (e) {
      console.warn('Firestore order status update failed:', e);
    }
  }
};
