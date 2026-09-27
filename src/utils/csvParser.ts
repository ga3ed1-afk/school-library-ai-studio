import { Product } from '../types';

export interface CsvFieldDef {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
}

export const CSV_FIELDS: CsvFieldDef[] = [
  { id: 'name', label: 'اسم المنتج', required: true, description: 'اسم المادة أو التعيين' },
  { id: 'price', label: 'السعر (د.ت)', required: false, description: 'سعر البيع' },
  { id: 'sku', label: 'رمز المنتج (SKU)', required: false, description: 'المرجع أو الكود أو الباركود' },
  { id: 'size', label: 'النوع / الحجم', required: false, description: 'الحجم، القياس، أو النوع' },
  { id: 'minPrice', label: 'السعر الأدنى (د.ت)', required: false, description: 'أدنى سعر' },
  { id: 'maxPrice', label: 'السعر الأقصى (د.ت)', required: false, description: 'أقصى سعر' },
  { id: 'category', label: 'الفئة / التصنيف', required: false, description: 'القسم أو الفئة' },
  { id: 'notes', label: 'ملاحظات', required: false, description: 'ملاحظات وتنبيهات المنتج' },
  { id: 'description', label: 'الوصف', required: false, description: 'شرح وتفاصيل المنتج' },
  { id: 'brand', label: 'الماركة / العلامة', required: false, description: 'الشركة المصنعة أو العلامة' },
  { id: 'image', label: 'رابط الصورة (URL)', required: false, description: 'رابط مباشر لصورة المنتج' },
  { id: 'colors', label: 'الألوان', required: false, description: 'الألوان المتاحة مفصولة بفواصل' },
  { id: 'availability', label: 'حالة التوفر', required: false, description: 'متوفر / غير متوفر' },
];

export const COLUMN_ALIASES: Record<string, string[]> = {
  name: [
    'nom', 'designation', 'désignation', 'designations', 'désignations',
    'article', 'articles', 'libelle', 'libellé', 'produit', 'produits',
    'name', 'product_name', 'product name', 'title', 'item', 'item_name', 'label', 'description_article',
    'اسم المنتج', 'اسم_المنتج', 'الاسم', 'اسم', 'عنوان', 'العنوان', 'المنتج', 'تسمية', 'تعيين', 'الصنف', 'المادة'
  ],
  sku: [
    'sku', 'ref', 'réf', 'reference', 'référence', 'references', 'références',
    'code', 'code article', 'code_article', 'code-barres', 'code barre', 'codebarre', 'barcode',
    'ean', 'ean13', 'id', 'item_id', 'matricule',
    'رمز المنتج', 'رمز_المنتج', 'الرمز', 'رمز', 'كود المنتج', 'كود_المنتج', 'كود', 'الكود', 'المرجع', 'مرجع', 'معرف', 'الباركود', 'باركود'
  ],
  price: [
    'prix', 'prix unitaire', 'pu', 'p.u', 'prix vente', 'prix de vente', 'pv', 'prix ttc', 'prix ht',
    'price', 'unit price', 'sale price', 'retail price', 'amount', 'cost', 'tarif',
    'السعر', 'سعر', 'سعر البيع', 'سعر_البيع', 'ثمن', 'الثمن', 'المبلغ', 'السعر الفردي', 'السعر الجملي', 'القيمة'
  ],
  minPrice: [
    'prix min', 'prix minimum', 'p min', 'min price', 'minprice', 'min_price', 'minimum price', 'min',
    'السعر الأدنى', 'السعر الادنى', 'سعر أدنى', 'سعر ادنى', 'أدنى سعر', 'ادنى سعر', 'أدنى', 'ادنى', 'أقل سعر', 'اقل سعر'
  ],
  maxPrice: [
    'prix max', 'prix maximum', 'p max', 'max price', 'maxprice', 'max_price', 'maximum price', 'max',
    'السعر الأقصى', 'السعر الاقصى', 'سعر أقصى', 'سعر اقصى', 'أقصى سعر', 'اقصى سعر', 'أقصى', 'اقصى', 'أعلى سعر', 'اعلى سعر'
  ],
  size: [
    'taille', 'format', 'dimension', 'dimensions', 'type', 'modele', 'modèle', 'pointure', 'calibre', 'volume', 'capacite', 'capacité',
    'size', 'capacity', 'variant', 'spec', 'specs',
    'النوع/الحجم', 'النوع / الحجم', 'النوع أو الحجم', 'النوع او الحجم', 'الحجم/النوع', 'النوع', 'الحجم', 'المقاس', 'القياس', 'العيار', 'السعة', 'نوع', 'حجم', 'مقاس'
  ],
  category: [
    'categorie', 'catégorie', 'categories', 'catégories', 'famille', 'sous-famille', 'rayon', 'classe', 'section',
    'category', 'cat', 'department', 'collection', 'group', 'family',
    'الفئة', 'فئة', 'التصنيف', 'تصنيف', 'القسم', 'قسم', 'المجموعة', 'العائلة'
  ],
  notes: [
    'remarque', 'remarques', 'obs', 'observation', 'observations', 'note', 'notes', 'comment', 'comments', 'avis',
    'ملاحظات', 'ملاحظة', 'ملاحظه', 'تعليق', 'تعليقات', 'تنبيه', 'تنبيهات', 'ملاحظة هامة'
  ],
  description: [
    'description', 'desc', 'details', 'détails', 'caracteristiques', 'caractéristiques', 'presentation', 'présentation',
    'الوصف', 'وصف', 'التفاصيل', 'تفاصيل', 'شرح', 'نبذة'
  ],
  image: [
    'image', 'photo', 'visuel', 'img', 'url', 'lien', 'picture', 'src', 'image_url', 'photo_url', 'link',
    'الصورة', 'صورة', 'رابط الصورة', 'رابط_الصورة', 'رابط', 'الصور', 'صور', 'لينك'
  ],
  brand: [
    'marque', 'fabricant', 'brand', 'vendor', 'editeur', 'éditeur', 'maker', 'fournisseur',
    'الماركة', 'ماركة', 'العلامة', 'العلامة التجارية', 'الشركة', 'المصنع', 'المورد'
  ],
  colors: [
    'couleur', 'couleurs', 'coloris', 'color', 'colors', 'colour', 'colours',
    'الوان', 'الألوان', 'اللون', 'ألوان', 'لون', 'الوان متوفرة', 'الألوان المتوفرة'
  ],
  availability: [
    'disponibilite', 'disponibilité', 'dispo', 'etat', 'état', 'status', 'availability', 'stock', 'qte', 'quantite', 'quantité',
    'التوفر', 'توفر', 'حالة التوفر', 'حالة_التوفر', 'الحالة', 'المخزون', 'الكمية', 'حالة'
  ]
};

