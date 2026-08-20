// SAFETY ENG store model — حلول مراقبة وأمن وحضور وشاشات، مع بيانات موحدة للمتجر.
export type Product = {
  id: number; name: string; category: string; price: number; oldPrice: number; badge: string; image: string; tone: string; description: string; specs: string[];
};

export const products: Product[] = [
  { id: 1, name: "كاميرا مراقبة IP خارجية 4MP", category: "كاميرات مراقبة", price: 2499, oldPrice: 2999, badge: "الأكثر طلباً", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=85", tone: "coral", description: "كاميرا خارجية مقاومة للعوامل الجوية برؤية ليلية واضحة، مناسبة للبيوت والمداخل والمخازن.", specs: ["دقة 4MP", "رؤية ليلية حتى 30 متر", "مقاومة للماء والغبار", "تركيب وضبط اختياري"] },
  { id: 2, name: "جهاز تسجيل NVR لـ 8 كاميرات", category: "أنظمة أمن", price: 6799, oldPrice: 7499, badge: "حل متكامل", image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=85", tone: "teal", description: "مركز تسجيل ومتابعة لنظام المراقبة مع إدارة سهلة من الموبايل وشاشة العرض.", specs: ["8 قنوات IP", "دعم مشاهدة عن بعد", "ضغط H.265", "إعداد شبكة كامل"] },
  { id: 3, name: "جهاز حضور وانصراف بالبصمة", category: "بصمة وحضور", price: 3899, oldPrice: 4499, badge: "جديد", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85", tone: "lime", description: "حل عملي لتسجيل حضور فريقك بالبصمة أو الوجه مع تقارير واضحة للإدارة.", specs: ["بصمة ووجه", "شاشة 3.5 بوصة", "تصدير تقارير USB", "تدريب وتشغيل"] },
  { id: 4, name: "طقم تحكم في الدخول للأبواب", category: "تحكم وأبواب", price: 3299, oldPrice: 3799, badge: "اختيارنا", image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=85", tone: "peach", description: "طقم كامل لتنظيم الدخول والخروج باستخدام كارت أو بصمة مع زر خروج وقفل كهربائي.", specs: ["قارئ كروت وبصمة", "قفل كهربائي", "زر خروج وحساس باب", "تركيب وبرمجة"] },
  { id: 5, name: "شاشة عرض 43 بوصة للمراقبة", category: "شاشات", price: 8999, oldPrice: 9999, badge: "عرض خاص", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85", tone: "blue", description: "شاشة واضحة لمتابعة الكاميرات وعرض التقارير في غرف الأمن والاستقبال.", specs: ["43 بوصة 4K", "مداخل HDMI متعددة", "مناسبة للتشغيل المستمر", "تثبيت جداري متاح"] },
  { id: 6, name: "طقم كاميرات 4 قنوات مع هارد", category: "كاميرات مراقبة", price: 11999, oldPrice: 13499, badge: "باكدج كامل", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85", tone: "yellow", description: "ابدئي نظام المراقبة من غير حيرة: أربع كاميرات، جهاز تسجيل، هارد وتركيب أساسي.", specs: ["4 كاميرات Full HD", "DVR وهارد 1TB", "مشاهدة من الموبايل", "معاينة وتركيب أساسي"] },
];
export function getProduct(id: string | number) { return products.find((product) => product.id === Number(id)); }
export function formatPrice(price: number) { return `${price.toLocaleString("ar-EG")} ج.م`; }
export function readIds(key: string): number[] { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
export function saveIds(key: string, ids: number[]) { localStorage.setItem(key, JSON.stringify(ids)); }
