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

const initialOrders: CustomerOrder[] = [
  {
    id: '#ORD-7281',
    customer: 'أحمد بن علي',
    phone: '+216 22 333 444',
    address: 'نهج الحبيب بورقيبة، تونس العاصمة',
    city: 'تونس',
    date: '2024-03-20',
    subtotal: 118.500,
    shipping: 7.000,
    discount: 0,
    total: 125.500,
    shippingMethod: 'توصيل سريع (Aramex)',
    paymentMethod: 'الدفع عند الاستلام',
    status: 'تم التوصيل',
    items: [
      {
        id: 1,
        name: 'دفتر أكسفورد كلاسيك مسطر A4',
        price: 45.000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        color: 'Bleu'
      },
      {
        id: 2,
        name: 'محفظة أقلام جلدية فاخرة',
        price: 28.500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
        color: 'Noir'
      }
    ]
  },
  {
    id: '#ORD-7282',
    customer: 'سارة محمد',
    phone: '+216 98 123 456',
    address: 'حي النصر 2، أريانة',
    city: 'أريانة',
    date: '2024-03-21',
    subtotal: 45.000,
    shipping: 0,
    discount: 0,
    total: 45.000,
    shippingMethod: 'توصيل عادي',
    paymentMethod: 'الدفع عند الاستلام',
    status: 'قيد المعالجة',
    items: [
      {
        id: 3,
        name: 'مجموعة أقلام حبر جاف أكسفورد 10 قطع',
        price: 45.000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585336261026-785f7f9859f7?auto=format&fit=crop&q=80&w=600',
        color: 'Rouge'
      }
    ]
  },
  {
    id: '#ORD-7283',
    customer: 'ياسين بن عمر',
    phone: '+216 55 987 654',
    address: 'طريق المهدية كم 3، صفاقس',
    city: 'صفاقس',
    date: '2024-03-21',
    subtotal: 82.900,
    shipping: 7.000,
    discount: 0,
    total: 89.900,
    shippingMethod: 'توصيل سريع (Aramex)',
    paymentMethod: 'بطاقة بنكية',
    status: 'تم الشحن',
    items: [
      {
        id: 4,
        name: 'مصحف المعلم برواية ورش 24/17',
        price: 82.900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=600',
        color: 'Vert'
      }
    ]
  },
  {
    id: '#ORD-7284',
    customer: 'ليلى بن صالح',
    phone: '+216 20 555 777',
    address: 'شارع البيئة، سوسة',
    city: 'سوسة',
    date: '2024-03-22',
    subtotal: 210.000,
    shipping: 0,
    discount: 0,
    total: 210.000,
    shippingMethod: 'توصيل عادي',
    paymentMethod: 'الدفع عند الاستلام',
    status: 'قيد المعالجة',
    items: [
      {
        id: 5,
        name: 'حقيبة ظهر مدرسية مريحة ضد الماء',
        price: 210.000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
        color: 'Bleu'
      }
    ]
  }
];

export const orderService = {
  getOrders: (): CustomerOrder[] => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse orders from storage', e);
      }
    }
    return initialOrders;
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
