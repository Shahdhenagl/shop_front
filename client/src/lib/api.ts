// SAFETY ENG API client — يقرأ منتجات Laravel الحقيقية مع fallback آمن للكتالوج المحلي.
import type { Product } from "./store";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ecommerce.pixelmindg.com/api").replace(/\/$/, "");

type ApiResponse = { status?: string; message?: string; data?: unknown };
type RawProduct = Record<string, any>;

function localized(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return String(object.ar ?? object.en ?? Object.values(object)[0] ?? fallback);
  }
  return fallback;
}

function imageUrl(value: unknown) {
  if (!value) return "";
  if (typeof value === "string" && /^https?:\/\//.test(value)) return value;
  const raw = typeof value === "object" ? (value as Record<string, unknown>).url ?? (value as Record<string, unknown>).image : value;
  if (!raw) return "";
  return /^https?:\/\//.test(String(raw)) ? String(raw) : `${API_BASE_URL.replace(/\/api$/, "")}/storage/${String(raw).replace(/^storage\//, "")}`;
}

function extractList(payload: ApiResponse) {
  const data = payload?.data as any;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
}

export function normalizeProduct(raw: RawProduct, index: number): Product {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const firstVariant = variants[0] || {};
  const price = Number(raw.price ?? firstVariant.price ?? 0);
  const category = localized(raw.category_name ?? raw.category, "حلول SAFETY ENG");
  const images = Array.isArray(raw.images) ? raw.images : [];
  const image = imageUrl(images[0]) || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=85";
  return {
    id: Number(raw.id ?? index + 1),
    name: localized(raw.name, "منتج SAFETY ENG"),
    category,
    price,
    oldPrice: Number(raw.compare_price ?? raw.old_price ?? price),
    badge: raw.discount_percentage ? `خصم ${raw.discount_percentage}%` : "متاح الآن",
    image,
    tone: ["coral", "teal", "lime", "peach", "blue", "yellow"][index % 6],
    description: localized(raw.description, "حل عملي من حلول SAFETY ENG."),
    specs: [raw.sku ? `SKU: ${raw.sku}` : "منتج أصلي", firstVariant.stock != null ? `متاح: ${firstVariant.stock}` : "متاح حسب المخزون", variants.length ? `${variants.length} خيارات` : "ضمان ودعم متاح"],
  };
}

export async function fetchProducts(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/products`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Products request failed: ${response.status}`);
  const payload = await response.json() as ApiResponse;
  const list = extractList(payload);
  return (list as RawProduct[]).map((item: RawProduct, index: number) => normalizeProduct(item, index));
}

export async function fetchCategories(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/categories`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Categories request failed: ${response.status}`);
  const payload = await response.json() as ApiResponse;
  return extractList(payload) as RawProduct[];
}

export { API_BASE_URL };
