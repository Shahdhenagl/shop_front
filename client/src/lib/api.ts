// SAFETY ENG API client — يقرأ منتجات Laravel الحقيقية مع fallback آمن للكتالوج المحلي.
import { readCartEntries, readIds, saveCartEntries, saveIds, type CartEntry, type Product } from "./store";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ecommerce.pixelmindg.com/api").replace(/\/$/, "");
export const SERVICE_REQUEST_PATH = import.meta.env.VITE_SERVICE_REQUEST_PATH || "/service-requests";
export const SERVICE_ORDERS_PATH = import.meta.env.VITE_SERVICE_ORDERS_PATH || "/service-requests";

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
    variantId: firstVariant.id != null ? Number(firstVariant.id) : undefined,
    name: localized(raw.name, "منتج SAFETY ENG"),
    category,
    price,
    oldPrice: Number(raw.compare_price ?? raw.old_price ?? price),
    badge: raw.discount_percentage ? `خصم ${raw.discount_percentage}%` : "متاح الآن",
    image,
    tone: ["coral", "teal", "lime", "peach", "blue", "yellow"][index % 6],
    description: localized(raw.description, "حل عملي من حلول SAFETY ENG."),
    specs: [raw.sku ? `SKU: ${raw.sku}` : "منتج أصلي", firstVariant.stock != null ? `متاح: ${firstVariant.stock}` : "متاح حسب المخزون", variants.length ? `${variants.length} خيارات` : "ضمان ودعم متاح"],
    brand: localized(raw.brand_name ?? raw.brand ?? raw.manufacturer, "SAFETY ENG"),
    stock: firstVariant.stock != null || raw.stock != null ? Number(firstVariant.stock ?? raw.stock) : undefined,
    salesCount: raw.sales_count ?? raw.sold_count ?? raw.orders_count ?? undefined,
    ratingAverage: raw.rating_average ?? raw.average_rating ?? raw.rating ?? undefined,
    ratingCount: raw.rating_count ?? raw.reviews_count ?? raw.total_reviews ?? undefined,
    viewsCount: raw.views_count ?? raw.view_count ?? raw.total_views ?? undefined,
    isAvailable: raw.in_stock ?? raw.is_available ?? raw.is_active ?? undefined,
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

export type ApiUser = { id: number; name: string; email: string; phone?: string };
export type AuthResult = { access_token?: string; token?: string; user?: ApiUser };

async function request<T>(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("safety-eng-token");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { Accept: "application/json", ...(isFormData ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({})) as ApiResponse;
  if (!response.ok) { const error = new Error(payload.message || `API request failed: ${response.status}`); (error as Error & { status?: number }).status = response.status; throw error; }
  return payload as T & ApiResponse;
}

export async function register(input: Record<string, string>) { return request<AuthResult>("/auth/register", { method: "POST", body: JSON.stringify(input) }); }
export async function login(input: { email?: string; phone?: string; password: string }) {
  const result = await request<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify(input) });
  const data = result.data as AuthResult | undefined;
  const token = data?.access_token || data?.token;
  if (token) localStorage.setItem("safety-eng-token", token);
  return result;
}
export async function logout() { const result = await request("/auth/logout", { method: "POST" }); localStorage.removeItem("safety-eng-token"); return result; }
export async function getProductFromApi(id: string | number) { const result = await request<ApiResponse>(`/product/${id}`); const raw = (result.data as any)?.data ?? result.data; return normalizeProduct(raw as RawProduct, Number(id) - 1); }
export function hasAuthToken() { return Boolean(localStorage.getItem("safety-eng-token")); }
export async function getCurrentUser() { return request<ApiResponse>("/user"); }
export async function getFavorites() { return request<ApiResponse>("/favorites"); }
export async function getFavoriteIds() { const payload = await getFavorites(); const raw = (payload.data as any)?.data ?? payload.data ?? []; return Array.isArray(raw) ? raw.map((item: any) => Number(item.product_id ?? item.product?.id ?? item.id)).filter(Boolean) : []; }
export async function toggleFavoriteApi(product_id: number) { return request<ApiResponse>("/favorites", { method: "POST", body: JSON.stringify({ product_id }) }); }
export async function removeFavoriteApi(id: number) { return request<ApiResponse>(`/favorites/${id}`, { method: "DELETE" }); }
export type CloudCartEntry = { remoteId: number; productId: number; variantId: number; quantity: number };
export async function getCart() { return request<ApiResponse>("/cart"); }
export async function getCartEntriesFromApi(): Promise<CloudCartEntry[]> {
  const payload = await getCart();
  const raw = extractList(payload);
  return raw.map((item: any) => {
    const variant = item.product_variant ?? item.productVariant ?? {};
    const product = variant.product ?? item.product ?? {};
    return {
      remoteId: Number(item.id),
      productId: Number(item.product_id ?? product.id ?? 0),
      variantId: Number(item.product_variant_id ?? variant.id ?? 0),
      quantity: Number(item.quantity ?? 1),
    } satisfies CloudCartEntry;
  }).filter((item: CloudCartEntry) => item.remoteId && item.variantId && item.productId);
}
export async function addCartItem(product_variant_id: number, quantity: number) { return request<ApiResponse>("/cart", { method: "POST", body: JSON.stringify({ product_variant_id, quantity }) }); }
export async function removeCartItem(id: number) { return request<ApiResponse>(`/cart/${id}`, { method: "DELETE" }); }
export async function getOrderSummary() { return request<ApiResponse>("/order-summary"); }
export async function createOrder(input: Record<string, unknown> = {}) { return request<ApiResponse>("/orders", { method: "POST", body: JSON.stringify(input) }); }
export async function getOrders() { return request<ApiResponse>("/orders"); }
export async function getServiceRequests() { return request<ApiResponse>(SERVICE_ORDERS_PATH); }
export async function syncLocalAccountData() {
  if (!hasAuthToken()) return { favorites: 0, cart: 0 };
  const localFavoriteIds = readIds("fluxmart-favorites");
  const cloudFavoriteIds = await getFavoriteIds();
  for (const productId of localFavoriteIds.filter((id) => !cloudFavoriteIds.includes(id))) await toggleFavoriteApi(productId);
  const mergedFavoriteIds = Array.from(new Set([...cloudFavoriteIds, ...localFavoriteIds]));
  saveIds("fluxmart-favorites", mergedFavoriteIds);

  const localCart = readCartEntries();
  const cloudCart = await getCartEntriesFromApi();
  for (const line of localCart) {
    if (line.variantId && !cloudCart.some((item) => item.variantId === line.variantId)) await addCartItem(line.variantId, line.quantity);
  }
  const latestCloudCart = await getCartEntriesFromApi();
  const mappedCart: CartEntry[] = latestCloudCart.map((item) => ({ remoteId: item.remoteId, productId: item.productId, variantId: item.variantId, quantity: item.quantity, installationRequested: false, installationFee: 0 }));
  saveCartEntries(mappedCart);
  return { favorites: mergedFavoriteIds.length, cart: mappedCart.length };
}
export async function createServiceRequest(input: FormData | Record<string, unknown>) { const body = input instanceof FormData ? input : JSON.stringify(input); return request<ApiResponse>(SERVICE_REQUEST_PATH, { method: "POST", body }); }
