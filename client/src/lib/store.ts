// FluxMart store model — ورق وبيكسل: بيانات موحدة لتفاصيل المنتج والمفضلة والسلة.
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  badge: string;
  image: string;
  tone: string;
  description: string;
  specs: string[];
};

export const products: Product[] = [
  { id: 1, name: "كاميرا Sony ZV-E10", category: "كاميرات", price: 28999, oldPrice: 31999, badge: "الأكثر طلباً", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85", tone: "coral", description: "كاميرا خفيفة لصناعة المحتوى اليومي، بفوكس سريع وصورة واضحة في كل لقطة.", specs: ["حساس APS-C بدقة 24.2MP", "فيديو 4K", "شاشة متحركة", "ضمان سنة"] },
  { id: 2, name: "شاشة LG UltraWide 34 بوصة", category: "شاشات", price: 18499, oldPrice: 20999, badge: "خصم 12%", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85", tone: "teal", description: "مساحة واسعة تساعدك تفتحي كل نوافذك وتشتغلي براحة أكبر.", specs: ["34 بوصة UltraWide", "دقة 3440×1440", "معدل تحديث 100Hz", "USB-C"] },
  { id: 3, name: "هارد SSD محمول 1TB", category: "هاردات", price: 4299, oldPrice: 4999, badge: "جديد", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85", tone: "lime", description: "مساحة سريعة وآمنة لكل ملفاتك، بحجم صغير يناسب شنطتك.", specs: ["سعة 1TB", "USB-C", "سرعة قراءة 1050MB/s", "مقاوم للصدمات"] },
  { id: 4, name: "طقم تنظيم مكتب أنيق", category: "أدوات مكتبية", price: 899, oldPrice: 1199, badge: "اختيارنا", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=85", tone: "peach", description: "رتبي مساحتك بقطع عملية تخلي المكتب أهدى وأسهل.", specs: ["4 قطع مكتبية", "خامة متينة", "ألوان هادئة", "مناسب للمكتب والمنزل"] },
  { id: 5, name: "كيبورد ميكانيكي أبيض", category: "أدوات مكتبية", price: 2199, oldPrice: 2599, badge: "محدود", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85", tone: "blue", description: "كتابة مريحة وصوت لطيف وتصميم يكمّل أي مكتب.", specs: ["مفاتيح ميكانيكية", "إضاءة قابلة للتخصيص", "اتصال USB-C", "تخطيط عربي/إنجليزي"] },
  { id: 6, name: "كاميرا فورية Instax Mini", category: "كاميرات", price: 4999, oldPrice: 5599, badge: "هدية لطيفة", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85", tone: "yellow", description: "خلي اللحظة ذكرى مطبوعة في نفس الوقت، بهدية مرحة لنفسك أو لحد بتحبيه.", specs: ["صور Instax Mini", "فلاش تلقائي", "عدسة سيلفي", "ألوان متعددة"] },
];

export function getProduct(id: string | number) { return products.find((product) => product.id === Number(id)); }
export function formatPrice(price: number) { return `${price.toLocaleString("ar-EG")} ج.م`; }
export function readIds(key: string): number[] { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
export function saveIds(key: string, ids: number[]) { localStorage.setItem(key, JSON.stringify(ids)); }