/**
 * Detect the delimiter used in a CSV string (, ; \t |)
 */
export function detectCsvDelimiter(text: string): string {
  const clean = text.replace(/^[\uFEFF\uFFFE]/, '').trim();
  const sampleLines = clean.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0).slice(0, 5);
  if (sampleLines.length === 0) return ',';

  const delimiters = [',', ';', '\t', '|'];
  const scores: Record<string, number> = { ',': 0, ';': 0, '\t': 0, '|': 0 };

  for (const delim of delimiters) {
    let lineCounts: number[] = [];
    for (const line of sampleLines) {
      let count = 0;
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"' || c === "'") inQuotes = !inQuotes;
        else if (c === delim && !inQuotes) count++;
      }
      lineCounts.push(count);
    }
    // High score if delimiter appears multiple times and consistently across lines
    const minCount = Math.min(...lineCounts);
    const maxCount = Math.max(...lineCounts);
    if (minCount > 0 && maxCount - minCount <= 1) {
      scores[delim] = minCount * 10;
    } else {
      scores[delim] = lineCounts.reduce((a, b) => a + b, 0);
    }
  }

  let best = ',';
  let highest = -1;
  for (const d of delimiters) {
    if (scores[d] > highest) {
      highest = scores[d];
      best = d;
    }
  }
  return best;
}

/**
 * Parses raw CSV text into a 2D array of string cells according to RFC 4180.
 * Accurately handles newlines and delimiters inside quotes, escaped quotes, and various delimiters.
 */
export function parseCsvRows(text: string, customDelimiter?: string): { rows: string[][]; delimiterUsed: string } {
  // Strip BOM (Byte Order Mark) and non-printable prefixes
  const cleanText = text.replace(/^[\uFEFF\uFFFE]/, '');
  const delimiter = customDelimiter || detectCsvDelimiter(cleanText);

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip CRLF
      }
      currentRow.push(currentCell.trim());
      // Only keep row if it has at least one non-empty cell
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // Push final cell/row if remaining
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return { rows, delimiterUsed: delimiter };
}

/**
 * Parses price values correctly supporting Tunisian / French decimal commas (e.g. 18,500 or 12.500 DT)
 */
