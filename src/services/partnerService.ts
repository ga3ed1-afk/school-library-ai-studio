import { brands as defaultBrands } from '../constants';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  category?: string;
  isActive: boolean;
  order: number;
}

const STORAGE_KEY = 'oxford_partners_data';

const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    name: 'مابيد (Maped)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Maped_logo.svg/1200px-Maped_logo.svg.png',
    description: 'شركة فرنسية رائدة في صناعة اللوازم المدرسية والهندسية عالية الدقة',
    website: 'https://www.maped.com',
    category: 'لوازم مدرسية وهندسة',
    isActive: true,
    order: 1
  },
  {
    id: 'p-2',
    name: 'ستيدتلر (Staedtler)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Staedtler_logo.svg/2560px-Staedtler_logo.svg.png',
    description: 'أعرق الشركات الألمانية لصناعة أدوات الكتابة والرسم الاحترافي',
    website: 'https://www.staedtler.com',
    category: 'أقلام وأدوات رسم',
    isActive: true,
    order: 2
  },
  {
    id: 'p-3',
    name: 'بايلوت (Pilot)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pilot_Pen_logo.svg/1280px-Pilot_Pen_logo.svg.png',
    description: 'رواد صناعة أقلام الحبر الجاف والسائل والجيل في العالم',
    website: 'https://www.pilotpen.com',
    category: 'أقلام جافة وجيل',
    isActive: true,
    order: 3
  },
  {
    id: 'p-4',
    name: 'كانسون (Canson)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Canson_logo.svg/1200px-Canson_logo.svg.png',
    description: 'أفخم وأجود أنواع الأوراق الفنية ودفاتر الرسم الاحترافية منذ 1557',
    website: 'https://en.canson.com',
    category: 'فنون جميلة وأوراق رسم',
    isActive: true,
    order: 4
  },
  {
    id: 'p-5',
    name: 'فابر كاستل (Faber-Castell)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Faber-Castell_logo.svg/2560px-Faber-Castell_logo.svg.png',
    description: 'أقدم وأكبر مصنع للأقلام الخشبية والألوان الفنية المعتمدة دولياً',
    website: 'https://www.faber-castell.com',
    category: 'ألوان خشبية وفنون',
    isActive: true,
    order: 5
  },
  {
    id: 'p-6',
    name: 'شنايدر (Schneider)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Schneider_Schreibger%C3%A4te_logo.svg/1200px-Schneider_Schreibger%C3%A4te_logo.svg.png',
    description: 'جودة الصناعة الألمانية في أدوات الكتابة الصديقة للبيئة',
    website: 'https://schneiderpen.com',
    category: 'أدوات مكتبية وكتابة',
    isActive: true,
    order: 6
  },
  {
    id: 'p-7',
    name: 'بيك (BIC)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bic_logo.svg/1200px-Bic_logo.svg.png',
    description: 'العلامة الأشهر عالمياً في أقلام الحبر الجاف والتصحيح والقرطاسية اليومية',
    website: 'https://www.bic.com',
    category: 'قرطاسية يومية',
    isActive: true,
    order: 7
  },
  {
    id: 'p-8',
    name: 'ميلان (Milan)',
    logo: 'https://milan.es/images/logo_milan.svg',
    description: 'تصاميم إسبانية مبتكرة في المماحي، البرايات واللوازم المدرسية الأنيقة',
    website: 'https://www.milan.es',
    category: 'لوازم مدرسية مبتكرة',
    isActive: true,
    order: 8
  }
];

class PartnerService {
  private partners: Partner[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.partners = JSON.parse(stored);
      } else {
        this.partners = INITIAL_PARTNERS;
        this.saveToStorage();
      }
    } catch {
      this.partners = INITIAL_PARTNERS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.partners));
      window.dispatchEvent(new CustomEvent('partners_updated'));
    } catch (e) {
      console.error('Failed to save partners', e);
    }
  }

  getPartners(onlyActive: boolean = false): Partner[] {
    const list = [...this.partners].sort((a, b) => a.order - b.order);
    if (onlyActive) {
      return list.filter(p => p.isActive);
    }
    return list;
  }

  getPartnerById(id: string): Partner | undefined {
    return this.partners.find(p => p.id === id);
  }

  addPartner(partnerData: Omit<Partner, 'id' | 'order'>): Partner {
    const newPartner: Partner = {
      ...partnerData,
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      order: this.partners.length + 1
    };
    this.partners.push(newPartner);
    this.saveToStorage();
    return newPartner;
  }

  updatePartner(id: string, updates: Partial<Partner>): boolean {
    const index = this.partners.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.partners[index] = {
      ...this.partners[index],
      ...updates
    };
    this.saveToStorage();
    return true;
  }

  deletePartner(id: string): boolean {
    const prevLen = this.partners.length;
    this.partners = this.partners.filter(p => p.id !== id);
    if (this.partners.length !== prevLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  togglePartnerStatus(id: string): boolean {
    const partner = this.partners.find(p => p.id === id);
    if (partner) {
      partner.isActive = !partner.isActive;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  resetToDefault() {
    this.partners = INITIAL_PARTNERS;
    this.saveToStorage();
  }
}

export const partnerService = new PartnerService();