export function parsePrice(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  let s = String(val).trim();
  // Strip currency words and non-numeric except . , -
  s = s.replace(/[^\d.,-]/g, '');
  if (!s) return 0;

  if (s.includes('.') && s.includes(',')) {
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    if (lastComma > lastDot) {
      // e.g. 1.250,500 -> 1250.500
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // e.g. 1,250.500 -> 1250.500
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    // Only comma e.g. 18,500 -> 18.500
    s = s.replace(',', '.');
  }

  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

/**
 * Auto-detects mapping between known fields and column indices based on header names.
 */
export function autoDetectColumnMapping(headers: string[]): Record<string, number> {
  const mapping: Record<string, number> = {};
  const cleanedHeaders = headers.map(h => 
    h.toLowerCase()
     .replace(/["'’`]/g, '')
     .replace(/[\u200B-\u200D\uFEFF]/g, '')
     .trim()
  );

  const usedIndices = new Set<number>();

  // 1. Exact match first
  for (const field of CSV_FIELDS) {
    const aliases = COLUMN_ALIASES[field.id] || [];
    const exactIdx = cleanedHeaders.findIndex((h, idx) => !usedIndices.has(idx) && aliases.some(a => h === a.toLowerCase()));
    if (exactIdx !== -1) {
      mapping[field.id] = exactIdx;
      usedIndices.add(exactIdx);
    }
  }

  // 2. Substring match for remaining fields
  for (const field of CSV_FIELDS) {
    if (mapping[field.id] !== undefined) continue;
    const aliases = COLUMN_ALIASES[field.id] || [];
    const subIdx = cleanedHeaders.findIndex((h, idx) => {
      if (usedIndices.has(idx)) return false;
      return aliases.some(a => {
        const al = a.toLowerCase();
        return h.includes(al) || al.includes(h);
      });
    });
    if (subIdx !== -1) {
      mapping[field.id] = subIdx;
      usedIndices.add(subIdx);
    }
  }

  // 3. Fallback for 'name' if still not found
  if (mapping['name'] === undefined) {
    // Find the first column that isn't mapped, has some text, and isn't purely numbers
    const fallbackIdx = cleanedHeaders.findIndex((_, idx) => !usedIndices.has(idx));
    if (fallbackIdx !== -1) {
      mapping['name'] = fallbackIdx;
      usedIndices.add(fallbackIdx);
    }
  }

  return mapping;
}

/**
 * Converts parsed CSV rows into product objects using the given column mapping.
 */
export function convertRowsToProducts(
  rows: string[][],
  mapping: Record<string, number>
): Omit<Product, 'id'>[] {
  if (rows.length <= 1) return [];

  const nameIdx = mapping['name'];
  if (nameIdx === undefined) return [];

  const skuIdx = mapping['sku'];
  const priceIdx = mapping['price'];
  const minPriceIdx = mapping['minPrice'];
  const maxPriceIdx = mapping['maxPrice'];
  const sizeIdx = mapping['size'];
  const categoryIdx = mapping['category'];
  const notesIdx = mapping['notes'];
  const descIdx = mapping['description'];
  const brandIdx = mapping['brand'];
  const imgIdx = mapping['image'];
  const colorsIdx = mapping['colors'];
  const availIdx = mapping['availability'];

  const products: Omit<Product, 'id'>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i];
    if (!cols || cols.length === 0 || cols.every(c => !c)) continue;

    const rawName = cols[nameIdx];
    const name = rawName ? rawName.trim() : '';
    if (!name) continue;

    const rawPrice = priceIdx !== undefined ? cols[priceIdx] : '';
    let price = parsePrice(rawPrice);

    const rawMinPrice = minPriceIdx !== undefined ? cols[minPriceIdx] : '';
    const minPrice = rawMinPrice ? parsePrice(rawMinPrice) : undefined;

    const rawMaxPrice = maxPriceIdx !== undefined ? cols[maxPriceIdx] : '';
    const maxPrice = rawMaxPrice ? parsePrice(rawMaxPrice) : undefined;

    if (price === 0 && minPrice && minPrice > 0) {
      price = minPrice;
    }

    const sku = skuIdx !== undefined && cols[skuIdx] ? cols[skuIdx].trim() : '';
    const size = sizeIdx !== undefined && cols[sizeIdx] ? cols[sizeIdx].trim() : '';
    const category = categoryIdx !== undefined && cols[categoryIdx] ? cols[categoryIdx].trim() : '';
    const notes = notesIdx !== undefined && cols[notesIdx] ? cols[notesIdx].trim() : '';
    const description = descIdx !== undefined && cols[descIdx] ? cols[descIdx].trim() : '';
    const brand = brandIdx !== undefined && cols[brandIdx] ? cols[brandIdx].trim() : '';
    const rawImage = imgIdx !== undefined && cols[imgIdx] ? cols[imgIdx].trim() : '';
    const defaultPlaceholder = "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800";
    const image = rawImage || defaultPlaceholder;

    const rawColors = colorsIdx !== undefined && cols[colorsIdx] ? cols[colorsIdx] : '';
    const colors = rawColors
      ? rawColors.split(/[,،;]/).map(c => c.trim()).filter(Boolean)
      : [];

    const rawAvail = availIdx !== undefined && cols[availIdx] ? cols[availIdx].trim() : '';
    let availability: 'متوفر' | 'غير متوفر' | 'قريباً' = 'متوفر';
    if (rawAvail) {
      if (rawAvail.includes('غير') || rawAvail.toLowerCase().includes('non') || rawAvail.toLowerCase().includes('out') || rawAvail === '0') {
        availability = 'غير متوفر';
      } else if (rawAvail.includes('قريب') || rawAvail.toLowerCase().includes('bientot')) {
        availability = 'قريباً';
      }
    }

    products.push({
      name,
      sku,
      price,
      minPrice: minPrice && minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice && maxPrice > 0 ? maxPrice : undefined,
      size,
      category,
      notes,
      description,
      brand,
      image,
      images: image ? [image] : [],
      colors,
      availability,
      publishStatus: 'منشور',
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '12:00'
    });
  }

  return products;
}
